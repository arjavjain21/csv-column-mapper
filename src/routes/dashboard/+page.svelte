<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	let session = $state<any>(null);
	let loading = $state(true);

	onMount(async () => {
		// Check authentication using authStore
		const unsubscribe = authStore.subscribe((state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth');
					unsubscribe();
					return;
				}

				session = state.user;
				loading = false;
				unsubscribe();
			}
		});

		return unsubscribe;
	});

	async function handleLogout() {
		try {
			await authStore.signOut();
			goto('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<svelte:head>
	<title>Dashboard - CSV Column Mapper</title>
	<meta name="description" content="Your CSV Column Mapper Dashboard" />
</svelte:head>

<div class="dashboard-container">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading...</p>
		</div>
	{:else}
		<div class="dashboard-content">
			<!-- Welcome Section -->
			<div class="welcome-section">
				<h1>Welcome back!</h1>
				<p>You're signed in as <strong>{session?.email}</strong></p>
			</div>

			<!-- Quick Actions -->
			<div class="actions-grid">
				<a href="/app" class="action-card">
					<div class="action-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
							<line x1="16" y1="13" x2="8" y2="13"></line>
							<line x1="16" y1="17" x2="8" y2="17"></line>
							<polyline points="10 9 9 9 8 9"></polyline>
						</svg>
					</div>
					<h3>CSV Mapper</h3>
					<p>Transform your CSV files</p>
				</a>

				<a href="/pricing" class="action-card">
					<div class="action-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
						</svg>
					</div>
					<h3>Upgrade Plan</h3>
					<p>View pricing options</p>
				</a>
			</div>

			<!-- Account Info -->
			<div class="account-section">
				<h2>Account Information</h2>
				<div class="info-list">
					<div class="info-item">
						<span class="info-label">Email</span>
						<span class="info-value">{session?.email}</span>
					</div>
					<div class="info-item">
						<span class="info-label">User ID</span>
						<span class="info-value">{session?.id?.slice(0, 8)}...</span>
					</div>
					<div class="info-item">
						<span class="info-label">Plan</span>
						<span class="info-value">Free Plan</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard-container {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-bg-tertiary);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-state p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.dashboard-content {
		max-width: 1000px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.welcome-section {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
		text-align: center;
	}

	.welcome-section h1 {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.02em;
	}

	.welcome-section p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.action-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
		transition: all 0.15s ease;
	}

	.action-card:hover {
		border-color: var(--color-accent);
		background-color: var(--color-bg-elevated);
		transform: translateY(-2px);
	}

	.action-icon {
		width: 64px;
		height: 64px;
		background-color: var(--color-bg-tertiary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent);
	}

	.action-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.action-card p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.account-section {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
	}

	.account-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 1.5rem 0;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: var(--color-bg-tertiary);
		border-radius: 0.5rem;
	}

	.info-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.info-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	@media (max-width: 640px) {
		.dashboard-container {
			padding: 1rem;
		}

		.welcome-section {
			padding: 1.5rem;
		}

		.welcome-section h1 {
			font-size: 1.5rem;
		}

		.actions-grid {
			grid-template-columns: 1fr;
		}

		.info-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
