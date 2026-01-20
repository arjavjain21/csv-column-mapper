<script lang="ts">
	import type { Column } from '$lib/types';
	import { getIconForType, getColorForType, getLabelForType } from '$lib/utils/typeDetector';
	import { onMount } from 'svelte';

	export interface Props {
		/** All available source columns */
		columns: Column[];
		/** Currently selected source column name */
		value: string;
		/** Callback when selection changes */
		onchange: (value: string) => void;
		/** Disabled state */
		disabled?: boolean;
		/** Placeholder text */
		placeholder?: string;
	}

	let { columns, value, onchange, disabled, placeholder = 'Search columns...' }: Props = $props();

	let searchQuery = $state('');
	let isOpen = $state(false);
	let dropdownElement: HTMLDivElement;
	let searchInput: HTMLInputElement;

	// Debug: log when columns change
	$effect(() => {
		console.log('SearchableDropdown columns:', columns);
		console.log('Columns length:', columns?.length);
	});

	// Filter columns based on search query
	let filteredColumns = $derived(
		!searchQuery || searchQuery.trim() === ''
			? columns
			: columns.filter(
					(col) =>
						col.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
						col.type.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
						col.samples.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase().trim()))
			  )
	);

	onMount(() => {
		// Close dropdown when clicking outside
		function handleClickOutside(event: MouseEvent) {
			if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
		if (isOpen) {
			setTimeout(() => searchInput?.focus(), 0);
		} else {
			searchQuery = '';
		}
	}

	function selectColumn(columnName: string) {
		onchange(columnName);
		isOpen = false;
		searchQuery = '';
	}

	function clearSelection() {
		onchange('');
		isOpen = false;
		searchQuery = '';
	}

	// Format sample value for display (truncate long values)
	function formatSample(value: string): string {
		if (value.length <= 30) return value;
		return `${value.slice(0, 10)}...${value.slice(-8)}`;
	}
</script>

<div class="searchable-dropdown-wrapper" bind:this={dropdownElement}>
	<div class="dropdown-trigger" onclick={toggleDropdown} class:disabled={disabled} role="combobox" aria-haspopup="listbox" aria-expanded={isOpen}>
		<div class="selected-value">
			{value ? (columns.find((c) => c.name === value)?.name ?? placeholder) : placeholder}
		</div>
		<div class="dropdown-arrow" class:rotate={isOpen}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 6l4 4l4-4" />
			</svg>
		</div>
	</div>

	{#if isOpen}
		<div class="dropdown-menu" role="listbox">
			<div class="search-header">
				<input
					bind:this={searchInput}
					type="text"
					bind:value={searchQuery}
					placeholder="Search columns..."
					class="search-input"
					onclick={(e) => e.stopPropagation()}
					role="searchbox"
					aria-label="Search columns"
				/>
				{#if value}
					<button class="clear-btn" onclick={clearSelection} aria-label="Clear selection">
						✕
					</button>
				{/if}
			</div>

			<div class="dropdown-items">
				{#if filteredColumns.length > 0}
					{#each filteredColumns as column (column.name)}
						<div
							class="dropdown-item {column.name === value ? 'selected' : ''}"
							onclick={() => selectColumn(column.name)}
							role="option"
							tabindex="0"
							aria-selected={column.name === value}
							title={column.name}
						>
							<span class="column-icon">{getIconForType(column.type)}</span>
							<div class="column-info">
								<div class="column-name-row">
									<span class="column-name">{column.name}</span>
									<span class="type-badge {getColorForType(column.type)}">
										{getLabelForType(column.type)}
									</span>
								</div>
								{#if column.samples.length > 0}
									<div class="sample-row">
										<span class="sample-preview" title={column.samples.slice(0, 2).join(', ')}>
											{formatSample(column.samples[0])}
										</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<div class="no-results">
						{#if searchQuery.trim()}
							<p>No columns match "{searchQuery}"</p>
						{:else}
							<p>No columns available (Total: {columns?.length || 0})</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.searchable-dropdown-wrapper {
		position: relative;
		width: 100%;
	}

	.dropdown-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-primary);
		cursor: pointer;
		transition: all 0.15s ease;
		min-height: 42px;
		user-select: none;
	}

	.dropdown-trigger:hover:not(.disabled) {
		border-color: var(--color-accent);
		background-color: var(--color-bg-secondary);
	}

	.dropdown-trigger.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--color-bg-tertiary);
	}

	.selected-value {
		flex: 1;
		font-size: 0.875rem;
		color: var(--color-text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 500;
	}

	.dropdown-arrow {
		margin-left: 0.5rem;
		color: var(--color-text-secondary);
		transition: transform 0.2s;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dropdown-arrow.rotate {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		background-color: #ffffff;
		border: 1px solid #E3E6EA;
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(17, 24, 39, 0.10);
		max-height: 350px;
		overflow: hidden;
		z-index: 1000;
	}

	/* Dark mode dropdown override */
	:global(html[data-theme='dark']) .dropdown-menu {
		background-color: var(--color-bg-secondary);
		border-color: var(--color-border);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
	}

	.search-header {
		position: sticky;
		top: 0;
		background-color: #ffffff;
		padding: 0.75rem 0.75rem 0.75rem 0.75rem;
		border-bottom: 1px solid #EEF0F3;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		z-index: 10;
	}

	:global(html[data-theme='dark']) .search-header {
		background-color: var(--color-bg-secondary);
		border-bottom-color: var(--color-border);
	}

	.search-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #D1D5DB;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		background-color: #ffffff;
		color: #111827;
		outline: none;
		transition: all 0.15s ease;
	}

	.search-input::placeholder {
		color: #6B7280;
	}

	.search-input:focus {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 2px var(--color-accent);
	}

	:global(html[data-theme='dark']) .search-input {
		background-color: var(--color-bg-primary);
		border-color: var(--color-border);
		color: var(--color-text-primary);
	}

	.clear-btn {
		padding: 0.25rem 0.5rem;
		border: none;
		background-color: var(--color-bg-tertiary);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.clear-btn:hover {
		background-color: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}

	.dropdown-items {
		padding: 0.5rem;
		max-height: 280px;
		overflow-y: auto;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.875rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s ease;
		user-select: none;
		min-height: 52px;
		border-bottom: 1px solid #EEF0F3;
		position: relative;
	}

	.dropdown-item:last-child {
		border-bottom: none;
	}

	.dropdown-item:hover {
		background-color: #F3F4F6;
	}

	.dropdown-item.selected {
		background-color: #EAF2FF;
	}

	.dropdown-item.selected::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background-color: var(--color-accent);
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}

	:global(html[data-theme='dark']) .dropdown-item {
		border-bottom-color: var(--color-border);
	}

	:global(html[data-theme='dark']) .dropdown-item:hover {
		background-color: var(--color-bg-tertiary);
	}

	:global(html[data-theme='dark']) .dropdown-item.selected {
		background-color: rgba(59, 130, 246, 0.15);
	}

	.column-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.column-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.column-name-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.column-name {
		font-size: 0.9375rem; /* 15px */
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	:global(html[data-theme='dark']) .column-name {
		color: var(--color-text-primary);
	}

	.type-badge {
		padding: 2px 8px;
		border-radius: 9999px;
		font-size: 0.6875rem; /* 11px */
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		flex-shrink: 0;
		border: 1px solid;
	}

	/* Ensure type badges have proper contrast in both themes */
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

	/* Dark mode overrides for type badges */
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

	.sample-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sample-preview {
		font-size: 0.8125rem; /* 13px */
		font-weight: 400;
		color: #4B5563;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(html[data-theme='dark']) .sample-preview {
		color: var(--color-text-secondary);
	}

	.no-results {
		padding: 2rem;
		text-align: center;
		color: var(--color-text-secondary);
	}

	.no-results p {
		margin: 0;
		font-size: 0.875rem;
	}

	/* Scrollbar styling */
	.dropdown-items::-webkit-scrollbar {
		width: 8px;
	}

	.dropdown-items::-webkit-scrollbar-track {
		background: transparent;
	}

	.dropdown-items::-webkit-scrollbar-thumb {
		background: #D1D5DB;
		border-radius: 4px;
	}

	.dropdown-items::-webkit-scrollbar-thumb:hover {
		background: #9CA3AF;
	}

	:global(html[data-theme='dark']) .dropdown-items::-webkit-scrollbar-thumb {
		background: var(--color-border-subtle);
	}

	:global(html[data-theme='dark']) .dropdown-items::-webkit-scrollbar-thumb:hover {
		background: var(--color-border-highlight);
	}
</style>
