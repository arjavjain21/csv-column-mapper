<script lang="ts">
	import { parseCSVFile, isValidCSVFile, formatFileSize } from '$lib/utils/csvParser';
	import { mappingActions } from '$lib/stores/mappingStore';
	import { getUserFriendlyError, logError, retryWithBackoff } from '$lib/utils/errorHandler';
	import { authStore } from '$lib/stores/authStore';
	import type { ParsedCSV } from '$lib/types';

	export interface Props {
		/** The role of this file upload */
		role: 'schema' | 'data';
		/** Currently loaded file (if any) */
		loadedFile?: ParsedCSV | null;
	}

	let { role, loadedFile = null }: Props = $props();

	let isDragging = $state(false);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let fileInput = $state<HTMLInputElement>();

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if ((e.target as HTMLElement).classList.contains('dropzone')) {
			isDragging = false;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			await processFile(files[0]);
		}
	}

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			await processFile(input.files[0]);
		}
	}

	async function processFile(file: File) {
		error = null;
		isProcessing = true;

		try {
			// Validate file type
			if (!isValidCSVFile(file)) {
				throw new Error('Please upload a valid CSV file');
			}

			// Parse the CSV with retry logic
			const parsed = await retryWithBackoff(
				() => parseCSVFile(file),
				{
					maxRetries: 2,
					initialDelay: 500,
					onRetry: (attempt) => {
						console.log(`Retrying file parse (attempt ${attempt})...`);
					}
				}
			);

			// Update the store
			if (role === 'schema') {
				mappingActions.setSchemaFile(parsed);
			} else {
				mappingActions.setDataFile(parsed);
			}
		} catch (err) {
			// Log error with context
			const user = $authStore.user;
			logError(err, {
				userId: user?.id,
				userEmail: user?.email,
				action: 'file_upload',
				metadata: {
					role,
					fileName: file.name,
					fileSize: file.size,
					fileType: file.type
				}
			});

			// Get user-friendly error message
			const friendlyError = getUserFriendlyError(err, {
				userId: user?.id,
				userEmail: user?.email
			});
			error = friendlyError.message;
		} finally {
			isProcessing = false;
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}

	function removeFile() {
		if (role === 'schema') {
			mappingActions.setSchemaFile(null);
		} else {
			mappingActions.setDataFile(null);
		}
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<div class="file-upload">
	<div
		class="dropzone {isDragging ? 'dragging' : ''} {loadedFile ? 'has-file' : ''} {error ? 'has-error' : ''}"
		role="button"
		tabindex="0"
		ondragenter={handleDragEnter}
		ondragleave={handleDragLeave}
		ondragover={handleDragOver}
		ondrop={handleDrop}
		onclick={triggerFileInput}
		onkeydown={(e) => e.key === 'Enter' && triggerFileInput()}
	>
		<input
			bind:this={fileInput}
			type="file"
			accept=".csv,.tsv,.txt"
			class="hidden-input"
			onchange={handleFileSelect}
			aria-label={role === 'schema' ? 'Upload schema file' : 'Upload data file'}
		/>

		{#if isProcessing}
			<div class="upload-state processing">
				<div class="skeleton-loader"></div>
				<p>Processing file...</p>
			</div>
		{:else if loadedFile}
			<div class="upload-state loaded">
				<div class="file-info">
					<p class="file-name">{loadedFile.filename}</p>
					<p class="file-meta">
						{loadedFile.rowCount.toLocaleString()} rows · {loadedFile.columns.length} columns
					</p>
					<p class="file-meta">{formatFileSize(loadedFile.fileSize)}</p>
				</div>
				<button
					class="btn-icon"
					onclick={(e) => {
						e.stopPropagation();
						removeFile();
					}}
					aria-label="Remove file"
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
						<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
					</svg>
				</button>
			</div>
		{:else}
			<div class="upload-state empty">
				<div class="upload-icon">
					<svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
						<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
						<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
					</svg>
				</div>
				<p class="upload-title">Drop CSV file here</p>
				<p class="upload-hint">or click to browse</p>
			</div>
		{/if}

		{#if error}
			<div class="error-message">
				<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
				</svg>
				<span>{error}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.file-upload {
		width: 100%;
	}

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		padding: 2rem 1.5rem;
		border: 2px dashed var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-primary);
		transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		position: relative;
	}

	.dropzone:hover {
		border-color: var(--color-border-subtle);
		background-color: var(--color-bg-secondary);
	}

	.dropzone.dragging {
		border-color: var(--color-accent);
		background-color: var(--color-bg-secondary);
	}

	.dropzone.has-file {
		border-style: solid;
		border-color: var(--color-success);
		background-color: var(--color-bg-secondary);
	}

	.dropzone.has-error {
		border-color: var(--color-error);
	}

	.dropzone:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.hidden-input {
		display: none;
	}

	/* Upload States */
	.upload-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		width: 100%;
	}

	/* Empty State */
	.empty .upload-icon {
		color: var(--color-text-tertiary);
		margin-bottom: 0.5rem;
	}

	.upload-title {
		font-size: 0.875rem; /* 14px */
		font-weight: 500;
		color: var(--color-text-primary);
		margin: 0;
	}

	.upload-hint {
		font-size: 0.75rem; /* 12px */
		color: var(--color-text-tertiary);
		margin: 0;
	}

	/* Loaded State */
	.loaded {
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
		text-align: left;
		width: 100%;
	}

	.file-info {
		flex: 1;
		min-width: 0;
	}

	.file-name {
		font-size: 0.875rem; /* 14px */
		font-weight: 500;
		color: var(--color-text-primary);
		margin: 0 0 0.25rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-meta {
		font-size: 0.75rem; /* 12px */
		color: var(--color-text-tertiary);
		margin: 0;
		line-height: 1.4;
	}

	/* Icon Button */
	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
		padding: 0;
	}

	.btn-icon:hover {
		background-color: var(--color-error);
		color: white;
	}

	/* Processing State */
	.processing {
		gap: 1rem;
	}

	.skeleton-loader {
		width: 48px;
		height: 48px;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.processing p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Error Message */
	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
		padding: 0.5rem 0.75rem;
		background-color: rgba(239, 68, 68, 0.1);
		border: 1px solid var(--color-error);
		border-radius: 0.25rem;
		font-size: 0.75rem; /* 12px */
		color: var(--color-error);
	}

	.error-message svg {
		flex-shrink: 0;
	}
</style>
