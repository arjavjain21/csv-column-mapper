<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ColumnMapper from '$lib/components/ColumnMapper.svelte';
	import MappingSummary from '$lib/components/MappingSummary.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { mappingStore, mappingActions } from '$lib/stores/mappingStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	let isAuthenticated = $state(false);
	let checkingAuth = $state(true);

	onMount(() => {
		// Check authentication status
		const unsubscribe = authStore.subscribe((state) => {
			if (!state.loading) {
				if (!state.user) {
					// Redirect to auth page if not authenticated
					goto('/auth?redirect=/app');
				} else {
					isAuthenticated = true;
				}
				checkingAuth = false;
			}
		});

		return unsubscribe;
	});

	function goToMapping() {
		mappingActions.setStep('mapping');
	}

	function resetApp() {
		mappingActions.reset();
	}

	function goHome() {
		goto('/');
	}
</script>

<div class="app-container">
	{#if checkingAuth}
		<div class="auth-checking">
			<div class="spinner"></div>
			<p>Checking authentication...</p>
		</div>
	{:else if isAuthenticated}
		{#if $mappingStore.step === 'upload'}
		<div class="upload-page">
			<header class="page-header">
				<div class="header-left">
					<button class="back-link" onclick={goHome}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M19 12H5M12 19l-7-7 7-7"/>
						</svg>
						<span>Back to Home</span>
					</button>
				</div>
				<div class="header-content">
					<h1>CSV Column Mapper</h1>
					<p class="subtitle">Upload your schema and data files to begin mapping columns</p>
				</div>
				<div class="header-actions">
					<button class="reset-btn" onclick={resetApp}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
						</svg>
						Reset
					</button>
					<ThemeToggle />
				</div>
			</header>

			<main class="upload-main">
				<div class="upload-grid">
					<section class="upload-section">
						<div class="section-header">
							<h2>Schema File</h2>
							<p class="section-description">Target structure with columns you want in the output</p>
						</div>
						<FileUpload role="schema" loadedFile={$mappingStore.schemaFile} />
					</section>

					<section class="upload-section">
						<div class="section-header">
							<h2>Data File</h2>
							<p class="section-description">Source file containing data to transform</p>
						</div>
						<FileUpload role="data" loadedFile={$mappingStore.dataFile} />
					</section>
				</div>

				<footer class="upload-footer">
					<div class="footer-content">
						<button
							class="btn-primary"
							disabled={!$mappingStore.schemaFile || !$mappingStore.dataFile}
							onclick={goToMapping}
						>
							Continue to Mapping
						</button>
						<small class="footer-hint">Both files required to proceed</small>
					</div>
				</footer>
			</main>
		</div>

	{:else if $mappingStore.step === 'mapping'}
		<ColumnMapper />

	{:else if $mappingStore.step === 'summary'}
		<MappingSummary />

	{/if}
	{/if}
</div>

<style>
	/* Auth Checking */
	.auth-checking {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: 1.5rem;
	}

	.auth-checking .spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-bg-tertiary);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.auth-checking p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Container */
	.app-container {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
		display: flex;
		flex-direction: column;
	}

	/* Upload Page */
	.upload-page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* Header */
	.page-header {
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		padding: 1.5rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		padding-left: 1.5rem;
	}

	.header-content {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		text-align: center;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-right: 1.5rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: color 150ms;
		padding: 0.5rem;
		border-radius: 6px;
	}

	.back-link:hover {
		color: var(--color-accent);
		background-color: var(--color-bg-tertiary);
	}

	.back-link svg {
		flex-shrink: 0;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 150ms;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}

	.reset-btn:hover {
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		border-color: var(--color-accent);
	}

	.header-content h1 {
		font-size: 1.25rem; /* 20px */
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.01em;
	}

	.subtitle {
		font-size: 0.875rem; /* 14px */
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	/* Main Content */
	.upload-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		width: 100%;
		box-sizing: border-box;
	}

	/* Upload Grid */
	.upload-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-wrap: wrap;
			gap: 1rem;
		}

		.header-left {
			order: 3;
			width: 100%;
			padding-left: 1.5rem;
			padding-bottom: 0.5rem;
		}

		.header-content {
			order: 1;
			width: 100%;
			padding: 0 1.5rem;
		}

		.header-actions {
			order: 2;
			width: 100%;
			padding-right: 1.5rem;
			justify-content: flex-end;
		}

		.upload-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Upload Section */
	.upload-section {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.section-header {
		margin-bottom: 1rem;
	}

	.section-header h2 {
		font-size: 1rem; /* 16px */
		font-weight: 500;
		color: var(--color-text-primary);
		margin: 0 0 0.25rem 0;
	}

	.section-description {
		font-size: 0.75rem; /* 12px */
		color: var(--color-text-tertiary);
		margin: 0;
		line-height: 1.4;
	}

	/* Footer */
	.upload-footer {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.footer-hint {
		color: var(--color-text-tertiary);
		text-align: center;
	}
</style>
