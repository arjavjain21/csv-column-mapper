<script lang="ts">
	import type { ValidationRule, ValidationRuleType } from '$lib/types';
	import { getDefaultValidationRules } from '$lib/utils/validation';

	export interface Props {
		validationRules: ValidationRule[] | undefined;
		columnType: string;
		onChange: (rules: ValidationRule[] | undefined) => void;
	}

	let { validationRules = [], columnType, onChange }: Props = $props();

	let isOpen = $state(false);
	let localRules = $state<ValidationRule[]>([...validationRules]);

	// Available rule types
	const availableRuleTypes: ValidationRuleType[] = [
		'required',
		'email',
		'url',
		'phone',
		'date_range',
		'number_range',
		'regex',
		'custom'
	];

	// Filter available rules based on column type
	const filteredRuleTypes = $derived(() => {
		if (columnType === 'email') return ['required', 'email', 'regex', 'custom'];
		if (columnType === 'url') return ['required', 'url', 'regex', 'custom'];
		if (columnType === 'phone') return ['required', 'phone', 'regex', 'custom'];
		if (columnType === 'date') return ['required', 'date_range', 'regex', 'custom'];
		if (columnType === 'number') return ['required', 'number_range', 'regex', 'custom'];
		return availableRuleTypes;
	});

	function addRule(type: ValidationRuleType) {
		const newRule: ValidationRule = { type };
		if (type === 'required') {
			newRule.required = true;
		}
		localRules = [...localRules, newRule];
	}

	function removeRule(index: number) {
		localRules = localRules.filter((_, i) => i !== index);
	}

	function updateRule(index: number, updates: Partial<ValidationRule>) {
		localRules = localRules.map((rule, i) => (i === index ? { ...rule, ...updates } : rule));
	}

	function handleSave() {
		if (localRules.length === 0) {
			onChange(undefined);
		} else {
			onChange(localRules);
		}
		isOpen = false;
	}

	function handleCancel() {
		localRules = [...validationRules];
		isOpen = false;
	}

	function formatRuleName(type: ValidationRuleType): string {
		const names: Record<ValidationRuleType, string> = {
			required: 'Required',
			email: 'Email Format',
			url: 'URL Format',
			phone: 'Phone Format',
			date_range: 'Date Range',
			number_range: 'Number Range',
			regex: 'Regex Pattern',
			custom: 'Custom Expression'
		};
		return names[type] || type;
	}
</script>

<div class="validation-editor">
	<button
		class="validation-btn"
		class:has-rules={validationRules && validationRules.length > 0}
		onclick={() => (isOpen = !isOpen)}
		type="button"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
		</svg>
		<span>Validation</span>
		{#if validationRules && validationRules.length > 0}
			<span class="rules-badge">{validationRules.length}</span>
		{/if}
	</button>

	{#if isOpen}
		<div class="validation-panel">
			<div class="panel-header">
				<h3>Validation Rules</h3>
				<button class="close-btn" onclick={handleCancel} type="button">×</button>
			</div>

			<div class="panel-content">
				<div class="rules-list">
					{#each localRules as rule, index}
						<div class="rule-item">
							<div class="rule-header">
								<span class="rule-type">{formatRuleName(rule.type)}</span>
								<button class="remove-btn" onclick={() => removeRule(index)} type="button">×</button>
							</div>

							{#if rule.type === 'date_range'}
								<div class="rule-fields">
									<div class="form-group">
										<label>Min Date</label>
										<input type="date" bind:value={rule.dateMin} />
									</div>
									<div class="form-group">
										<label>Max Date</label>
										<input type="date" bind:value={rule.dateMax} />
									</div>
								</div>
							{/if}

							{#if rule.type === 'number_range'}
								<div class="rule-fields">
									<div class="form-group">
										<label>Min Value</label>
										<input
											type="number"
											bind:value={rule.numberMin}
											onchange={(e) => updateRule(index, { numberMin: parseFloat(e.currentTarget.value) || undefined })}
										/>
									</div>
									<div class="form-group">
										<label>Max Value</label>
										<input
											type="number"
											bind:value={rule.numberMax}
											onchange={(e) => updateRule(index, { numberMax: parseFloat(e.currentTarget.value) || undefined })}
										/>
									</div>
								</div>
							{/if}

							{#if rule.type === 'regex'}
								<div class="rule-fields">
									<div class="form-group">
										<label>Pattern</label>
										<input type="text" bind:value={rule.regexPattern} placeholder="/pattern/flags" />
									</div>
									<div class="form-group">
										<label>Error Message</label>
										<input
											type="text"
											bind:value={rule.regexErrorMessage}
											placeholder="Custom error message"
										/>
									</div>
								</div>
							{/if}

							{#if rule.type === 'custom'}
								<div class="rule-fields">
									<div class="form-group">
										<label>Expression</label>
										<textarea
											bind:value={rule.customExpression}
											placeholder="e.g., value.length > 5"
											rows="2"
										></textarea>
									</div>
									<div class="form-group">
										<label>Error Message</label>
										<input
											type="text"
											bind:value={rule.customErrorMessage}
											placeholder="Custom error message"
										/>
									</div>
								</div>
							{/if}
						</div>
					{/each}

					{#if localRules.length === 0}
						<p class="empty-state">No validation rules. Add one below.</p>
					{/if}
				</div>

				<div class="add-rule-section">
					<label>Add Rule</label>
					<select
						onchange={(e) => {
							const type = e.currentTarget.value as ValidationRuleType;
							if (type) {
								addRule(type);
								e.currentTarget.value = '';
							}
						}}
					>
						<option value="">Select rule type...</option>
						{#each filteredRuleTypes() as type}
							<option value={type}>{formatRuleName(type)}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="panel-footer">
				<button class="btn-secondary" onclick={handleCancel} type="button">Cancel</button>
				<button class="btn-primary" onclick={handleSave} type="button">Apply</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.validation-editor {
		position: relative;
		margin-top: 0.5rem;
	}

	.validation-btn {
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

	.validation-btn:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-accent);
		color: var(--color-text-primary);
	}

	.validation-btn.has-rules {
		background-color: #ECFDF5;
		color: #059669;
		border-color: #10B981;
	}

	.validation-btn.has-rules:hover {
		background-color: #D1FAE5;
	}

	.rules-badge {
		background-color: rgba(5, 150, 105, 0.2);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.625rem;
		font-weight: 600;
	}

	.validation-panel {
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

	.rules-list {
		margin-bottom: 1rem;
	}

	.rule-item {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		margin-bottom: 0.5rem;
		background-color: var(--color-bg-primary);
	}

	.rule-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.rule-type {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.remove-btn {
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		font-size: 1.25rem;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.remove-btn:hover {
		color: #DC2626;
	}

	.rule-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.form-group {
		margin-bottom: 0.5rem;
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

	.empty-state {
		text-align: center;
		color: var(--color-text-tertiary);
		font-size: 0.75rem;
		padding: 1rem;
	}

	.add-rule-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.add-rule-section label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.add-rule-section select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
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
