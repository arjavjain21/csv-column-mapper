<script lang="ts">
	import ColumnCard from './ColumnCard.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import type { Column, ColumnMapping } from '$lib/types';
	import { mappingStore, mappingActions } from '$lib/stores/mappingStore';
	import { getIconForType, getColorForType } from '$lib/utils/typeDetector';

	let importInput = $state<HTMLInputElement>();

	// Drag and drop handler for source columns
	function handleSourceDragStart(e: DragEvent, columnName: string) {
		e.dataTransfer!.effectAllowed = 'link';
		e.dataTransfer!.setData('text/plain', columnName);

		// Create custom drag ghost
		const target = e.currentTarget as HTMLElement;
		const dragGhost = target.cloneNode(true) as HTMLElement;
		dragGhost.style.position = 'absolute';
		dragGhost.style.top = '-9999px';
		dragGhost.style.left = '-9999px';
		dragGhost.style.width = target.offsetWidth + 'px';
		dragGhost.style.opacity = '0.9';
		dragGhost.style.transform = 'rotate(2deg)';
		dragGhost.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
		dragGhost.style.zIndex = '9999';
		document.body.appendChild(dragGhost);

		e.dataTransfer!.setDragImage(dragGhost, 0, 0);

		// Clean up ghost after drag
		setTimeout(() => {
			if (document.body.contains(dragGhost)) {
				document.body.removeChild(dragGhost);
			}
		}, 0);
	}

	function handleSourceDragEnd(e: DragEvent) {
		// Clean up any drag state
		console.log('Drag ended');
	}

	// Get mapping for a specific column
	function getMapping(columnName: string, currentMappings: typeof $mappingStore.mappings): ColumnMapping {
		return currentMappings.find((m) => m.targetColumn === columnName) || {
			targetColumn: columnName,
			action: 'map',
			sourceColumn: undefined
		};
	}

	function goBack() {
		mappingActions.goToUpload();
	}

	function goToSummary() {
		mappingActions.goToSummary();
	}

	function toggleAddUnmapped() {
		mappingActions.toggleAddUnmapped();
	}

	function handleExport() {
		console.log('Export button clicked');
		const state = $mappingStore;
		console.log('Current state:', state);
		mappingActions.exportCurrentMappings();
	}

	function handleImport() {
		importInput?.click();
	}

	async function handleImportChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			try {
				await mappingActions.importMappingsFromFile(input.files[0]);
			} catch (err) {
				alert('Failed to import mappings: ' + (err instanceof Error ? err.message : 'Unknown error'));
			}
			input.value = '';
		}
	}
</script>

<div class="mapper-container">
	<!-- Header -->
	<header class="mapper-header">
		<div class="header-left">
			<button class="back-btn" onclick={goBack} aria-label="Go back">
				← Back
			</button>
			<h1 class="mapper-title">Map Your Columns</h1>
		</div>
		<div class="header-actions">
			<input
				bind:this={importInput}
				type="file"
				accept=".json"
				class="hidden-input"
				onchange={handleImportChange}
				aria-label="Import mappings"
			/>
			<button class="action-btn secondary" onclick={handleImport} title="Import mappings">
				📥 Import
			</button>
			<button class="action-btn secondary" onclick={handleExport} title="Export mappings">
				📤 Export
			</button>
			<ThemeToggle />
		</div>
	</header>

	<!-- File Info Bar -->
	<div class="file-info-bar">
		<div class="file-info schema">
			<span class="file-label">Schema:</span>
			<span class="file-name">{$mappingStore.schemaFile?.filename || 'Not loaded'}</span>
			<span class="file-stats">{$mappingStore.schemaFile?.columns.length || 0} columns</span>
		</div>
		<div class="arrow">→</div>
		<div class="file-info data">
			<span class="file-label">Data:</span>
			<span class="file-name">{$mappingStore.dataFile?.filename || 'Not loaded'}</span>
			<span class="file-stats">{$mappingStore.dataFile?.columns.length || 0} columns · {$mappingStore.dataFile?.rowCount.toLocaleString() || 0} rows</span>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mapper-content">
		<!-- Target Columns (Left Panel) -->
		<div class="panel target-panel">
			<div class="panel-header">
				<h2>Target Columns</h2>
				<p class="panel-subtitle">From schema file - map source data to these columns</p>
			</div>
			<div class="columns-list">
				{#if $mappingStore.schemaFile?.columns && $mappingStore.schemaFile.columns.length > 0}
					{#each $mappingStore.schemaFile.columns as column (column.name)}
						<ColumnCard
							targetColumn={column}
							sourceColumns={$mappingStore.dataFile?.columns ?? []}
							mapping={getMapping(column.name, $mappingStore.mappings)}
						/>
					{/each}
				{:else}
					<div class="empty-state">
						<p>No schema columns available</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Source Columns Reference (Right Panel) -->
		<div class="panel source-panel">
			<div class="panel-header">
				<h2>Source Columns</h2>
				<p class="panel-subtitle">Available from data file</p>
			</div>
			<div class="source-list">
				{#if $mappingStore.dataFile?.columns && $mappingStore.dataFile.columns.length > 0}
					{#each $mappingStore.dataFile.columns as column}
						<div
							class="source-item"
							draggable="true"
							ondragstart={(e) => handleSourceDragStart(e, column.name)}
							title="Drag to map this column"
						>
							<span class="drag-icon">⋮⋮</span>
							<span class="source-icon">{getIconForType(column.type)}</span>
							<div class="source-details">
								<p class="source-name">{column.name}</p>
								<div class="source-meta">
									<span class="type-badge {getColorForType(column.type)}">{column.type}</span>
									<span class="sample-count">{column.samples.length} samples</span>
								</div>
								{#if column.samples.length > 0}
									<div class="sample-values">
										{#each column.samples.slice(0, 3) as sample}
											<span class="sample-value">{sample}</span>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<div class="empty-state">
						<p>No data columns available</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Footer Actions -->
	<footer class="mapper-footer">
		<label class="add-unmapped-toggle">
			<input
				type="checkbox"
				checked={$mappingStore.addUnmappedAsNew}
				onchange={toggleAddUnmapped}
			/>
			<span>Add unmapped source columns as new</span>
		</label>
		<button class="continue-btn" onclick={goToSummary}>
			Review Mapping →
		</button>
	</footer>
</div>

<style>
	.mapper-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	/* Header */
	.mapper-header {
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
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.hidden-input {
		display: none;
	}

	.back-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.back-btn:hover {
		background-color: var(--color-border);
	}

	.mapper-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.action-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-accent);
	}

	.action-btn.secondary {
		background-color: var(--color-bg-primary);
	}

	/* File Info Bar */
	.file-info-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		flex-wrap: wrap;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.file-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.file-stats {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.arrow {
		font-size: 1.25rem;
		color: var(--color-text-muted);
	}

	/* Main Content */
	.mapper-content {
		display: flex;
		flex: 1;
		gap: 1.5rem;
		padding: 1.5rem;
		overflow: hidden;
	}

	.panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-secondary);
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
		min-width: 0;
	}

	.panel-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-bg-tertiary);
	}

	.panel-header h2 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.panel-subtitle {
		margin: 0.25rem 0 0 0;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	/* Target Panel - Columns */
	.columns-list {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Source Panel - Reference */
	.source-list {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.source-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-tertiary);
		cursor: grab;
		transition: all 0.15s ease;
	}

	.source-item:hover {
		border-color: var(--color-accent);
		background-color: var(--color-bg-elevated);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
	}

	.source-item:active {
		cursor: grabbing;
	}

	.drag-icon {
		font-size: 1rem;
		color: var(--color-text-muted);
		flex-shrink: 0;
		margin-top: 0.125rem;
		opacity: 0.5;
		transition: opacity 0.15s ease;
	}

	.source-item:hover .drag-icon {
		opacity: 1;
	}

	.source-icon {
		font-size: 1rem;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.source-details {
		flex: 1;
		min-width: 0;
	}

	.source-name {
		margin: 0 0 0.25rem 0;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.source-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.type-badge {
		padding: 0.125rem 0.375rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	.sample-count {
		font-size: 0.7rem;
		color: var(--color-text-muted);
	}

	.sample-values {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.sample-value {
		padding: 0.125rem 0.375rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		font-size: 0.7rem;
		color: var(--color-text-secondary);
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	/* Footer */
	.mapper-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-top: 1px solid var(--color-border);
	}

	.add-unmapped-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.add-unmapped-toggle input[type='checkbox'] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.continue-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-accent);
		color: var(--color-text-inverse);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.continue-btn:hover {
		background-color: var(--color-accent-hover);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.mapper-content {
			flex-direction: column;
		}

		.panel {
			max-height: 400px;
		}
	}
</style>
