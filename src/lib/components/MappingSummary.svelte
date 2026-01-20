<script lang="ts">
	import PreviewTable from './PreviewTable.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { generateOutputCSV, downloadCSV, generatePreview } from '$lib/utils/csvGenerator';
	import { mappingStore, mappingActions } from '$lib/stores/mappingStore';
	import { authStore } from '$lib/stores/authStore';
	import { sendProcessingCompleteEmail, sendErrorEmail } from '$lib/utils/emailService';
	import { getUserFriendlyError, logError } from '$lib/utils/errorHandler';
	import { exportData, downloadExport, type ExportFormat } from '$lib/utils/exportFormats';
	import type { OutputSummary } from '$lib/types';

	let isGenerating = $state(false);
	let outputSummary = $state<OutputSummary | null>(null);
	let preview = $state<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
	let error = $state<string | null>(null);
	let exportFormat = $state<ExportFormat>('csv');
	let showExportOptions = $state(false);

	// Generate preview when store changes
	$effect(() => {
		if ($mappingStore.schemaFile && $mappingStore.dataFile && $mappingStore.mappings.length > 0) {
			preview = generatePreview(
				$mappingStore.schemaFile,
				$mappingStore.dataFile,
				$mappingStore.mappings
			);
		}
	});

	async function handleGenerateAndDownload() {
		if (!$mappingStore.schemaFile || !$mappingStore.dataFile) return;

		isGenerating = true;
		error = null;

		try {
			// Use advanced export for non-CSV formats
			if (exportFormat !== 'csv') {
				const result = await exportData({
					format: exportFormat,
					schemaFile: $mappingStore.schemaFile,
					dataFile: $mappingStore.dataFile,
					mappings: $mappingStore.mappings,
					excelSheetName: 'Mapped Data',
					sqlTableName: 'mapped_data',
					sqlDialect: 'postgresql'
				});

				downloadExport(result.data, result.filename, result.mimeType);

				// Generate summary for email
				const csvResult = generateOutputCSV(
					$mappingStore.schemaFile,
					$mappingStore.dataFile,
					$mappingStore.mappings
				);
				outputSummary = csvResult.summary;
			} else {
				// Use standard CSV export
				const result = generateOutputCSV(
					$mappingStore.schemaFile,
					$mappingStore.dataFile,
					$mappingStore.mappings
				);
				outputSummary = result.summary;

				// Small delay for UX
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Download the file
				downloadCSV(result.data, result.filename);
			}

			// Send email notification if user is authenticated
			const user = $authStore.user;
			if (user?.email && outputSummary) {
				try {
					await sendProcessingCompleteEmail(
						user.email,
						user.user_metadata?.full_name || 'User',
						$mappingStore.dataFile.filename,
						outputSummary.totalRows
					);
				} catch (emailError) {
					console.error('Failed to send completion email:', emailError);
					// Don't fail the export if email fails
				}
			}
		} catch (err) {
			// Log error with context
			const user = $authStore.user;
			logError(err, {
				userId: user?.id,
				userEmail: user?.email,
				action: 'csv_generation',
				metadata: {
					schemaFile: $mappingStore.schemaFile?.filename,
					dataFile: $mappingStore.dataFile?.filename,
					mappingCount: $mappingStore.mappings.length,
					exportFormat
				}
			});

			// Get user-friendly error
			const friendlyError = getUserFriendlyError(err, {
				userId: user?.id,
				userEmail: user?.email
			});
			
			// Show error to user
			error = friendlyError.message;
			
			// Send error email if user is authenticated
			if (user?.email) {
				try {
					await sendErrorEmail(
						user.email,
						user.user_metadata?.full_name || 'User',
						friendlyError.message,
						$mappingStore.dataFile?.filename
					);
				} catch (emailError) {
					console.error('Failed to send error email:', emailError);
				}
			}
		} finally {
			isGenerating = false;
		}
	}

	function goBack() {
		mappingActions.goToMapping();
	}

	function startOver() {
		mappingActions.reset();
	}

	// Calculate summary stats
	let mappedCount = $derived(
		$mappingStore.mappings.filter((m) => m.action === 'map' || m.action === 'new').length
	);
	let ignoredCount = $derived($mappingStore.mappings.filter((m) => m.action === 'ignore').length);
	let newCount = $derived($mappingStore.mappings.filter((m) => m.action === 'new').length);
</script>

<div class="summary-container">
	<!-- Header -->
	<header class="summary-header">
		<div class="header-left">
			<button class="back-btn" onclick={goBack} aria-label="Go back">
				← Back
			</button>
			<h1 class="summary-title">Review & Export</h1>
		</div>
		<div class="header-right">
			<button class="secondary-btn" onclick={startOver}>
				Start Over
			</button>
			<ThemeToggle />
		</div>
	</header>

	<!-- Summary Stats -->
	<div class="summary-stats">
		<div class="stat-card">
			<div class="stat-icon mapped">→</div>
			<div class="stat-info">
				<p class="stat-value">{mappedCount}</p>
				<p class="stat-label">Mapped Columns</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon new">+</div>
			<div class="stat-info">
				<p class="stat-value">{newCount}</p>
				<p class="stat-label">New Columns</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon ignored">✕</div>
			<div class="stat-info">
				<p class="stat-value">{ignoredCount}</p>
				<p class="stat-label">Ignored Columns</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon rows">📊</div>
			<div class="stat-info">
				<p class="stat-value">{$mappingStore.dataFile?.rowCount.toLocaleString() || 0}</p>
				<p class="stat-label">Output Rows</p>
			</div>
		</div>
	</div>

	<!-- Error Display -->
	{#if error}
		<div class="error-section">
			<div class="error-item">
				<span class="error-icon">❌</span>
				<div class="error-content">
					<strong>Error:</strong> {error}
				</div>
			</div>
		</div>
	{/if}

	<!-- Warnings -->
	{#if outputSummary?.warnings && outputSummary.warnings.length > 0}
		<div class="warnings-section">
			<h3>Warnings</h3>
			<ul class="warnings-list">
				{#each outputSummary.warnings as warning}
					<li class="warning-item">
						<span class="warning-icon">⚠️</span>
						{warning}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Preview Table -->
	<div class="preview-section">
		<div class="preview-header">
			<h2>Output Preview</h2>
			<p class="preview-subtitle">First 10 rows of your mapped data</p>
		</div>
		{#if preview}
			<PreviewTable headers={preview.headers} rows={preview.rows} />
		{:else}
			<div class="empty-state">
				<p>No preview available</p>
			</div>
		{/if}
	</div>

	<!-- Output Actions -->
	<footer class="summary-footer">
		<div class="footer-info">
			<p>Ready to generate your file with {mappedCount + newCount} columns and {$mappingStore.dataFile?.rowCount.toLocaleString() || 0} rows</p>
		</div>
		<div class="export-controls">
			<button
				class="format-btn"
				onclick={() => (showExportOptions = !showExportOptions)}
				type="button"
			>
				Format: {exportFormat.toUpperCase()}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>
			{#if showExportOptions}
				<div class="format-menu">
					<button
						class="format-option"
						class:active={exportFormat === 'csv'}
						onclick={() => { exportFormat = 'csv'; showExportOptions = false; }}
					>
						CSV
					</button>
					<button
						class="format-option"
						class:active={exportFormat === 'excel'}
						onclick={() => { exportFormat = 'excel'; showExportOptions = false; }}
					>
						Excel (.xlsx)
					</button>
					<button
						class="format-option"
						class:active={exportFormat === 'json'}
						onclick={() => { exportFormat = 'json'; showExportOptions = false; }}
					>
						JSON
					</button>
					<button
						class="format-option"
						class:active={exportFormat === 'sql'}
						onclick={() => { exportFormat = 'sql'; showExportOptions = false; }}
					>
						SQL INSERT
					</button>
				</div>
			{/if}
			<button
				class="generate-btn {isGenerating ? 'generating' : ''}"
				onclick={handleGenerateAndDownload}
				disabled={isGenerating || !$mappingStore.schemaFile || !$mappingStore.dataFile}
			>
				{#if isGenerating}
					Generating...
				{:else}
					Generate & Download {exportFormat.toUpperCase()}
				{/if}
			</button>
		</div>
	</footer>
</div>

<style>
	.summary-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	/* Header */
	.summary-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.summary-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.back-btn,
	.secondary-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-btn:hover,
	.secondary-btn:hover {
		background-color: var(--color-border);
	}

	/* Stats */
	.summary-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		padding: 1.5rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.stat-icon.mapped {
		background-color: #dbeafe;
		color: #2563eb;
	}

	.stat-icon.new {
		background-color: #dcfce7;
		color: #16a34a;
	}

	.stat-icon.ignored {
		background-color: #fef2f2;
		color: #dc2626;
	}

	.stat-icon.rows {
		background-color: #fef3c7;
		color: #d97706;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.stat-label {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	/* Warnings */
	.warnings-section {
		padding: 0 1.5rem 1rem;
	}

	.warnings-section h3 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-warning);
	}

	.warnings-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.warning-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: #fef3c7;
		border-left: 3px solid var(--color-warning);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: #92400e;
	}

	.warning-icon {
		flex-shrink: 0;
	}

	/* Error Section */
	.error-section {
		padding: 0 1.5rem 1rem;
	}

	.error-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background-color: #fef2f2;
		border: 1px solid #fecaca;
		border-left: 4px solid #dc2626;
		border-radius: 0.5rem;
	}

	.error-icon {
		flex-shrink: 0;
		font-size: 1.25rem;
	}

	.error-content {
		flex: 1;
		font-size: 0.875rem;
		color: #991b1b;
	}

	.error-content strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	/* Preview */
	.preview-section {
		padding: 0 1.5rem 1rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.preview-header {
		margin-bottom: 1rem;
	}

	.preview-header h2 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.preview-subtitle {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-text-tertiary);
	}

	/* Footer */
	.summary-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-top: 1px solid var(--color-border);
	}

	.footer-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.generate-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-accent);
		color: var(--color-text-inverse);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.generate-btn:hover:not(:disabled) {
		background-color: var(--color-accent-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.generate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.generate-btn.generating {
		background-color: var(--color-success);
	}

	/* Export Controls */
	.export-controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
	}

	.format-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.format-btn:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-accent);
	}

	.format-menu {
		position: absolute;
		bottom: 100%;
		right: 0;
		margin-bottom: 0.5rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		z-index: 100;
		min-width: 150px;
	}

	.format-option {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.format-option:hover {
		background-color: var(--color-bg-tertiary);
	}

	.format-option.active {
		background-color: var(--color-accent);
		color: white;
	}
</style>
