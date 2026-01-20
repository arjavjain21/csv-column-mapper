<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Features - CSV Column Mapper</title>
	<meta name="description" content="Discover all the powerful features of CSV Column Mapper" />
</svelte:head>

<div class="page-container">
	<main class="main-content">
		<div class="content-container">
			<!-- Hero Section -->
			<section class="hero-section">
				<h1>Powerful Features for Data Transformation</h1>
				<p>Everything you need to map, transform, and export CSV files efficiently</p>
			</section>

			<!-- Core Features -->
			<section class="content-section">
				<h2 class="section-header">Core Features</h2>
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
							</svg>
						</div>
						<h3>Drag & Drop Mapping</h3>
						<p>Intuitive interface to map columns between source and target files with simple drag-and-drop.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 20h9"></path>
								<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
							</svg>
						</div>
						<h3>Column Transformations</h3>
						<p>Transform data with split, concatenate, format, regex, date, and custom formula operations.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 11l3 3L22 4"></path>
								<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
							</svg>
						</div>
						<h3>Data Validation</h3>
						<p>Validate data with rules for required fields, email, URL, phone, date/number ranges, and regex patterns.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
						</div>
						<h3>Multiple Export Formats</h3>
						<p>Export to CSV, Excel, JSON, SQL INSERT statements, and more formats.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
							</svg>
						</div>
						<h3>100% Client-Side Processing</h3>
						<p>Your data never leaves your browser. Complete privacy and security for sensitive files.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
							</svg>
						</div>
						<h3>Live Preview</h3>
						<p>See your transformed data in real-time before exporting. Preview up to 100 rows instantly.</p>
					</div>
				</div>
			</section>

			<!-- Advanced Features -->
			<section class="content-section">
				<h2 class="section-header">Advanced Features (Pro & Business)</h2>
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
								<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
								<line x1="12" y1="22.08" x2="12" y2="12"></line>
							</svg>
						</div>
						<h3>Cloud Sync</h3>
						<p>Save your mappings to the cloud and access them from any device.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 16h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-4"></path>
								<rect x="2" y="6" width="20" height="12" rx="2"></rect>
							</svg>
						</div>
						<h3>REST API Access</h3>
						<p>Integrate CSV processing into your workflows with our REST API.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
						</div>
						<h3>Team Collaboration</h3>
						<p>Share mappings with your team and collaborate on data transformation projects.</p>
					</div>
				</div>
			</section>

			<!-- CTA Section -->
			<section class="content-section">
				<div class="cta-card">
					<h2>Ready to Get Started?</h2>
					<p>Start transforming your CSV files today - no signup required!</p>
					<div class="cta-actions">
						<a href="/app" class="btn-primary">Start Mapping Free</a>
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

	.main-content {
		flex: 1;
		padding: 3rem 1.5rem;
	}

	.content-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.hero-section {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero-section h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.hero-section p {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.content-section {
		margin-bottom: 4rem;
	}

	.section-header {
		font-size: 1.875rem;
		font-weight: 600;
		margin-bottom: 2rem;
		color: var(--color-text-primary);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
		transition: border-color 150ms, box-shadow 150ms;
	}

	.feature-card:hover {
		border-color: var(--color-accent);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.feature-icon {
		width: 48px;
		height: 48px;
		border-radius: 0.5rem;
		background-color: var(--color-accent);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
	}

	.feature-card p {
		font-size: 0.938rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.cta-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 3rem;
		text-align: center;
	}

	.cta-card h2 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
	}

	.cta-card p {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		text-decoration: none;
		transition: all 150ms;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
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
		border-color: var(--color-border-subtle);
	}

	@media (max-width: 768px) {
		.hero-section h1 {
			font-size: 2rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.cta-card {
			padding: 2rem 1.5rem;
		}
	}
</style>
