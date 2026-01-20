<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-grid">
			<div class="footer-brand">
				<h3>CSV Column Mapper</h3>
				<p>Transform your CSV data efficiently and privately.</p>
			</div>
			<div class="footer-links">
				<h4>Product</h4>
				<a href="/app" onclick={(e) => { e.preventDefault(); goto('/app'); }}>Launch App</a>
				<a href="/#features">Features</a>
				<a href="/#pricing">Pricing</a>
				<a href="/#how-it-works">How It Works</a>
			</div>
			<div class="footer-links">
				<h4>Company</h4>
				<a href="/about" onclick={(e) => { e.preventDefault(); goto('/about'); }}>About</a>
				<a href="/privacy" onclick={(e) => { e.preventDefault(); goto('/privacy'); }}>Privacy Policy</a>
				<a href="/terms" onclick={(e) => { e.preventDefault(); goto('/terms'); }}>Terms of Service</a>
			</div>
		</div>
		<div class="footer-bottom">
			<div class="footer-bottom-content">
				<p>&copy; 2026 CSV Column Mapper. All rights reserved.</p>
				<a href="mailto:support@csvmapper.com" class="footer-support-link">Contact Support</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-bg-secondary);
		border-top: 1px solid var(--color-border);
		padding: 4rem 1.5rem 2rem;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 3rem;
		margin-bottom: 3rem;
	}

	.footer-brand h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.5rem;
	}

	.footer-brand p {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		line-height: 1.5;
	}

	.footer-links h4 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-links a {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: color 150ms;
		cursor: pointer;
	}

	.footer-links a:hover {
		color: var(--color-text-secondary);
	}

	.footer-bottom {
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-bottom-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-bottom p {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.footer-support-link {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: color 150ms;
	}

	.footer-support-link:hover {
		color: var(--color-accent);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.footer-bottom-content {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
