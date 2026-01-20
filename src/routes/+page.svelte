<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	// Professional SaaS landing page
</script>

<svelte:head>
	<title>CSV Column Mapper - Transform Your Data in Seconds</title>
	<meta name="description" content="Map, transform, and export CSV columns efficiently. No coding required." />
</svelte:head>

<div class="landing-container">
	<!-- Navigation -->
	<header class="header">
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
					<a href="#features" class="nav-link">Features</a>
					<a href="#how-it-works" class="nav-link">How It Works</a>
					<a href="#pricing" class="nav-link">Pricing</a>
					<a href="/app" class="btn-primary">Launch App</a>
					<ThemeToggle />
				</div>
			</div>
		</nav>
	</header>

	<main>
		<!-- Hero Section -->
		<section class="hero">
			<div class="hero-container">
				<div class="hero-content">
					<div class="hero-badge">
						<span>100% Private</span>
						<span>•</span>
						<span>No Signup Required</span>
					</div>
					<h1>Transform Your CSV Data in Seconds</h1>
					<p class="hero-description">
						Map columns, transform data, and export clean files without writing a single line of code.
						Perfect for data migration, ETL workflows, and system integrations.
					</p>
					<div class="hero-actions">
						<a href="/app" class="btn-primary btn-large">Start Mapping Free</a>
						<a href="#how-it-works" class="btn-secondary btn-large">See How It Works</a>
					</div>
					<div class="hero-stats">
						<div class="stat">
							<div class="stat-value">500K+</div>
							<div class="stat-label">Files Processed</div>
						</div>
						<div class="stat">
							<div class="stat-value">100%</div>
							<div class="stat-label">Client-Side</div>
						</div>
						<div class="stat">
							<div class="stat-value">0</div>
							<div class="stat-label">Data Stored</div>
						</div>
					</div>
				</div>

				<!-- Preview/Demo Section -->
				<div class="hero-preview">
					<div class="preview-card">
						<div class="preview-header">
							<div class="preview-dots">
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div class="preview-title">CSV Column Mapper</div>
						</div>
						<div class="preview-body">
							<div class="preview-columns">
								<div class="preview-column">
									<div class="column-header">Source</div>
									<div class="column-items">
										<div class="column-item">user_email</div>
										<div class="column-item">first_name</div>
										<div class="column-item">last_name</div>
										<div class="column-item">phone_number</div>
									</div>
								</div>
								<div class="preview-arrows">→</div>
								<div class="preview-column">
									<div class="column-header">Target</div>
									<div class="column-items">
										<div class="column-item mapped">Email Address</div>
										<div class="column-item mapped">First Name</div>
										<div class="column-item mapped">Last Name</div>
										<div class="column-item">Phone</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section id="features" class="features">
			<div class="section-container">
				<div class="section-header">
					<h2>Powerful Features, Simple Interface</h2>
					<p>Everything you need to transform your CSV data efficiently</p>
				</div>

				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
								<polyline points="13 2 13 9 20 9"></polyline>
							</svg>
						</div>
						<h3>Drag & Drop Mapping</h3>
						<p>Intuitive interface to map columns between files. Just drag and drop to connect source to target.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="3" y1="9" x2="21" y2="9"></line>
								<line x1="9" y1="21" x2="9" y2="9"></line>
							</svg>
						</div>
						<h3>Live Preview</h3>
						<p>See exactly what your output will look like before exporting. Preview first 10 rows instantly.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
						</div>
						<h3>Multiple Formats</h3>
						<p>Export to CSV, Excel, JSON, or more. Support for various delimiters and encodings.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
							</svg>
						</div>
						<h3>100% Private</h3>
						<p>All processing happens in your browser. Your data never leaves your computer.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="2" y1="12" x2="22" y2="12"></line>
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
							</svg>
						</div>
						<h3>Cloud Sync (Pro)</h3>
						<p>Save mappings to the cloud and access them from any device. Never lose your work.</p>
					</div>

					<div class="feature-card">
						<div class="feature-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
								<line x1="8" y1="21" x2="16" y2="21"></line>
								<line x1="12" y1="17" x2="12" y2="21"></line>
							</svg>
						</div>
						<h3>Smart Mapping</h3>
						<p>Intelligent column detection and auto-matching to save you time and reduce manual work.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Works Section -->
		<section id="how-it-works" class="how-it-works">
			<div class="section-container">
				<div class="section-header">
					<h2>How It Works</h2>
					<p>Three simple steps to transform your data</p>
				</div>

				<div class="steps">
					<div class="step">
						<div class="step-number">1</div>
						<div class="step-content">
							<h3>Upload Your Files</h3>
							<p>Upload your schema file (target structure) and data file (source data). We support CSV, TSV, and other delimited formats.</p>
						</div>
					</div>

					<div class="step">
						<div class="step-number">2</div>
						<div class="step-content">
							<h3>Map Your Columns</h3>
							<p>Drag and drop to map source columns to target columns. Preview your changes in real-time before exporting.</p>
						</div>
					</div>

					<div class="step">
						<div class="step-number">3</div>
						<div class="step-content">
							<h3>Export Clean Data</h3>
							<p>Export your transformed data in any format. Perfect for importing into other systems or analysis tools.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Use Cases Section -->
		<section class="use-cases">
			<div class="section-container">
				<div class="section-header">
					<h2>Built for Data Workflows</h2>
					<p>Trusted by data teams, analysts, and engineers worldwide</p>
				</div>

				<div class="use-cases-grid">
					<div class="use-case-card">
						<h3>Data Migration</h3>
						<p>Migrate data between CRM systems, databases, or applications seamlessly.</p>
					</div>
					<div class="use-case-card">
						<h3>ETL Workflows</h3>
						<p>Extract, transform, and load data for your data warehouse and analytics.</p>
					</div>
					<div class="use-case-card">
						<h3>System Integration</h3>
						<p>Map data formats between different systems and APIs effortlessly.</p>
					</div>
					<div class="use-case-card">
						<h3>Data Cleaning</h3>
						<p>Transform messy data into clean, consistent formats for analysis.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Pricing Section -->
		<section id="pricing" class="pricing">
			<div class="section-container">
				<div class="section-header">
					<h2>Simple, Transparent Pricing</h2>
					<p>Start free, upgrade when you need more features</p>
				</div>

				<div class="pricing-grid">
					<div class="pricing-card free">
						<div class="pricing-header">
							<h3>Free</h3>
							<div class="price">$0<span>/month</span></div>
						</div>
						<div class="pricing-features">
							<div class="feature-item">✓ Unlimited mappings</div>
							<div class="feature-item">✓ Local processing</div>
							<div class="feature-item">✓ Basic features</div>
							<div class="feature-item">✓ No account required</div>
						</div>
						<a href="/app" class="btn-secondary btn-full">Get Started</a>
					</div>

					<div class="pricing-card pro">
						<div class="popular-badge">Most Popular</div>
						<div class="pricing-header">
							<h3>Pro</h3>
							<div class="price">$12<span>/month</span></div>
						</div>
						<div class="pricing-features">
							<div class="feature-item">✓ Everything in Free</div>
							<div class="feature-item">✓ Cloud sync</div>
							<div class="feature-item">✓ Advanced mapping features</div>
							<div class="feature-item">✓ Email support</div>
							<div class="feature-item">✓ Priority processing</div>
						</div>
						<a href="/pricing" class="btn-primary btn-full">Start Free Trial</a>
					</div>

					<div class="pricing-card business">
						<div class="pricing-header">
							<h3>Business</h3>
							<div class="price">$39<span>/month</span></div>
						</div>
						<div class="pricing-features">
							<div class="feature-item">✓ Everything in Pro</div>
							<div class="feature-item">✓ Team collaboration</div>
							<div class="feature-item">✓ API access</div>
							<div class="feature-item">✓ Priority support</div>
							<div class="feature-item">✓ 5 team members</div>
						</div>
						<a href="/pricing" class="btn-secondary btn-full">Contact Sales</a>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="cta">
			<div class="cta-container">
				<h2>Ready to Transform Your Data?</h2>
				<p>Join thousands of users saving hours of manual work every day.</p>
				<div class="cta-actions">
					<a href="/app" class="btn-primary btn-large">Start Free — No Signup Required</a>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	/* Container */
	.landing-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
	}

	/* Header/Nav */
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background-color: var(--color-bg-primary);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--color-border);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		text-decoration: none;
	}

	.logo svg {
		color: var(--color-accent);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 150ms;
	}

	.nav-link:hover {
		color: var(--color-text-primary);
	}

	/* Hero Section */
	.hero {
		padding: 8rem 1.5rem 4rem;
		background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
	}

	.hero-container {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 2rem;
		font-size: 0.875rem;
		color: var(--color-accent);
		width: fit-content;
	}

	.hero h1 {
		font-size: 3rem;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.hero-description {
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-accent);
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		margin-top: 0.25rem;
	}

	/* Hero Preview */
	.hero-preview {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.preview-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		width: 100%;
		max-width: 500px;
		overflow: hidden;
	}

	.preview-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-tertiary);
		border-bottom: 1px solid var(--color-border);
	}

	.preview-dots {
		display: flex;
		gap: 0.375rem;
	}

	.preview-dots span {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--color-border);
	}

	.preview-title {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.preview-body {
		padding: 2rem 1.5rem;
	}

	.preview-columns {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1.5rem;
		align-items: center;
	}

	.preview-column {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.column-header {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	.column-items {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.column-item {
		padding: 0.5rem 0.75rem;
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-align: center;
	}

	.column-item.mapped {
		background-color: rgba(16, 185, 129, 0.1);
		border-color: rgba(16, 185, 129, 0.3);
		color: var(--color-success);
	}

	.preview-arrows {
		font-size: 1.5rem;
		color: var(--color-accent);
	}

	/* Features Section */
	.features {
		padding: 6rem 1.5rem;
		background-color: var(--color-bg-primary);
	}

	.section-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		font-size: 2.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.section-header p {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 150ms;
	}

	.feature-card:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
	}

	.feature-icon {
		width: 48px;
		height: 48px;
		background-color: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent);
	}

	.feature-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.feature-card p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* How It Works */
	.how-it-works {
		padding: 6rem 1.5rem;
		background-color: var(--color-bg-secondary);
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.step {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.step-number {
		width: 60px;
		height: 60px;
		background-color: var(--color-accent);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-content h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.step-content p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Use Cases */
	.use-cases {
		padding: 6rem 1.5rem;
	}

	.use-cases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.use-case-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.use-case-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.use-case-card p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	/* Pricing */
	.pricing {
		padding: 6rem 1.5rem;
		background-color: var(--color-bg-secondary);
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.pricing-card {
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.pricing-card.pro {
		border-color: var(--color-accent);
		box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
	}

	.popular-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-accent);
		color: white;
		padding: 0.25rem 1rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.pricing-header h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.price {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.price span {
		font-size: 1rem;
		font-weight: 400;
		color: var(--color-text-secondary);
	}

	.pricing-features {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.feature-item {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.btn-full {
		width: 100%;
		justify-content: center;
	}

	/* CTA Section */
	.cta {
		padding: 6rem 1.5rem;
		background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
		border-top: 1px solid var(--color-border);
	}

	.cta-container {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.cta h2 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.cta p {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}

	.cta-actions {
		display: flex;
		justify-content: center;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.hero-container {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.hero-stats {
			justify-items: center;
		}

		.hero-actions {
			justify-content: center;
		}
	}

	@media (max-width: 640px) {
		.nav-links {
			gap: 1rem;
		}

		.nav-link {
			display: none;
		}

		.hero h1 {
			font-size: 2rem;
		}

		.preview-columns {
			grid-template-columns: 1fr;
		}

		.preview-arrows {
			transform: rotate(90deg);
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.footer-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
