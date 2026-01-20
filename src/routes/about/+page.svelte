<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>About Us - CSV Column Mapper</title>
	<meta name="description" content="Learn about CSV Column Mapper's mission, values, and team" />
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
				<h1>About CSV Column Mapper</h1>
				<p>Making data transformation simple, fast, and secure for everyone</p>
			</section>

			<!-- Mission Section -->
			<section class="content-section">
				<div class="card">
					<h2>Our Mission</h2>
					<p>
						We believe that working with data shouldn't require a PhD in computer science or an
						expensive enterprise license. CSV Column Mapper was born from a simple frustration:
						<strong>why does transforming CSV files have to be so complicated?</strong>
					</p>
					<p>
						Our mission is to empower data professionals, analysts, and businesses to transform
						their data efficiently without sacrificing privacy, security, or their budget.
					</p>
				</div>
			</section>

			<!-- Problem vs Solution -->
			<section class="content-section">
				<h2 class="section-header">Why CSV Column Mapper?</h2>
				<div class="comparison-grid">
					<div class="card comparison-card">
						<h3>The Problem</h3>
						<ul class="comparison-list">
							<li>Complex ETL tools costing thousands per month</li>
							<li>Uploading sensitive data to third-party servers</li>
							<li>Writing fragile Python scripts that break constantly</li>
							<li>Spending hours on manual Excel work</li>
						</ul>
					</div>
					<div class="card comparison-card">
						<h3>Our Solution</h3>
						<ul class="comparison-list">
							<li>Simple, intuitive drag-and-drop interface</li>
							<li>Client-side processing for maximum privacy</li>
							<li>Affordable pricing for everyone</li>
							<li>No data lock-in - export anytime</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- Core Values -->
			<section class="content-section">
				<div class="card">
					<h2>Our Core Values</h2>
					<div class="values-grid">
						<div class="value-card">
							<div class="value-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h3>Privacy First</h3>
							<p>
								We don't sell your data. Client-side processing means your files never leave your
								browser unless you want them to.
							</p>
						</div>
						<div class="value-card">
							<div class="value-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3>Simplicity</h3>
							<p>
								Complex problems should have simple solutions. We obsess over making every feature
								intuitive and easy to use.
							</p>
						</div>
						<div class="value-card">
							<div class="value-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3>Fair Pricing</h3>
							<p>
								Pay for what you use. No hidden fees, no surprise charges, no enterprise-only
								features.
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Tech Stack -->
			<section class="content-section">
				<div class="card">
					<h2>Built With Modern Technology</h2>
					<p>
						We leverage cutting-edge open-source technologies to deliver a fast, reliable, and
						secure platform:
					</p>
					<div class="tech-grid">
						<div class="tech-item">
							<div class="tech-icon">⚡</div>
							<div>
								<h4>SvelteKit</h4>
								<p>Lightning-fast frontend</p>
							</div>
						</div>
						<div class="tech-item">
							<div class="tech-icon">🗄️</div>
							<div>
								<h4>Supabase</h4>
								<p>PostgreSQL database</p>
							</div>
						</div>
						<div class="tech-item">
							<div class="tech-icon">🔒</div>
							<div>
								<h4>Stripe</h4>
								<p>Secure payments</p>
							</div>
						</div>
						<div class="tech-item">
							<div class="tech-icon">☁️</div>
							<div>
								<h4>AWS</h4>
								<p>Cloud infrastructure</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- CTA Section -->
			<section class="content-section">
				<div class="card cta-card">
					<h2>Ready to Transform Your Data?</h2>
					<p>Join thousands of data professionals who trust CSV Column Mapper</p>
					<div class="cta-actions">
						<a href="/app" class="btn-primary">Get Started Free</a>
						<a href="/pricing" class="btn-secondary">View Pricing</a>
					</div>
				</div>
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

	.hero-section h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.hero-section p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3rem;
	}

	.section-header {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--color-text-primary);
	}

	/* Cards */
	.card {
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.card h4 {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
		color: var(--color-text-primary);
	}

	.card p {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
	}

	.card p:last-child {
		margin-bottom: 0;
	}

	.card strong {
		color: var(--color-text-primary);
		font-weight: 500;
	}

	/* Comparison Section */
	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.comparison-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.comparison-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.comparison-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.comparison-list li {
		padding: 0.5rem 0 0.5rem 1.5rem;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		position: relative;
	}

	.comparison-list li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.2rem;
		line-height: 1;
	}

	/* Values Grid */
	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.value-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
		text-align: center;
		transition: border-color 150ms, box-shadow 150ms;
	}

	.value-card:hover {
		border-color: var(--color-border-subtle);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.value-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: var(--color-accent);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1rem;
	}

	.value-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		margin-top: 0;
		color: var(--color-text-primary);
	}

	.value-card p {
		font-size: 0.813rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Tech Grid */
	.tech-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.tech-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		transition: border-color 150ms;
	}

	.tech-item:hover {
		border-color: var(--color-border-subtle);
	}

	.tech-icon {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.tech-item h4 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		margin-top: 0;
		color: var(--color-text-primary);
	}

	.tech-item p {
		font-size: 0.813rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* CTA Section */
	.cta-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
		text-align: center;
		position: relative;
	}

	.cta-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.cta-card h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
	}

	.cta-card p {
		font-size: 0.938rem;
		color: var(--color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		background-color: var(--color-accent);
		color: #ffffff !important;
		padding: 0.75rem 1.25rem;
		border-radius: 0.25rem;
		font-weight: 500;
		font-size: 0.875rem;
		border: none;
		transition: background-color 150ms, transform 150ms;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none !important;
		cursor: pointer;
		min-height: 40px;
	}

	.btn-primary:hover {
		background-color: var(--color-accent-hover);
		color: #ffffff !important;
		transform: translateY(-1px);
		text-decoration: none !important;
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	.btn-secondary {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary) !important;
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-border-subtle);
		color: var(--color-text-primary) !important;
		transform: translateY(-1px);
		text-decoration: none !important;
	}

	.btn-secondary:active {
		transform: translateY(0);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.main-content {
			padding: 2rem 1.5rem;
		}

		.hero-section h1 {
			font-size: 1.75rem;
		}

		.comparison-grid,
		.values-grid,
		.tech-grid {
			grid-template-columns: 1fr;
		}

		.cta-card {
			padding: 1.5rem;
		}

		.cta-actions {
			flex-direction: column;
		}

		.cta-actions .btn-primary,
		.cta-actions .btn-secondary {
			width: 100%;
			justify-content: center;
		}
	}
</style>
