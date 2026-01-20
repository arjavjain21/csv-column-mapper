<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let loading = $state(true);
	let error = $state('');
	let success = $state(false);

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const errorParam = params.get('error');
		const errorDescription = params.get('error_description');

		// Handle errors from Supabase
		if (errorParam) {
			error = errorDescription || errorParam;
			loading = false;
			return;
		}

		try {
			// Wait for Supabase to process the URL and set the session
			// The Supabase client with detectSessionInUrl will handle this automatically
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Check if user is authenticated
			const unsubscribe = authStore.subscribe((state) => {
				if (!state.loading) {
					if (state.user) {
						// Success! User is authenticated
						success = true;
						loading = false;

						// Redirect to dashboard after showing success message
						setTimeout(() => {
							// Get redirect from URL params if present
							const redirect = params.get('redirect') || '/dashboard';
							goto(redirect);
						}, 2000);
					} else {
						// No user found - authentication failed
						error = 'Authentication failed. Please try again.';
						loading = false;
					}
					unsubscribe(); // Clean up subscription
				}
			});
		} catch (e) {
			error = 'Failed to authenticate. Please try again.';
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Authenticating - CSV Column Mapper</title>
	<meta name="description" content="Signing you into CSV Column Mapper" />
</svelte:head>

<div class="auth-container">
	<!-- Header with Theme Toggle -->
	<header class="auth-header">
		<a href="/" class="logo-link">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<line x1="16" y1="13" x2="8" y2="13"></line>
				<line x1="16" y1="17" x2="8" y2="17"></line>
				<polyline points="10 9 9 9 8 9"></polyline>
			</svg>
			<span>CSV Mapper</span>
		</a>
		<ThemeToggle />
	</header>

	<!-- Main Content -->
	<main class="auth-main">
		<div class="auth-card">
			{#if loading}
				<!-- Loading State -->
				<div class="state-content loading">
					<div class="spinner-large">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
							<path class="spinner-path" d="M4 12a8 8 0 0 1 8-8v8H4z" fill="currentColor" />
						</svg>
					</div>
					<h2 class="state-title">Signing you in...</h2>
					<p class="state-description">Please wait while we verify your credentials</p>
				</div>

			{:else if success}
				<!-- Success State -->
				<div class="state-content success">
					<div class="icon-circle success-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</div>
					<h2 class="state-title">Welcome back!</h2>
					<p class="state-description">You're being redirected to the dashboard...</p>
					<div class="progress-bar">
						<div class="progress-fill"></div>
					</div>
				</div>

			{:else if error}
				<!-- Error State -->
				<div class="state-content error">
					<div class="icon-circle error-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</div>
					<h2 class="state-title">Authentication Failed</h2>
					<p class="state-description">{error}</p>
					<div class="action-buttons">
						<a href="/auth" class="btn-primary">Try Again</a>
						<a href="/" class="btn-secondary">Go to Home</a>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
	}

	/* Header */
	.auth-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
	}

	.logo-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-decoration: none;
		transition: color 150ms;
	}

	.logo-link:hover {
		color: var(--color-accent);
	}

	.logo-link svg {
		color: var(--color-accent);
	}

	/* Main Content */
	.auth-main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
	}

	.auth-card {
		width: 100%;
		max-width: 480px;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 3rem 2.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	/* State Content */
	.state-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	/* Loading Spinner */
	.spinner-large {
		animation: spin 1s linear infinite;
	}

	.spinner-large .spinner-track {
		opacity: 0.25;
	}

	.spinner-large .spinner-path {
		opacity: 0.75;
		color: var(--color-accent);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Icon Circle */
	.icon-circle {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.success-icon {
		background-color: rgba(16, 185, 129, 0.1);
		color: var(--color-success);
	}

	.error-icon {
		background-color: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	/* Titles */
	.state-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.state-description {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	/* Progress Bar */
	.progress-bar {
		width: 100%;
		height: 4px;
		background-color: var(--color-bg-tertiary);
		border-radius: 2px;
		overflow: hidden;
		margin-top: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-accent);
		animation: progress 1.5s ease-in-out;
		transform-origin: left;
	}

	@keyframes progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	/* Action Buttons */
	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		margin-top: 1rem;
	}

	.btn-primary,
	.btn-secondary {
		width: 100%;
		padding: 0.875rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		text-align: center;
		transition: all 0.15s ease;
		cursor: pointer;
		display: block;
	}

	.btn-primary {
		background-color: var(--color-accent);
		color: #ffffff;
		border: none;
	}

	.btn-primary:hover {
		background-color: var(--color-accent-hover);
		transform: translateY(-1px);
	}

	.btn-secondary {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-accent);
		color: var(--color-accent);
		transform: translateY(-1px);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.auth-card {
			padding: 2rem 1.5rem;
		}

		.state-title {
			font-size: 1.25rem;
		}
	}
</style>

