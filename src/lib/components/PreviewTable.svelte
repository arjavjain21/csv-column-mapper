<script lang="ts">
	export interface Props {
		/** Headers for the table */
		headers: string[];
		/** Rows of data */
		rows: Record<string, string>[];
		/** Maximum number of rows to display */
		maxRows?: number;
	}

	let { headers, rows, maxRows = 10 }: Props = $props();

	let scrollContainer = $state<HTMLDivElement>();
	let scrollPosition = $state('start');

	// Track scroll position for shadow indicators
	function handleScroll() {
		if (!scrollContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		if (scrollTop === 0) {
			scrollPosition = 'start';
		} else if (scrollTop + clientHeight >= scrollHeight - 1) {
			scrollPosition = 'end';
		} else {
			scrollPosition = 'middle';
		}
	}

	// Limit rows
	const displayRows = rows.slice(0, maxRows);
</script>

<div
	class="preview-table-container"
	class:shadow-top={scrollPosition === 'middle' || scrollPosition === 'end'}
	class:shadow-bottom={scrollPosition === 'middle' || scrollPosition === 'start'}
	bind:this={scrollContainer}
	onscroll={handleScroll}
>
	<table class="preview-table">
		<thead>
			<tr>
				{#each headers as header}
					<th class="table-header">{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each displayRows as row, rowIndex}
				<tr class:row-even={rowIndex % 2 === 0}>
					{#each headers as header}
						<td class="table-cell">
							{#if row[header]}
								<span class="cell-value">{row[header]}</span>
							{:else}
								<span class="cell-empty">—</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	{#if rows.length > maxRows}
		<div class="preview-footer">
			<p class="preview-note">
				Showing {maxRows} of {rows.length.toLocaleString()} rows
			</p>
		</div>
	{/if}
</div>

<style>
	.preview-table-container {
		position: relative;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		overflow: hidden;
		background-color: var(--color-bg-secondary);
		max-height: 400px;
		overflow-y: auto;
	}

	.preview-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.table-header {
		position: sticky;
		top: 0;
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		background-color: var(--color-bg-secondary);
		border-bottom: 2px solid var(--color-border);
		color: var(--color-text-primary);
		white-space: nowrap;
		max-width: 200px;
	}

	.table-cell {
		padding: 0.625rem 1rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-primary);
		max-width: 250px;
	}

	.row-even {
		background-color: var(--color-bg-tertiary);
	}

	.cell-value {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cell-empty {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.preview-footer {
		position: sticky;
		bottom: 0;
		padding: 0.75rem 1rem;
		background-color: var(--color-bg-secondary);
		border-top: 1px solid var(--color-border);
		text-align: center;
	}

	.preview-note {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	/* Shadow indicators for scroll */
	.preview-table-container.shadow-top::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 8px;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
		pointer-events: none;
	}

	.preview-table-container.shadow-bottom::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 8px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
		pointer-events: none;
	}
</style>
