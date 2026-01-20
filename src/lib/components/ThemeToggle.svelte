<script lang="ts">
	import { getTheme, toggleTheme } from '$lib/stores/theme';

	let currentTheme = $state(getTheme());

	const currentIcon = $derived(currentTheme === 'dark' ? '🌙' : '☀️');
	const currentLabel = $derived(currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');

	function handleToggle() {
		currentTheme = toggleTheme();
	}
</script>

<button
	class="theme-toggle-btn"
	onclick={handleToggle}
	aria-label="Toggle theme"
	title={currentLabel}
	type="button"
>
	<span class="theme-icon">{currentIcon}</span>
</button>

<style>
	.theme-toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		user-select: none;
		min-width: 38px;
		min-height: 38px;
	}

	.theme-toggle-btn:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-border-highlight);
		transform: translateY(-1px);
	}

	.theme-toggle-btn:active {
		transform: translateY(0);
	}

	.theme-toggle-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.theme-icon {
		font-size: 1.125rem;
		line-height: 1;
		transition: transform 0.3s ease;
	}

	.theme-toggle-btn:hover .theme-icon {
		transform: scale(1.1) rotate(15deg);
	}
</style>
