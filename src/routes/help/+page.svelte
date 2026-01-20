<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Help Center - CSV Column Mapper</title>
	<meta name="description" content="Get help with CSV Column Mapper" />
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
				<h1 class="page-title">Help Center</h1>
				<p class="page-subtitle">
					Find answers, tutorials, and support
				</p>
			</section>

			<!-- Search -->
			<div class="search-card">
				<h2 class="search-title">How can we help?</h2>
				<div class="search-input-wrapper">
					<input
						type="text"
						placeholder="Search for answers..."
						class="search-input-large"
					/>
					<svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			<!-- Quick Links -->
			<div class="quick-links-grid">
				<a href="/docs" class="quick-link-card quick-link-blue">
					<div class="quick-link-icon">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
					</div>
					<h3>Documentation</h3>
					<p>Step-by-step guides and tutorials</p>
				</a>

				<a href="/api-reference" class="quick-link-card quick-link-green">
					<div class="quick-link-icon">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
						</svg>
					</div>
					<h3>API Reference</h3>
					<p>Integrate with your applications</p>
				</a>

				<a href="/templates" class="quick-link-card quick-link-purple">
					<div class="quick-link-icon">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
						</svg>
					</div>
					<h3>Templates</h3>
					<p>Pre-built mappings for common tasks</p>
				</a>
			</div>

			<!-- FAQ Section -->
			<h2 class="section-title-large">Frequently Asked Questions</h2>

			<div class="faq-list">
				<!-- FAQ Item 1 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>How do I get started?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>Simply go to the <a href="/app">app</a>, upload your CSV file, and start mapping columns. No registration required for basic use!</p>
					</div>
				</div>

				<!-- FAQ Item 2 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>Is my data secure?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>Yes! On the free tier, all processing happens in your browser - your files never leave your device. Paid plans use encrypted cloud storage with enterprise-grade security.</p>
					</div>
				</div>

				<!-- FAQ Item 3 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>What file size limits apply?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>Free: 5MB, Pro: 50MB, Business: 250MB, Enterprise: 2GB. See the <a href="/pricing">pricing page</a> for all limits.</p>
					</div>
				</div>

				<!-- FAQ Item 4 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>How do quotas work?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>Quotas reset monthly based on your subscription start date (not calendar month). We track both rows analyzed (upload) and rows processed (export) separately.</p>
					</div>
				</div>

				<!-- FAQ Item 5 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>Can I cancel anytime?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>Yes! You can cancel from your profile page. Your access continues until the end of your billing period. No refunds for partial months, but you can export your data anytime.</p>
					</div>
				</div>

				<!-- FAQ Item 6 -->
				<div class="faq-item">
					<button class="faq-question">
						<span>Do you offer a free trial?</span>
						<svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					<div class="faq-answer">
						<p>The free tier is free forever with basic functionality. Paid plans include a 14-day free trial so you can test premium features risk-free.</p>
					</div>
				</div>
			</div>

			<!-- Contact Support -->
			<div class="support-grid">
				<div class="support-card">
					<h3>Contact Support</h3>
					<p>
						Can't find what you're looking for? Our support team is here to help.
					</p>
					<div class="contact-links">
						<a href="mailto:support@csvmapper.com" class="contact-link">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							<span>support@csvmapper.com</span>
						</a>
						<div class="contact-info">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Response time: Within 24 hours</span>
						</div>
					</div>
				</div>

				<div class="support-card">
					<h3>Report a Bug</h3>
					<p>
						Found an issue? Let us know so we can fix it.
					</p>
					<div class="contact-links">
						<a href="mailto:bugs@csvmapper.com" class="contact-link">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<span>bugs@csvmapper.com</span>
						</a>
						<p class="contact-note">
							Please include: Browser, file type, and steps to reproduce
						</p>
					</div>
				</div>
			</div>

			<!-- Feature Requests -->
			<section class="cta-section">
				<h2 class="cta-title">Have a Feature Request?</h2>
				<p class="cta-text">
					We're always improving CSV Column Mapper. Tell us what would help you work better.
				</p>
				<a href="mailto:features@csvmapper.com" class="btn-primary">Submit Feature Request</a>
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
		max-width: 1000px;
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
		max-width: 1000px;
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

	/* Search Card */
	.search-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 3rem;
	}

	.search-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--color-text-primary);
	}

	.search-input-wrapper {
		position: relative;
	}

	.search-input-large {
		width: 100%;
		padding: 1rem 1rem 1rem 3rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 1.125rem;
		transition: border-color 150ms;
	}

	.search-input-large:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1.5rem;
		height: 1.5rem;
		color: var(--color-text-secondary);
		pointer-events: none;
	}

	/* Quick Links Grid */
	.quick-links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.quick-link-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		transition: all 150ms;
		display: block;
	}

	.quick-link-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.quick-link-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.quick-link-card.quick-link-blue .quick-link-icon {
		background-color: rgba(59, 130, 246, 0.15);
	}

	.quick-link-card.quick-link-blue .quick-link-icon svg {
		color: var(--color-accent);
	}

	.quick-link-card.quick-link-green .quick-link-icon {
		background-color: rgba(16, 185, 129, 0.15);
	}

	.quick-link-card.quick-link-green .quick-link-icon svg {
		color: #10b981;
	}

	.quick-link-card.quick-link-purple .quick-link-icon {
		background-color: rgba(139, 92, 246, 0.15);
	}

	.quick-link-card.quick-link-purple .quick-link-icon svg {
		color: #8b5cf6;
	}

	.quick-link-icon svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.quick-link-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
	}

	.quick-link-card p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	/* Section Title */
	.section-title-large {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 2rem;
		color: var(--color-text-primary);
	}

	/* FAQ List */
	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 4rem;
	}

	.faq-item {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		overflow: hidden;
	}

	.faq-question {
		width: 100%;
		padding: 1rem 1.5rem;
		text-align: left;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		color: var(--color-text-primary);
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 150ms;
	}

	.faq-question:hover {
		background-color: var(--color-bg-tertiary);
	}

	.faq-question span {
		flex: 1;
	}

	.faq-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.faq-answer {
		padding: 0 1.5rem 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.faq-answer p {
		margin: 0;
	}

	.faq-answer a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	/* Support Grid */
	.support-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.support-card {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 2rem;
	}

	.support-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.support-card > p {
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.contact-links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.contact-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 150ms;
	}

	.contact-link:hover {
		color: var(--color-accent);
	}

	.contact-link svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.contact-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-text-secondary);
	}

	.contact-info svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.contact-note {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin: 0;
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

	.btn-primary {
		padding: 0.875rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		text-decoration: none;
		transition: all 150ms;
		background-color: white;
		color: var(--color-accent);
		display: inline-block;
	}

	.btn-primary:hover {
		background-color: #f9fafb;
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

		.search-title {
			font-size: 1.25rem;
		}

		.section-title-large {
			font-size: 1.5rem;
		}

		.quick-links-grid {
			grid-template-columns: 1fr;
		}

		.support-grid {
			grid-template-columns: 1fr;
		}

		.cta-title {
			font-size: 1.5rem;
		}
	}
</style>
