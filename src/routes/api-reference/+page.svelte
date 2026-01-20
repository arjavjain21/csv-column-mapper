<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>API Reference - CSV Column Mapper</title>
	<meta name="description" content="API documentation for CSV Column Mapper" />
</svelte:head>

<div class="page-container">
	<header class="page-header">
		<nav class="nav">
			<div class="nav-container">
				<div class="logo">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
						<polyline points="14 2 14 8 20 8"></polyline>
						<line x1="16" y1="13" x2="8" y2="13"></line>
						<line x1="16" y1="17" x2="8" y2="17"></line>
						<polyline points="10 9 9 9 8 9"></polyline>
					</svg>
					<span>CSV Mapper</span>
				</div>
				<div class="nav-links">
					<a href="/" class="nav-link">Back to Home</a>
					<ThemeToggle />
				</div>
			</div>
		</nav>
	</header>

	<main class="main-content">
		<div class="content-container">
			<!-- Hero Section -->
			<section class="hero-section">
				<h1 class="page-title">API Reference</h1>
				<p class="page-subtitle">
					Integrate CSV Column Mapper into your workflow
				</p>
			</section>

			<!-- API Notice -->
			<div class="notice-card">
				<div class="notice-content">
					<h3>API Access Coming Soon</h3>
					<p>
						The REST API is currently in development. Pro, Business, and Enterprise subscribers will have access to programmatic CSV mapping operations.
						<a href="/pricing">Upgrade to Pro plan</a> to get notified when API access launches.
					</p>
				</div>
			</div>

			<!-- Coming Soon Features -->
			<div class="features-grid">
				<div class="feature-item">
					<h3>📋 Mapping Endpoints</h3>
					<p>Create, read, update, and delete column mappings programmatically</p>
				</div>
				<div class="feature-item">
					<h3>⚡ Transform API</h3>
					<p>Upload and transform CSV files with a single API call</p>
				</div>
				<div class="feature-item">
					<h3>📊 Quota Management</h3>
					<p>Check your usage and remaining quota before processing</p>
				</div>
				<div class="feature-item">
					<h3>🔑 Authentication</h3>
					<p>Secure API key-based authentication for all requests</p>
				</div>
			</div>

			<!-- CTA Section -->
			<section class="cta-section">
				<h2 class="cta-title">Interested in API Access?</h2>
				<p class="cta-text">
					Contact us to learn more about API availability and pricing for your use case.
				</p>
				<a href="mailto:api-support@csvmapper.com" class="btn-primary">Contact Us</a>
			</section>
		</div>
	</main>
</div>

<style>
	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
	}

	/* Header & Nav */
	.page-header {
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav {
		padding: 1rem 1.5rem;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-decoration: none;
	}

	.logo svg {
		color: var(--color-accent);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 150ms;
	}

	.nav-link:hover {
		color: var(--color-accent);
	}

	/* Main Content */
	.main-content {
		flex: 1;
		padding: 3rem 1.5rem;
	}

	.content-container {
		max-width: 900px;
		margin: 0 auto;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-title {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.page-subtitle {
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Notice Card */
	.notice-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-accent);
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 3rem;
	}

	.notice-content h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 1rem;
	}

	.notice-content p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	.notice-content a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	/* Features Grid */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.feature-item {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.feature-item h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.5rem;
	}

	.feature-item p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin: 0;
	}

	/* CTA Section */
	.cta-section {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-accent);
		border-radius: 16px;
		padding: 3rem 2rem;
		text-align: center;
	}

	.cta-title {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.cta-text {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		color: var(--color-text-secondary);
	}

	.btn-primary {
		padding: 0.875rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition: all 150ms;
		background-color: var(--color-accent);
		color: white;
		display: inline-block;
	}

	.btn-primary:hover {
		background-color: var(--color-accent-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.page-subtitle {
			font-size: 1.125rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.cta-title {
			font-size: 1.5rem;
		}
	}
</style>
