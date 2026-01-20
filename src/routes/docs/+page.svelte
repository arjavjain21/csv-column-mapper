<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Documentation - CSV Column Mapper</title>
	<meta name="description" content="Learn how to use CSV Column Mapper effectively" />
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
		<div class="content-container docs-container">
			<!-- Hero Section -->
			<section class="hero-section">
				<h1 class="page-title">Documentation</h1>
				<p class="page-subtitle">
					Everything you need to get started with CSV Column Mapper
				</p>
			</section>

			<!-- Main Grid -->
			<div class="docs-grid">
			<!-- Sidebar Navigation -->
			<aside class="sidebar">
				<nav class="sidebar-nav">
					<h3 class="sidebar-title">Quick Links</h3>
					<ul class="sidebar-links">
						<li><a href="#getting-started" class="sidebar-link">Getting Started</a></li>
						<li><a href="#creating-mappings" class="sidebar-link">Creating Mappings</a></li>
						<li><a href="#transformations" class="sidebar-link">Transformations</a></li>
						<li><a href="#validation" class="sidebar-link">Data Validation</a></li>
						<li><a href="#exporting" class="sidebar-link">Exporting Data</a></li>
						<li><a href="#troubleshooting" class="sidebar-link">Troubleshooting</a></li>
					</ul>
				</nav>
			</aside>

			<!-- Content -->
			<div class="docs-content">
				<!-- Getting Started -->
				<section id="getting-started" class="card">
					<h2 class="section-title">🚀 Getting Started</h2>
					<p class="section-text">
						Welcome to CSV Column Mapper! This guide will help you transform your CSV files
						in minutes.
					</p>

					<h3 class="subsection-title">Step 1: Upload Your File</h3>
					<p class="section-text">
						Drag and drop your CSV file or click to browse. We support files up to your plan's
						size limit (Free: 5MB, Pro: 50MB, Business: 250MB, Enterprise: 2GB).
					</p>

					<h3 class="subsection-title">Step 2: Preview Your Data</h3>
					<p class="section-text">
						Review the first 100 rows of your data. Check that columns are correctly detected and
						data looks as expected.
					</p>

					<h3 class="subsection-title">Step 3: Create Your Mapping</h3>
					<p class="section-text">
						Drag source columns to target columns to create your mapping. Add transformations
						and validation rules as needed.
					</p>
				</section>

				<!-- Creating Mappings -->
				<section id="creating-mappings" class="card">
					<h2 class="section-title">📋 Creating Mappings</h2>
					<h3 class="subsection-title">Drag and Drop Interface</h3>
					<p class="section-text">
						The easiest way to map columns is our drag-and-drop interface:
					</p>
					<ol class="styled-list">
						<li>Drag a column from the Source panel on the left</li>
						<li>Drop it onto a target column in the Target panel on the right</li>
						<li>The mapping is automatically created</li>
						<li>To remove a mapping, click the X button on the target column</li>
					</ol>

					<h3 class="subsection-title">Using Templates</h3>
					<p class="section-text">
						For common file formats, use our pre-built templates:
					</p>
					<ul class="styled-list">
						<li>Click "Browse Templates" on the mapping screen</li>
						<li>Search for your file type (e.g., "Shopify export")</li>
						<li>Click to apply the template automatically</li>
					</ul>

					<h3 class="subsection-title">Saving Your Mappings</h3>
					<p class="section-text">
						Paid users can save mappings for future use. Click "Save Mapping" and give it a
						descriptive name. Your saved mappings appear on the dashboard for one-click reuse.
					</p>
				</section>

				<!-- Transformations -->
				<section id="transformations" class="card">
					<h2 class="section-title">🔧 Transformations</h2>
					<p class="section-text">
						Transformations allow you to modify data during the mapping process:
					</p>

					<div class="transformations-grid">
						<div class="transform-card">
							<h4 class="transform-title">Text Transformations</h4>
							<ul class="transform-list">
								<li>• Trim whitespace</li>
								<li>• Convert case (UPPER, lower, Title)</li>
								<li>• Find and replace</li>
								<li>• Remove special characters</li>
							</ul>
						</div>

						<div class="transform-card">
							<h4 class="transform-title">Date Transformations</h4>
							<ul class="transform-list">
								<li>• Parse dates (auto-detect format)</li>
								<li>• Convert date formats</li>
								<li>• Extract date components</li>
								<li>• Date arithmetic</li>
							</ul>
						</div>

						<div class="transform-card">
							<h4 class="transform-title">Number Transformations</h4>
							<ul class="transform-list">
								<li>• Round decimals</li>
								<li>• Format as currency</li>
								<li>• Convert units</li>
								<li>• Mathematical operations</li>
							</ul>
						</div>

						<div class="transform-card">
							<h4 class="transform-title">Advanced</h4>
							<ul class="transform-list">
								<li>• Custom formulas (Pro+)</li>
								<li>• Conditional logic (Business+)</li>
								<li>• Lookup tables (Business+)</li>
								<li>• Regular expressions (Enterprise)</li>
							</ul>
						</div>
					</div>
				</section>

				<!-- Validation -->
				<section id="validation" class="card">
					<h2 class="section-title">✅ Data Validation</h2>
					<p class="section-text">
						Ensure data quality with validation rules:
					</p>

					<div class="validation-items">
						<div class="validation-item border-blue">
							<h4 class="validation-title">Required Fields</h4>
							<p class="validation-text">
								Mark columns as required to flag empty values
							</p>
						</div>

						<div class="validation-item border-green">
							<h4 class="validation-title">Type Validation</h4>
							<p class="validation-text">
								Ensure values match expected data types (email, URL, number, date)
							</p>
						</div>

						<div class="validation-item border-yellow">
							<h4 class="validation-title">Range Validation</h4>
							<p class="validation-text">
								Set min/max values for numeric data
							</p>
						</div>

						<div class="validation-item border-purple">
							<h4 class="validation-title">Pattern Validation</h4>
							<p class="validation-text">
								Use regex patterns for custom validation rules
							</p>
						</div>
					</div>
				</section>

				<!-- Exporting -->
				<section id="exporting" class="card">
					<h2 class="section-title">📥 Exporting Data</h2>
					<h3 class="subsection-title">Export Formats</h3>
					<p class="section-text">
						After creating your mapping, export data in multiple formats:
					</p>
					<ul class="styled-list">
						<li><strong>CSV:</strong> Standard comma-separated values</li>
						<li><strong>Excel (XLSX):</strong> Native Excel format with formatting</li>
						<li><strong>JSON:</strong> Structured JSON for developers</li>
						<li><strong>XML:</strong> XML format for legacy systems</li>
					</ul>

					<h3 class="subsection-title">Partial Exports</h3>
					<p class="section-text">
						Use row filters to export only specific data. This is useful for large files when
						you only need a subset.
					</p>
				</section>

				<!-- Troubleshooting -->
				<section id="troubleshooting" class="card">
					<h2 class="section-title">🔍 Troubleshooting</h2>
					<div class="troubleshooting-list">
						<div class="troubleshoot-item">
							<h4 class="troubleshoot-title">My file won't upload</h4>
							<p class="troubleshoot-text">
								<strong>Solution:</strong> Check that your file is under your plan's size limit.
								Ensure it's a valid CSV file (UTF-8 encoding works best).
							</p>
						</div>

						<div class="troubleshoot-item">
							<h4 class="troubleshoot-title">Columns aren't detected correctly</h4>
							<p class="troubleshoot-text">
								<strong>Solution:</strong> Make sure your CSV has a header row. If using custom
								delimiters, specify them in the upload options.
							</p>
						</div>

						<div class="troubleshoot-item">
							<h4 class="troubleshoot-title">Date transformations aren't working</h4>
							<p class="troubleshoot-text">
								<strong>Solution:</strong> Check that your source date format is consistent. Use
								the "Auto-detect" option or manually specify the format.
							</p>
						</div>

						<div class="troubleshoot-item">
							<h4 class="troubleshoot-title">"Quota exceeded" error</h4>
							<p class="troubleshoot-text">
								<strong>Solution:</strong> You've reached your monthly quota. Upgrade your plan
								or wait for your quota to reset on your billing anniversary.
							</p>
						</div>
					</div>
				</section>

				<!-- Still Need Help -->
				<section class="cta-section">
					<h2 class="cta-title">Still Need Help?</h2>
					<p class="cta-text">
						Our support team is here to assist you with any questions or issues.
					</p>
					<div class="cta-actions">
						<a href="/help" class="btn-primary">Visit Help Center</a>
						<a href="mailto:support@csvmapper.com" class="btn-secondary">Email Support</a>
					</div>
				</section>
			</div>
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
		max-width: 1400px;
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
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 4rem;
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

	/* Docs Grid */
	.docs-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 3rem;
		align-items: start;
	}

	.sidebar {
		position: sticky;
		top: 6rem;
	}

	.sidebar-nav {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.sidebar-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 1rem;
	}

	.sidebar-links {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sidebar-links li {
		margin-bottom: 0.5rem;
	}

	.sidebar-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		transition: all 150ms;
	}

	.sidebar-link:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-accent);
	}

	.docs-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 2rem;
	}

	.section-title {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--color-text-primary);
	}

	.section-text {
		font-size: 1rem;
		line-height: 1.75;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
	}

	.subsection-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		margin-top: 1.5rem;
		color: var(--color-text-primary);
	}

	.subsection-title:first-child {
		margin-top: 0;
	}

	.styled-list {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.75;
	}

	.styled-list li {
		margin-bottom: 0.5rem;
	}

	/* Transformations Grid */
	.transformations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.transform-card {
		background-color: var(--color-bg-tertiary);
		padding: 1.5rem;
		border-radius: 8px;
	}

	.transform-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.transform-list {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.transform-list li {
		padding: 0.25rem 0;
	}

	/* Validation Items */
	.validation-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.validation-item {
		padding-left: 1rem;
		border-left-width: 4px;
		border-left-style: solid;
	}

	.validation-item.border-blue {
		border-left-color: #3b82f6;
	}

	.validation-item.border-green {
		border-left-color: #10b981;
	}

	.validation-item.border-yellow {
		border-left-color: #f59e0b;
	}

	.validation-item.border-purple {
		border-left-color: #8b5cf6;
	}

	.validation-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
	}

	.validation-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Troubleshooting */
	.troubleshooting-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.troubleshoot-item {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.troubleshoot-item:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.troubleshoot-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
	}

	.troubleshoot-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, var(--color-accent) 0%, #8b5cf6 100%);
		border-radius: 16px;
		padding: 3rem 2rem;
		text-align: center;
		color: white;
	}

	.cta-title {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: white;
	}

	.cta-text {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.875rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition: all 150ms;
	}

	.btn-primary {
		background-color: white;
		color: var(--color-accent);
	}

	.btn-primary:hover {
		background-color: #f9fafb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.btn-secondary {
		background-color: transparent;
		color: white;
		border: 2px solid white;
	}

	.btn-secondary:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.docs-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.page-subtitle {
			font-size: 1.125rem;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.transformations-grid {
			grid-template-columns: 1fr;
		}

		.cta-title {
			font-size: 1.5rem;
		}

		.cta-actions {
			flex-direction: column;
		}
	}
</style>
