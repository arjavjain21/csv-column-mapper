<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Templates - CSV Column Mapper</title>
	<meta name="description" content="Pre-built mapping templates for common file formats" />
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
				<h1 class="page-title">Mapping Templates</h1>
				<p class="page-subtitle">
					Pre-built templates for common CSV file transformations
				</p>
			</section>

			<!-- Templates Notice -->
			<div class="notice-card notice-blue">
				<div class="notice-content">
					<div class="notice-icon">
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="notice-text">
						<h3>Templates Available on Pro+</h3>
						<p>
							Saved templates are available to Pro, Business, and Enterprise subscribers. Free users can still manually create mappings. <a href="/pricing">Upgrade to Pro</a> to access templates.
						</p>
					</div>
				</div>
			</div>

			<!-- Search and Filter -->
			<div class="search-card">
				<div class="search-grid">
					<div class="search-field">
						<label>Search Templates</label>
						<input
							type="text"
							placeholder="Search by platform, format, or use case..."
							class="search-input"
						/>
					</div>
					<div class="filter-field">
						<label>Category</label>
						<select class="filter-select">
							<option>All Categories</option>
							<option>E-commerce</option>
							<option>CRM</option>
							<option>Marketing</option>
							<option>Finance</option>
							<option>Import/Export</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Popular Templates -->
			<h2 class="section-title-large">Popular Templates</h2>

			<div class="templates-grid">
				<!-- Template Card 1 -->
				<div class="template-card">
					<div class="template-icon template-icon-green">
						<span class="template-emoji">🛍️</span>
					</div>
					<div class="template-content">
						<h3>Shopify → Salesforce</h3>
						<p class="template-category">E-commerce to CRM</p>
						<p class="template-description">
							Transform Shopify customer export for Salesforce CRM import
						</p>
						<div class="template-meta">
							<span>15 columns mapped</span>
							<span>Used 2.3k times</span>
						</div>
					</div>
				</div>

				<!-- Template Card 2 -->
				<div class="template-card">
					<div class="template-icon template-icon-blue">
						<span class="template-emoji">💼</span>
					</div>
					<div class="template-content">
						<h3>HubSpot → Mailchimp</h3>
						<p class="template-category">CRM to Marketing</p>
						<p class="template-description">
							Sync HubSpot contacts to Mailchimp mailing lists
						</p>
						<div class="template-meta">
							<span>12 columns mapped</span>
							<span>Used 1.8k times</span>
						</div>
					</div>
				</div>

				<!-- Template Card 3 -->
				<div class="template-card">
					<div class="template-icon template-icon-purple">
						<span class="template-emoji">📊</span>
					</div>
					<div class="template-content">
						<h3>QuickBooks → Excel</h3>
						<p class="template-category">Finance to Spreadsheet</p>
						<p class="template-description">
							Export QuickBooks transactions to Excel-friendly format
						</p>
						<div class="template-meta">
							<span>20 columns mapped</span>
							<span>Used 3.1k times</span>
						</div>
					</div>
				</div>

				<!-- Template Card 4 -->
				<div class="template-card">
					<div class="template-icon template-icon-orange">
						<span class="template-emoji">📧</span>
					</div>
					<div class="template-content">
						<h3>Gmail Contacts → CSV</h3>
						<p class="template-category">Export to Standard</p>
						<p class="template-description">
							Convert Gmail contacts export to universal CSV format
						</p>
						<div class="template-meta">
							<span>8 columns mapped</span>
							<span>Used 5.2k times</span>
						</div>
					</div>
				</div>

				<!-- Template Card 5 -->
				<div class="template-card">
					<div class="template-icon template-icon-red">
						<span class="template-emoji">🏦</span>
					</div>
					<div class="template-content">
						<h3>Stripe → Xero</h3>
						<p class="template-category">Payments to Accounting</p>
						<p class="template-description">
							Import Stripe transactions into Xero accounting software
						</p>
						<div class="template-meta">
							<span>18 columns mapped</span>
							<span>Used 1.4k times</span>
						</div>
					</div>
				</div>

				<!-- Template Card 6 -->
				<div class="template-card">
					<div class="template-icon template-icon-teal">
						<span class="template-emoji">🎯</span>
					</div>
					<div class="template-content">
						<h3>Facebook Ads → Google Analytics</h3>
						<p class="template-category">Marketing Import</p>
						<p class="template-description">
							Transform Facebook Ads export for GA data import
						</p>
						<div class="template-meta">
							<span>25 columns mapped</span>
							<span>Used 987 times</span>
						</div>
					</div>
				</div>
			</div>

			<!-- All Templates by Category -->
			<h2 class="section-title-large">Browse by Category</h2>

			<!-- E-commerce -->
			<section class="category-section">
				<h3 class="category-title">
					<span class="category-emoji">🛍️</span> E-commerce
				</h3>
				<div class="category-grid">
					{#each ['Shopify → WooCommerce', 'Magento → Shopify', 'BigCommerce → Salesforce', 'Amazon → Google Shopping'] as template}
						<div class="template-item">
							<span>{template}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- CRM -->
			<section class="category-section">
				<h3 class="category-title">
					<span class="category-emoji">💼</span> CRM & Sales
				</h3>
				<div class="category-grid">
					{#each ['Salesforce → HubSpot', 'Pipedrive → Zoho', 'Monday → Asana', 'Excel → Salesforce'] as template}
						<div class="template-item">
							<span>{template}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Marketing -->
			<section class="category-section">
				<h3 class="category-title">
					<span class="category-emoji">📢</span> Marketing
				</h3>
				<div class="category-grid">
					{#each ['Mailchimp → Constant Contact', 'ConvertKit → ActiveCampaign', 'LinkedIn → HubSpot', 'Twitter → CSV'] as template}
						<div class="template-item">
							<span>{template}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Finance -->
			<section class="category-section">
				<h3 class="category-title">
					<span class="category-emoji">💰</span> Finance & Accounting
				</h3>
				<div class="category-grid">
					{#each ['QuickBooks → Xero', 'Wave → QuickBooks', 'Bank CSV → Excel', 'Expensify → CSV'] as template}
						<div class="template-item">
							<span>{template}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Request Template -->
			<section class="cta-section">
				<h2 class="cta-title">Don't See Your Template?</h2>
				<p class="cta-text">
					We're constantly adding new templates. Request one and we'll build it for you!
				</p>
				<div class="cta-actions">
					<a href="mailto:templates@csvmapper.com" class="btn-primary">Request Template</a>
					<a href="/app" class="btn-secondary">Create Custom Mapping</a>
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
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 3rem;
	}

	.notice-card.notice-blue {
		background-color: rgba(59, 130, 246, 0.1);
		border-color: var(--color-accent);
	}

	.notice-content {
		display: flex;
		gap: 1rem;
		align-items: start;
	}

	.notice-icon {
		flex-shrink: 0;
		color: var(--color-accent);
		margin-top: 0.25rem;
	}

	.notice-text h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
	}

	.notice-text p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.notice-text a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	/* Search Card */
	.search-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 3rem;
	}

	.search-grid {
		display: grid;
		grid-template-columns: 1fr 256px;
		gap: 1rem;
	}

	.search-field,
	.filter-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.search-field label,
	.filter-field label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.search-input,
	.filter-select {
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.9375rem;
		transition: border-color 150ms;
	}

	.search-input:focus,
	.filter-select:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	/* Section Title */
	.section-title-large {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 2rem;
		color: var(--color-text-primary);
	}

	/* Templates Grid */
	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.template-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 150ms;
		cursor: pointer;
	}

	.template-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.template-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.template-icon.template-icon-green {
		background-color: rgba(16, 185, 129, 0.15);
	}

	.template-icon.template-icon-blue {
		background-color: rgba(59, 130, 246, 0.15);
	}

	.template-icon.template-icon-purple {
		background-color: rgba(139, 92, 246, 0.15);
	}

	.template-icon.template-icon-orange {
		background-color: rgba(249, 115, 22, 0.15);
	}

	.template-icon.template-icon-red {
		background-color: rgba(239, 68, 68, 0.15);
	}

	.template-icon.template-icon-teal {
		background-color: rgba(20, 184, 166, 0.15);
	}

	.template-emoji {
		font-size: 1.5rem;
	}

	.template-content h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: var(--color-text-primary);
	}

	.template-category {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.75rem;
	}

	.template-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.template-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	/* Category Section */
	.category-section {
		margin-bottom: 3rem;
	}

	.category-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.category-emoji {
		font-size: 1.5rem;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	.template-item {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 1rem;
		transition: all 150ms;
		cursor: pointer;
	}

	.template-item:hover {
		border-color: var(--color-accent);
	}

	.template-item span {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
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
		.templates-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		}

		.search-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.page-subtitle {
			font-size: 1.125rem;
		}

		.section-title-large {
			font-size: 1.5rem;
		}

		.templates-grid {
			grid-template-columns: 1fr;
		}

		.category-grid {
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
