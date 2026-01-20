<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Privacy Policy - CSV Column Mapper</title>
	<meta name="description" content="Privacy Policy for CSV Column Mapper" />
</svelte:head>

<div class="page-container">

	<main class="main-content">
		<div class="content-container">
			<!-- Hero Section -->
			<section class="hero-section">
				<h1 class="page-title">Privacy Policy</h1>
				<p class="page-subtitle">Last updated: January 2025</p>
			</section>

			<!-- Intro -->
			<div class="card">
				<p class="section-text">
					At CSV Column Mapper, we take your privacy seriously. This Privacy Policy explains
					how we collect, use, disclose, and safeguard your information when you use our
					Service.
				</p>
			</div>

			<!-- Main Content Sections -->
			<div class="card">
				<h2 class="section-title">1. Information We Collect</h2>

				<h3 class="subsection-title">1.1 Account Information</h3>
				<p class="section-text">
					When you create an account, we collect:
				</p>
				<ul class="styled-list">
					<li>Email address</li>
					<li>Name (optional)</li>
					<li>Authentication credentials (stored securely)</li>
					<li>Subscription plan and billing information (via Stripe)</li>
				</ul>

				<h3 class="subsection-title">1.2 Usage Data</h3>
				<p class="section-text">
					We automatically collect information about your use of the Service:
				</p>
				<ul class="styled-list">
					<li>Number of files processed</li>
					<li>Rows analyzed and processed</li>
					<li>Saved mappings count</li>
					<li>Feature usage patterns</li>
					<li>IP address and browser type</li>
				</ul>

				<h3 class="subsection-title">1.3 File Data</h3>
				<p class="section-text">
					<strong>Important:</strong> We do not permanently store your CSV files on our servers
					(unless you explicitly save them as mappings). Files are processed and then deleted
					according to our data retention policy.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">2. How We Use Your Information</h2>
				<p class="section-text">We use your information to:</p>
				<ul class="styled-list">
					<li>Provide, maintain, and improve the Service</li>
					<li>Process your requests and transactions</li>
					<li>Send you technical notices and support messages</li>
					<li>Respond to your comments and questions</li>
					<li>Monitor and analyze usage patterns</li>
					<li>Detect and prevent fraudulent activity</li>
					<li>Comply with legal obligations</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">3. Data Storage and Security</h2>
				<p class="section-text">
					We implement industry-standard security measures:
				</p>
				<ul class="styled-list">
					<li>
						<strong>Encryption:</strong> All data is encrypted in transit (TLS 1.2+) and at
						rest (AES-256)
					</li>
					<li>
						<strong>Authentication:</strong> Secure password hashing and session management
					</li>
					<li>
						<strong>Access Control:</strong> Strict access controls and audit logs
					</li>
					<li>
						<strong>Hosting:</strong> Data stored on secure cloud infrastructure (Supabase/AWS)
					</li>
				</ul>
				<p class="section-text">
					However, no method of transmission over the Internet is 100% secure. While we strive
					to protect your data, we cannot guarantee absolute security.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">4. Data Retention</h2>
				<p class="section-text">
					We retain your data as follows:
				</p>
				<ul class="styled-list">
					<li>
						<strong>CSV Files:</strong> Automatically deleted within 24 hours after processing
					</li>
					<li>
						<strong>Saved Mappings:</strong> Retained until you delete them or close your
						account
					</li>
					<li>
						<strong>Account Data:</strong> Retained until account deletion, subject to legal
						requirements
					</li>
					<li>
						<strong>Usage Logs:</strong> Retained for up to 90 days for analytics and security
					</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">5. Sharing Your Information</h2>
				<p class="section-text">
					We <strong>do not sell</strong> your personal data. We may share your information only
					in the following circumstances:
				</p>
				<ul class="styled-list">
					<li>
						<strong>Service Providers:</strong> With trusted third parties who help operate
						the Service (e.g., Supabase, Stripe, AWS)
					</li>
					<li>
						<strong>Legal Requirements:</strong> If required by law, court order, or government
						request
					</li>
					<li>
						<strong>Business Transfer:</strong> In connection with a merger, acquisition, or
						sale of assets
					</li>
					<li>
						<strong>With Consent:</strong> When you explicitly consent to sharing
					</li>
				</ul>
			</div>

			<div class="card">
				<h2 class="section-title">6. Your Rights and Choices</h2>
				<p class="section-text">
					You have the following rights regarding your data:
				</p>
				<ul class="styled-list">
					<li>
						<strong>Access:</strong> Request a copy of your personal data
					</li>
					<li>
						<strong>Correction:</strong> Update or correct inaccurate data
					</li>
					<li>
						<strong>Deletion:</strong> Request deletion of your data and account
					</li>
					<li>
						<strong>Export:</strong> Export your data in a portable format
					</li>
					<li>
						<strong>Opt-Out:</strong> Unsubscribe from marketing communications
					</li>
				</ul>
				<p class="section-text">
					To exercise these rights, contact us at
					<a href="mailto:privacy@csvmapper.com" class="link">privacy@csvmapper.com</a>
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">7. Cookies and Tracking</h2>
				<p class="section-text">
					We use cookies and similar technologies to:
				</p>
				<ul class="styled-list">
					<li>Keep you logged in</li>
					<li>Remember your preferences</li>
					<li>Analyze usage patterns (anonymized)</li>
					<li>Improve Service performance</li>
				</ul>
				<p class="section-text">
					You can control cookies through your browser settings, but disabling cookies may
					affect Service functionality.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">8. Children's Privacy</h2>
				<p class="section-text">
					The Service is not intended for children under 13. We do not knowingly collect
					personal information from children under 13. If you are a parent or guardian and
					believe your child has provided us with personal information, please contact us.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">9. International Data Transfers</h2>
				<p class="section-text">
					Your information may be transferred to and processed in countries other than your
					own. We ensure appropriate safeguards are in place to protect your data in
					accordance with this Privacy Policy.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">10. Changes to Privacy Policy</h2>
				<p class="section-text">
					We may update this Privacy Policy from time to time. We will notify you of
					significant changes via email or through the Service. Your continued use after changes
					constitutes acceptance.
				</p>
			</div>

			<div class="card">
				<h2 class="section-title">11. Contact Us</h2>
				<p class="section-text">
					If you have questions about this Privacy Policy or our data practices, please
					contact us at:
					<a href="mailto:privacy@csvmapper.com" class="link">privacy@csvmapper.com</a>
				</p>
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


	/* Main Content */
	.main-content {
		flex: 1;
		padding: 3rem 1.5rem;
	}

	.content-container {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 2rem;
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
