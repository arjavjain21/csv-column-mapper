<script lang="ts">
	import type { Transformation, TransformationType, Column } from '$lib/types';
	import { getAvailableTransformations, getDefaultTransformation } from '$lib/utils/transformations';

	export interface Props {
		transformation: Transformation | undefined;
		columnType: string;
		sourceColumns?: Column[];
		onChange: (transformation: Transformation | undefined) => void;
	}

	let { transformation, columnType, sourceColumns = [], onChange }: Props = $props();

	let isOpen = $state(false);
	let currentType = $state<TransformationType>(transformation?.type ?? 'none');
	let localTransformation = $state<Transformation>(transformation ?? getDefaultTransformation('none'));

	// Available transformations for this column type
	const availableTypes = $derived(getAvailableTransformations(columnType));

	// Update local transformation when type changes
	$effect(() => {
		if (currentType !== localTransformation.type) {
			localTransformation = getDefaultTransformation(currentType);
		}
	});

	function handleTypeChange(type: TransformationType) {
		currentType = type;
		localTransformation = getDefaultTransformation(type);
	}

	function handleSave() {
		if (currentType === 'none') {
			onChange(undefined);
		} else {
			onChange(localTransformation);
		}
		isOpen = false;
	}

	function handleCancel() {
		currentType = transformation?.type ?? 'none';
		localTransformation = transformation ?? getDefaultTransformation('none');
		isOpen = false;
	}
</script>

<div class="transformation-editor">
	<button
		class="transformation-btn"
		class:has-transformation={transformation && transformation.type !== 'none'}
		onclick={() => (isOpen = !isOpen)}
		type="button"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
		</svg>
		<span>{transformation && transformation.type !== 'none' ? 'Transform' : 'Add Transform'}</span>
		{#if transformation && transformation.type !== 'none'}
			<span class="transform-badge">{transformation.type}</span>
		{/if}
	</button>

	{#if isOpen}
		<div class="transformation-panel">
			<div class="panel-header">
				<h3>Column Transformation</h3>
				<button class="close-btn" onclick={handleCancel} type="button">×</button>
			</div>

			<div class="panel-content">
				<div class="form-group">
					<label>Transformation Type</label>
					<select
						value={currentType}
						onchange={(e) => handleTypeChange(e.currentTarget.value as TransformationType)}
					>
						{#each availableTypes as type}
							<option value={type}>{formatTypeName(type)}</option>
						{/each}
					</select>
				</div>

				{#if currentType === 'split'}
					<div class="form-group">
						<label>Delimiter</label>
						<input
							type="text"
							bind:value={localTransformation.splitDelimiter}
							placeholder="e.g., space, comma, pipe"
						/>
					</div>
					<div class="form-group">
						<label>Part Index (0-based)</label>
						<input
							type="number"
							bind:value={localTransformation.splitIndex}
							min="0"
							placeholder="0"
						/>
					</div>
				{/if}

				{#if currentType === 'concatenate'}
					<div class="form-group">
						<label>Columns to Join</label>
						<select multiple bind:value={localTransformation.concatenateColumns}>
							{#each sourceColumns as col}
								<option value={col.name}>{col.name}</option>
							{/each}
						</select>
					</div>
					<div class="form-group">
						<label>Separator</label>
						<input
							type="text"
							bind:value={localTransformation.concatenateSeparator}
							placeholder="e.g., space, comma"
						/>
					</div>
				{/if}

				{#if currentType === 'regex_replace'}
					<div class="form-group">
						<label>Pattern (Regex)</label>
						<input
							type="text"
							bind:value={localTransformation.regexPattern}
							placeholder="e.g., /old/g"
						/>
					</div>
					<div class="form-group">
						<label>Replacement</label>
						<input
							type="text"
							bind:value={localTransformation.regexReplacement}
							placeholder="new"
						/>
					</div>
					<div class="form-group">
						<label>Flags</label>
						<input
							type="text"
							bind:value={localTransformation.regexFlags}
							placeholder="g, i, m"
						/>
					</div>
				{/if}

				{#if currentType === 'date_format'}
					<div class="form-group">
						<label>Input Format</label>
						<select bind:value={localTransformation.dateInputFormat}>
							<option value="YYYY-MM-DD">YYYY-MM-DD</option>
							<option value="MM/DD/YYYY">MM/DD/YYYY</option>
							<option value="DD/MM/YYYY">DD/MM/YYYY</option>
							<option value="MM-DD-YYYY">MM-DD-YYYY</option>
							<option value="DD-MM-YYYY">DD-MM-YYYY</option>
						</select>
					</div>
					<div class="form-group">
						<label>Output Format</label>
						<select bind:value={localTransformation.dateOutputFormat}>
							<option value="YYYY-MM-DD">YYYY-MM-DD</option>
							<option value="MM/DD/YYYY">MM/DD/YYYY</option>
							<option value="DD/MM/YYYY">DD/MM/YYYY</option>
							<option value="MM-DD-YYYY">MM-DD-YYYY</option>
							<option value="DD-MM-YYYY">DD-MM-YYYY</option>
						</select>
					</div>
				{/if}

				{#if currentType === 'number_format'}
					<div class="form-group">
						<label>Decimal Places</label>
						<input
							type="number"
							bind:value={localTransformation.numberDecimals}
							min="0"
							max="10"
						/>
					</div>
					<div class="form-group">
						<label>Thousands Separator</label>
						<input
							type="text"
							bind:value={localTransformation.numberThousandsSeparator}
							placeholder=","
						/>
					</div>
					<div class="form-group">
						<label>Decimal Separator</label>
						<input
							type="text"
							bind:value={localTransformation.numberDecimalSeparator}
							placeholder="."
						/>
					</div>
				{/if}

				{#if currentType === 'custom_formula'}
					<div class="form-group">
						<label>JavaScript Expression</label>
						<textarea
							bind:value={localTransformation.customFormula}
							placeholder="e.g., value.toUpperCase()"
							rows="3"
						></textarea>
						<small>Use 'value' for the current cell value, 'row' for the entire row</small>
					</div>
				{/if}
			</div>

			<div class="panel-footer">
				<button class="btn-secondary" onclick={handleCancel} type="button">Cancel</button>
				<button class="btn-primary" onclick={handleSave} type="button">Apply</button>
			</div>
		</div>
	{/if}
</div>

<script>
	function formatTypeName(type: TransformationType): string {
		const names: Record<TransformationType, string> = {
			none: 'None',
			split: 'Split',
			concatenate: 'Concatenate',
			uppercase: 'Uppercase',
			lowercase: 'Lowercase',
			trim: 'Trim',
			regex_replace: 'Regex Replace',
			date_format: 'Date Format',
			number_format: 'Number Format',
			custom_formula: 'Custom Formula'
		};
		return names[type] || type;
	}
</script>

<style>
	.transformation-editor {
		position: relative;
		margin-top: 0.5rem;
	}

	.transformation-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.transformation-btn:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-accent);
		color: var(--color-text-primary);
	}

	.transformation-btn.has-transformation {
		background-color: var(--color-accent);
		color: white;
		border-color: var(--color-accent);
	}

	.transformation-btn.has-transformation:hover {
		background-color: var(--color-accent-hover);
	}

	.transform-badge {
		background-color: rgba(255, 255, 255, 0.2);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.625rem;
		text-transform: uppercase;
	}

	.transformation-panel {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.5rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		max-height: 500px;
		overflow-y: auto;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: var(--color-text-primary);
	}

	.panel-content {
		padding: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
	}

	.form-group textarea {
		resize: vertical;
		font-family: monospace;
	}

	.form-group small {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.625rem;
		color: var(--color-text-tertiary);
	}

	.panel-footer {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
		padding: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background-color: var(--color-accent);
		color: white;
		border: 1px solid var(--color-accent);
	}

	.btn-primary:hover {
		background-color: var(--color-accent-hover);
	}

	.btn-secondary {
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background-color: var(--color-bg-tertiary);
	}
</style>
