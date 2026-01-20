<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	function isAuthRoute() {
		return $page.url.pathname.startsWith('/auth');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>CSV Column Mapper</title>
	<meta name="description" content="Map columns between CSV files with ease" />
</svelte:head>

{#if !isAuthRoute()}
	<nav class="navbar">
		<div class="navbar-container">
			<a href="/" class="navbar-logo">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				<span>CSV Mapper</span>
			</a>

			<div class="navbar-actions">
				<UserMenu />
				<ThemeToggle />
			</div>
		</div>
	</nav>
{/if}

{@render children()}

<Footer />

<style>
	.navbar {
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.navbar-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.navbar-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-decoration: none;
		transition: color 150ms;
	}

	.navbar-logo:hover {
		color: var(--color-accent);
	}

	.navbar-logo svg {
		color: var(--color-accent);
		flex-shrink: 0;
	}

	.navbar-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.navbar-container {
			padding: 0.75rem 1rem;
		}

		.navbar-logo span {
			font-size: 1rem;
		}
	}
</style>
