<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Terms of Service - CSV Column Mapper</title>
	<meta name="description" content="Terms of Service for CSV Column Mapper" />
</svelte:head>

<div class="page-container">

	<main class="main-content">
		<div class="content-container">
			<!-- Hero Section -->
			<section class="hero-section">
				<h1 class="page-title">Terms of Service</h1>
				<p class="page-subtitle">Last updated: January 2025</p>
			</section>

			<!-- Main Content Card -->
			<section class="content-section">
				<div class="card">
				<h2 class="section-title">1. Acceptance of Terms</h2>
				<p class="section-text">
					By accessing and using CSV Column Mapper ("the Service"), you agree to be bound by these
					Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the
					Service.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">2. Description of Service</h2>
				<p class="section-text">
					CSV Column Mapper is a software-as-a-service platform that enables users to transform,
					map, and process CSV data files. Our Service includes:
				</p>
				<ul class="styled-list">
					<li>Client-side and server-side CSV file processing</li>
					<li>Column mapping and transformation tools</li>
					<li>Cloud storage for saved mappings (paid plans)</li>
					<li>API access (paid plans)</li>
					<li>Template library (paid plans)</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">3. User Accounts and Registration</h2>
				<p class="section-text">
					To use certain features of the Service, you must register for an account. You agree to:
				</p>
				<ul class="styled-list">
					<li>Provide accurate, current, and complete information</li>
					<li>Maintain and update your account information</li>
					<li>Keep your password secure and confidential</li>
					<li>Accept responsibility for all activities under your account</li>
					<li>Notify us immediately of any unauthorized use</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">4. Subscription Plans and Payments</h2>
				<p class="section-text">
					We offer both free and paid subscription plans. Paid plans are billed monthly or
					annually as selected during checkout.
				</p>
				<h3 class="subsection-title">4.1 Free Plan</h3>
				<p class="section-text">
					The Free plan includes basic features with usage limitations. No credit card required.
				</p>

				<h3 class="subsection-title">4.2 Paid Plans</h3>
				<p class="section-text">
					Paid plans (Pro, Business, Enterprise) offer increased quotas and premium features.
				</p>
				<ul class="styled-list">
					<li>Subscription fees are charged in advance</li>
					<li>You can cancel anytime from your account settings</li>
					<li>Cancellations take effect at the end of the billing period</li>
					<li>No refunds for partial months or unused portions</li>
				</ul>

				<h3 class="subsection-title">4.3 Quotas and Usage Limits</h3>
				<p class="section-text">
					Each plan has specific usage limits (rows processed, file size, saved mappings). If
					you exceed your quota, you must upgrade to a higher tier or wait for your monthly
					reset.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">5. Acceptable Use Policy</h2>
				<p class="section-text">
					You agree not to use the Service to:
				</p>
				<ul class="styled-list">
					<li>Process illegal, harmful, or offensive content</li>
					<li>Violate any laws or regulations</li>
					<li>Infringe on intellectual property rights</li>
					<li>Transmit viruses or malicious code</li>
					<li>Attempt to gain unauthorized access</li>
					<li>Reverse engineer or modify the Service</li>
					<li>Use automated scripts to abuse the Service</li>
				</ul>
				<p class="section-text">
					We reserve the right to suspend or terminate accounts that violate these terms.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">6. Data Privacy and Security</h2>
				<p class="section-text">
					Your privacy is important to us:
				</p>
				<ul class="styled-list">
					<li>All data is encrypted in transit and at rest</li>
					<li>We do not sell your personal data</li>
					<li>You can delete your data and account at any time</li>
					<li>See our <a href="/privacy" class="link">Privacy Policy</a> for details</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">7. Intellectual Property</h2>
				<p class="section-text">
					The Service and its original content, features, and functionality are owned by CSV
					Column Mapper and are protected by international copyright, trademark, and other
					intellectual property laws.
				</p>
				<p class="section-text">
					You retain ownership of any data you upload to the Service. By uploading data, you
					grant us a license to process and store it solely to provide the Service to you.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">8. Service Availability and Modifications</h2>
				<p class="section-text">
					We strive for 99.9% uptime but do not guarantee uninterrupted access. We reserve the
					right to modify, suspend, or discontinue the Service at any time with or without
					notice.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">9. Limitation of Liability</h2>
				<p class="section-text">
					To the maximum extent permitted by law, CSV Column Mapper shall not be liable for any
					indirect, incidental, special, consequential, or punitive damages, including without
					limitation, loss of profits, data, use, goodwill, or other intangible losses.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">10. Termination</h2>
				<p class="section-text">
					We may terminate or suspend your account at any time for violation of these Terms or
					any other reason at our sole discretion. Upon termination, your right to use the
					Service will immediately cease.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">11. Governing Law</h2>
				<p class="section-text">
					These Terms shall be governed by and construed in accordance with the laws of the
					jurisdiction in which CSV Column Mapper is registered.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">12. Changes to Terms</h2>
				<p class="section-text">
					We reserve the right to modify these Terms at any time. We will notify users of
					significant changes via email or through the Service. Your continued use after changes
					constitutes acceptance.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">13. Contact Us</h2>
				<p class="section-text">
					If you have questions about these Terms, please contact us at:
					<a href="mailto:legal@csvmapper.com" class="link">legal@csvmapper.com</a>
				</p>
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
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.page-subtitle {
		font-size: 1rem;
		color: var(--color-text-secondary);
	}

	/* Content Sections */
	.content-section {
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
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text-primary);
	}

	.subsection-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-primary);
	}

	.section-text {
		font-size: 1rem;
		line-height: 1.75;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
	}

	.section-text strong {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.styled-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0;
	}

	.styled-list li {
		padding: 0.5rem 0 0.5rem 1.5rem;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		position: relative;
	}

	.styled-list li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.2rem;
	}

	.link {
		color: var(--color-accent);
		text-decoration: none;
		font-weight: 500;
	}

	.link:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.section-title {
			font-size: 1.25rem;
		}

		.card {
			padding: 1.5rem;
		}
	}
</style>
