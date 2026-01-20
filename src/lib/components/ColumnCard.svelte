<script lang="ts">
	import SearchableDropdown from './SearchableDropdown.svelte';
	import TransformationEditor from './TransformationEditor.svelte';
	import ValidationEditor from './ValidationEditor.svelte';
	import type { Column, ColumnMapping, MappingAction, Transformation, ValidationRule } from '$lib/types';
	import { getIconForType, getColorForType, getLabelForType } from '$lib/utils/typeDetector';
	import { mappingActions } from '$lib/stores/mappingStore';
	import { mappingStore } from '$lib/stores/mappingStore';

	export interface Props {
		/** The target column (from schema) */
		targetColumn: Column;
		/** Available source columns to map from */
		sourceColumns: Column[];
		/** Current mapping for this column */
		mapping: ColumnMapping;
	}

	let { targetColumn, sourceColumns, mapping }: Props = $props();

	// Local state
	let selectedSourceColumn = $state(mapping.sourceColumn ?? '');
	let mappingAction = $state(mapping.action);
	let addAsNew = $state(mapping.addAsNew ?? false);
	let isDragOver = $state(false);

	// Sync local state when mapping prop changes from parent
	$effect(() => {
		selectedSourceColumn = mapping.sourceColumn ?? '';
		mappingAction = mapping.action;
		addAsNew = mapping.addAsNew ?? false;
	});

	// Source columns for the dropdown (excluding already mapped columns if one-to-many not allowed)
	let availableSourceColumns = $derived(sourceColumns);

	// Handle action change
	function handleActionChange(action: MappingAction) {
		mappingAction = action;
		mappingActions.updateMapping(targetColumn.name, {
			action,
			sourceColumn: selectedSourceColumn || undefined
		});
	}

	// Handle source selection from dropdown
	function handleSourceChange(value: string) {
		selectedSourceColumn = value;

		// If a source is selected, automatically switch to 'map' mode if currently ignored
		if (selectedSourceColumn && mappingAction === 'ignore') {
			mappingAction = 'map';
		}

		// Update the store with new mapping
		mappingActions.updateMapping(targetColumn.name, {
			action: mappingAction,
			sourceColumn: selectedSourceColumn || undefined
		});
	}

	// Handle transformation change
	function handleTransformationChange(transformation: Transformation | undefined) {
		mappingActions.updateMapping(targetColumn.name, {
			transformation
		});
	}

	// Handle validation rules change
	function handleValidationRulesChange(validationRules: ValidationRule[] | undefined) {
		mappingActions.updateMapping(targetColumn.name, {
			validationRules
		});
	}

	// Get source columns for transformation editor
	const allSourceColumns = $derived($mappingStore.dataFile?.columns ?? []);

	// Drag and drop handlers
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		// Check if this is a valid drop
		const data = e.dataTransfer?.getData('text/plain');
		if (data && !isDragOver) {
			isDragOver = true;
		}
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		// Only reset if leaving the card, not entering a child
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			isDragOver = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		isDragOver = false;

		const data = e.dataTransfer?.getData('text/plain');
		if (data) {
			const sourceColumnName = data;
			selectedSourceColumn = sourceColumnName;

			// Automatically switch to 'map' mode if currently ignored
			if (mappingAction === 'ignore') {
				mappingAction = 'map';
			}

			// Update the store with new mapping
			mappingActions.updateMapping(targetColumn.name, {
				action: mappingAction,
				sourceColumn: selectedSourceColumn || undefined
			});
		}
	}

	// Handle drag from this component (this column as source)
	function handleDragStart(e: DragEvent) {
		if (mappingAction === 'ignore') return; // Ignored columns can't be dragged
		if (!selectedSourceColumn) return; // Only mapped columns can be dragged

		e.dataTransfer!.effectAllowed = 'link';
		e.dataTransfer!.setData('text/plain', selectedSourceColumn);

		// Create a custom drag image/ghost
		const target = e.currentTarget as HTMLElement;
		const dragImage = target.cloneNode(true) as HTMLElement;
		dragImage.style.position = 'absolute';
		dragImage.style.top = '-9999px';
		dragImage.style.left = '-9999px';
		dragImage.style.opacity = '0.8';
		dragImage.style.transform = 'rotate(3deg)';
		dragImage.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
		document.body.appendChild(dragImage);

		e.dataTransfer!.setDragImage(dragImage, 0, 0);

		// Clean up the ghost element after drag
		setTimeout(() => {
			document.body.removeChild(dragImage);
		}, 0);
	}

	function handleDragEnd() {
		// Clean up any remaining drag state
		isDragOver = false;
	}

	// Clear the selected source column
	function handleClearMapping() {
		selectedSourceColumn = '';
		mappingActions.updateMapping(targetColumn.name, {
			action: 'ignore',
			sourceColumn: undefined
		});
		mappingAction = 'ignore';
	}
</script>

<div
	class="column-card"
	class:ignored={mappingAction === 'ignore'}
	class:drag-over={isDragOver}
	class:has-source={selectedSourceColumn}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<!-- Drag handle (always visible on hover for mapped columns) -->
	{#if selectedSourceColumn}
		<div
			class="drag-handle"
			draggable="true"
			ondragstart={handleDragStart}
			ondragend={handleDragEnd}
			title="Drag to reassign this source to another target column"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 17l-5-5 5-5M20 17l-5-5 5-5"/>
			</svg>
		</div>
	{/if}

	<!-- Column Info -->
	<div class="column-info">
		<span class="column-icon">{getIconForType(targetColumn.type)}</span>
		<div class="column-details">
			<p class="column-name">{targetColumn.name}</p>
			<div class="column-meta">
				<span class="type-badge {getColorForType(targetColumn.type)}">{getLabelForType(targetColumn.type)}</span>
				{#if targetColumn.isEmptyPercent > 0}
					<span class="empty-indicator">
						{targetColumn.isEmptyPercent.toFixed(0)}% empty
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Mapping Controls -->
	<div class="mapping-controls">
		<div class="dropdown-wrapper">
			<SearchableDropdown
				columns={availableSourceColumns}
				value={selectedSourceColumn}
				onchange={handleSourceChange}
				disabled={mappingAction === 'ignore'}
				placeholder="Select source column..."
			/>
			{#if selectedSourceColumn && mappingAction !== 'ignore'}
				<button
					class="clear-mapping-btn"
					onclick={handleClearMapping}
					title="Clear mapping"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M13 1l-6 6m0 0l-6-6m6 6v6m0-6H1" />
					</svg>
				</button>
			{/if}
		</div>

		<div class="action-buttons">
			<button
				class="action-btn" class:active={mappingAction === 'map'}
				onclick={() => handleActionChange('map')}
				title="Map from source column"
			>
				→ Map
			</button>
			<button
				class="action-btn" class:active={mappingAction === 'new'}
				onclick={() => handleActionChange('new')}
				title="Add as new column"
			>
				+ New
			</button>
			<button
				class="action-btn" class:active={mappingAction === 'ignore'}
				onclick={() => handleActionChange('ignore')}
				title="Ignore this column"
			>
				✕ Ignore
			</button>
		</div>

		{#if selectedSourceColumn && mappingAction !== 'ignore'}
			<TransformationEditor
				transformation={mapping.transformation}
				columnType={targetColumn.type}
				sourceColumns={allSourceColumns}
				onChange={handleTransformationChange}
			/>
			<ValidationEditor
				validationRules={mapping.validationRules}
				columnType={targetColumn.type}
				onChange={handleValidationRulesChange}
			/>
		{/if}
	</div>
</div>

<style>
	.column-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		padding-right: 2.5rem; /* Extra space for drag handle */
		border: 1px solid #E3E6EA;
		border-radius: 0.5rem;
		background-color: #ffffff;
		transition: all 0.15s ease;
		position: relative;
		cursor: default;
	}

	:global(html[data-theme='dark']) .column-card {
		border-color: var(--color-border);
		background-color: var(--color-bg-secondary);
	}

	.column-card:hover {
		border-color: var(--color-accent);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	:global(html[data-theme='dark']) .column-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	/* Drag handle styling */
	.drag-handle {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
		color: var(--color-text-tertiary);
		background-color: transparent;
		border-radius: 4px;
		opacity: 0;
		transition: all 0.15s ease;
	}

	.column-card:hover .drag-handle,
	.column-card.has-source .drag-handle {
		opacity: 0.6;
	}

	.drag-handle:hover {
		opacity: 1 !important;
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	/* Drop zone visual feedback */
	.column-card.drag-over {
		border-color: var(--color-success) !important;
		border-width: 2px;
		background-color: #ECFDF5 !important;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(16, 185, 129, 0.2) !important;
		transform: translateY(-2px);
	}

	:global(html[data-theme='dark']) .column-card.drag-over {
		background-color: rgba(16, 185, 129, 0.15) !important;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(16, 185, 129, 0.3) !important;
	}

	.column-card.ignored {
		opacity: 0.5;
		background-color: #F9FAFB;
		cursor: not-allowed;
	}

	:global(html[data-theme='dark']) .column-card.ignored {
		background-color: var(--color-bg-tertiary);
	}

	.column-card.ignored:hover {
		opacity: 0.7;
		transform: none !important;
	}

	.column-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.column-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.column-details {
		flex: 1;
		min-width: 0;
	}

	.column-name {
		font-weight: 600;
		font-size: 0.9375rem; /* 15px */
		color: #111827;
		margin: 0 0 0.25rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(html[data-theme='dark']) .column-name {
		color: var(--color-text-primary);
	}

	.column-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.type-badge {
		padding: 2px 8px;
		border-radius: 9999px;
		font-size: 0.6875rem; /* 11px */
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		border: 1px solid;
	}

	/* Light mode type badges */
	.type-badge.text {
		background-color: #F3F4F6;
		color: #4B5563;
		border-color: #D1D5DB;
	}

	.type-badge.date {
		background-color: #FEF3C7;
		color: #92400E;
		border-color: #FBBF24;
	}

	.type-badge.number {
		background-color: #DBEAFE;
		color: #1E40AF;
		border-color: #60A5FA;
	}

	.type-badge.phone {
		background-color: #E0E7FF;
		color: #3730A3;
		border-color: #818CF8;
	}

	.type-badge.boolean {
		background-color: #FCE7F3;
		color: #9D174D;
		border-color: #F472B6;
	}

	.type-badge.unknown {
		background-color: #F3F4F6;
		color: #6B7280;
		border-color: #D1D5DB;
	}

	/* Dark mode type badges */
	:global(html[data-theme='dark']) .type-badge.text {
		background-color: rgba(107, 114, 128, 0.2);
		color: #D1D5DB;
		border-color: #4B5563;
	}

	:global(html[data-theme='dark']) .type-badge.date {
		background-color: rgba(251, 191, 36, 0.2);
		color: #FCD34D;
		border-color: #F59E0B;
	}

	:global(html[data-theme='dark']) .type-badge.number {
		background-color: rgba(59, 130, 246, 0.2);
		color: #60A5FA;
		border-color: #3B82F6;
	}

	:global(html[data-theme='dark']) .type-badge.phone {
		background-color: rgba(129, 140, 248, 0.2);
		color: #818CF8;
		border-color: #6366F1;
	}

	:global(html[data-theme='dark']) .type-badge.boolean {
		background-color: rgba(244, 114, 182, 0.2);
		color: #F472B6;
		border-color: #EC4899;
	}

	:global(html[data-theme='dark']) .type-badge.unknown {
		background-color: rgba(107, 114, 128, 0.2);
		color: #9CA3AF;
		border-color: #6B7280;
	}

	.empty-indicator {
		font-size: 0.75rem;
		color: var(--color-warning);
		font-weight: 500;
	}

	.mapping-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.dropdown-wrapper {
		display: flex;
		gap: 0.5rem;
		align-items: stretch;
	}

	.clear-mapping-btn {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 42px;
		width: 42px;
		flex-shrink: 0;
	}

	.clear-mapping-btn:hover {
		background-color: #FEE2E2;
		border-color: #FCA5A5;
		color: #DC2626;
	}

	:global(html[data-theme='dark']) .clear-mapping-btn:hover {
		background-color: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.4);
		color: #F87171;
	}

	.clear-mapping-btn:active {
		transform: scale(0.95);
	}

	.drag-handle {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
		color: #9CA3AF;
		font-size: 1rem;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	:global(html[data-theme='dark']) .drag-handle {
		color: var(--color-text-tertiary);
	}

	.column-card:hover .drag-handle {
		opacity: 1;
	}

	.drag-handle:active {
		cursor: grab;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #E3E6EA;
		border-radius: 0.375rem;
		background-color: #FFFFFF;
		color: #111827;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover {
		background-color: #F9FAFB;
		border-color: var(--color-accent);
	}

	:global(html[data-theme='dark']) .action-btn {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-border);
		color: var(--color-text-primary);
	}

	:global(html[data-theme='dark']) .action-btn:hover {
		background-color: var(--color-bg-primary);
		border-color: var(--color-accent);
	}

	.action-btn.active {
		background-color: var(--color-accent);
		color: #ffffff;
		border-color: var(--color-accent);
	}

	.action-btn.active:hover {
		background-color: var(--color-accent-hover);
	}

	/* Smooth transitions */
	.column-card,
	.action-btn,
	.dropdown-trigger,
	.dropdown-item {
		transition: all 0.15s ease;
	}
</style>
