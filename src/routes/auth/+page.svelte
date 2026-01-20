<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let email = $state('');
	let loading = $state(false);
	let message = $state('');
	let messageType: 'success' | 'error' = $state('success');
	let authMode: 'magic-link' | 'password' = $state('magic-link');
	let password = $state('');
	let showPassword = $state(false);

	async function handleMagicLink() {
		if (!email) {
			message = 'Please enter your email address';
			messageType = 'error';
			return;
		}

		loading = true;
		message = '';

		try {
			// Use Supabase magic link directly
			const { supabase } = await import('$lib/utils/supabaseClient');
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) {
				message = error.message || 'Something went wrong. Please try again.';
				messageType = 'error';
			} else {
				message = 'Check your email! We sent you a magic link to sign in.';
				messageType = 'success';
			}
		} catch (error) {
			message = 'Network error. Please check your connection and try again.';
			messageType = 'error';
		} finally {
			loading = false;
		}
	}

	async function handlePasswordLogin() {
		if (!email || !password) {
			message = 'Please enter your email and password';
			messageType = 'error';
			return;
		}

		loading = true;
		message = '';

		try {
			// Use authStore for password login
			const result = await authStore.signIn(email, password);

			if (result.success) {
				message = 'Signing you in...';
				messageType = 'success';
				// Redirect will happen automatically via auth state change
				const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
				setTimeout(() => goto(redirectUrl), 500);
			} else {
				message = result.error || 'Invalid email or password';
				messageType = 'error';
			}
		} catch (error) {
			message = 'Network error. Please check your connection and try again.';
			messageType = 'error';
		} finally {
			loading = false;
		}
	}

	function handleSubmit() {
		if (authMode === 'magic-link') {
			handleMagicLink();
		} else {
			handlePasswordLogin();
		}
	}
</script>

<svelte:head>
	<title>Sign In - CSV Column Mapper</title>
	<meta name="description" content="Sign in to CSV Column Mapper to manage your CSV column mappings" />
</svelte:head>

<div class="auth-container">
	<!-- Header with Theme Toggle -->
	<header class="auth-header">
		<a href="/" class="logo-link">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<line x1="16" y1="13" x2="8" y2="13"></line>
				<line x1="16" y1="17" x2="8" y2="17"></line>
				<polyline points="10 9 9 9 8 9"></polyline>
			</svg>
			<span>CSV Mapper</span>
		</a>
		<ThemeToggle />
	</header>

	<!-- Main Content -->
	<main class="auth-main">
		<div class="auth-card">
			<div class="auth-header-content">
				<h1 class="auth-title">Welcome back</h1>
				<p class="auth-subtitle">Sign in to continue to CSV Column Mapper</p>
			</div>

			<!-- Auth Mode Tabs -->
			<div class="auth-tabs">
				<button
					class="auth-tab"
					class:active={authMode === 'magic-link'}
					onclick={() => authMode = 'magic-link'}
				>
					Magic Link
				</button>
				<button
					class="auth-tab"
					class:active={authMode === 'password'}
					onclick={() => authMode = 'password'}
				>
					Password
				</button>
			</div>

			<!-- Auth Form -->
			<form onsubmit={handleSubmit} class="auth-form">
				<div class="form-group">
					<label for="email" class="form-label">
						Email address
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						disabled={loading}
						class="form-input"
					/>
				</div>

				{#if authMode === 'password'}
					<div class="form-group">
						<label for="password" class="form-label">
							Password
						</label>
						<div class="password-input-wrapper">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Enter your password"
								required
								disabled={loading}
								class="form-input"
							/>
							<button
								type="button"
								class="password-toggle"
								onclick={() => showPassword = !showPassword}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
										<line x1="1" y1="1" x2="23" y2="23"></line>
									</svg>
								{:else}
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
										<circle cx="12" cy="12" r="3"></circle>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading || !email || (authMode === 'password' && !password)}
					class="btn-submit"
				>
					{#if loading}
						<svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
							<circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
							<path class="spinner-path" d="M4 12a8 8 0 0 1 8-8v8H4z" fill="currentColor"></path>
						</svg>
						<span>{authMode === 'password' ? 'Signing in...' : 'Sending...'}</span>
					{:else}
						<span>{authMode === 'password' ? 'Sign In' : 'Send Magic Link'}</span>
					{/if}
				</button>
			</form>

			<!-- Message Display -->
			{#if message}
				<div class="message {messageType}">
					<div class="message-content">
						{#if messageType === 'success'}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
								<polyline points="22 4 12 14.01 9 11.01"></polyline>
							</svg>
						{:else}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
						{/if}
						<p>{message}</p>
					</div>
				</div>
			{/if}

			<!-- Divider -->
			<div class="divider">
				<div class="divider-line"></div>
				<span class="divider-text">New to CSV Column Mapper?</span>
				<div class="divider-line"></div>
			</div>

			<!-- Sign Up Link -->
			<a href="/auth/signup" class="signup-link">
				Create an account
			</a>

			{#if authMode === 'magic-link'}
				<!-- Info -->
				<div class="info-box">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="16" x2="12" y2="12"></line>
						<line x1="12" y1="8" x2="12.01" y2="8"></line>
					</svg>
					<div class="info-content">
						<p class="info-title">How magic link works:</p>
						<ol class="info-list">
							<li>Enter your email above</li>
							<li>Check your inbox for a sign-in link</li>
							<li>Click the link to sign in instantly</li>
						</ol>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<!-- Back to Home -->
	<footer class="auth-footer">
		<a href="/" class="back-link">← Back to home</a>
	</footer>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
	}

	/* Header */
	.auth-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background-color: var(--color-bg-secondary);
		border-bottom: 1px solid var(--color-border);
	}

	.logo-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-decoration: none;
		transition: color 150ms;
	}

	.logo-link:hover {
		color: var(--color-accent);
	}

	.logo-link svg {
		color: var(--color-accent);
	}

	/* Main Content */
	.auth-main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
	}

	.auth-card {
		width: 100%;
		max-width: 480px;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 2.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.auth-header-content {
		text-align: center;
		margin-bottom: 2rem;
	}

	.auth-title {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
	}

	.auth-subtitle {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Auth Mode Tabs */
	.auth-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		background-color: var(--color-bg-tertiary);
		padding: 0.25rem;
		border-radius: 0.5rem;
	}

	.auth-tab {
		flex: 1;
		padding: 0.625rem 1rem;
		border: none;
		background-color: transparent;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.15s ease;
	}

	.auth-tab:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-elevated);
	}

	.auth-tab.active {
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-weight: 600;
	}

	/* Form */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.form-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-size: 0.9375rem;
		transition: all 0.15s ease;
	}

	.form-input:hover {
		border-color: var(--color-border-subtle);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-input::placeholder {
		color: var(--color-text-tertiary);
	}

	/* Password Input */
	.password-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.password-input-wrapper .form-input {
		padding-right: 3rem;
	}

	.password-toggle {
		position: absolute;
		right: 0.75rem;
		padding: 0.25rem;
		border: none;
		background: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.15s ease;
		display: flex;
		align-items: center;
	}

	.password-toggle:hover {
		color: var(--color-text-primary);
	}

	/* Submit Button */
	.btn-submit {
		width: 100%;
		padding: 0.875rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-accent);
		color: #ffffff;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.btn-submit:hover:not(:disabled) {
		background-color: var(--color-accent-hover);
		transform: translateY(-1px);
	}

	.btn-submit:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	/* Spinner */
	.spinner {
		animation: spin 1s linear infinite;
	}

	.spinner-track {
		opacity: 0.25;
	}

	.spinner-path {
		opacity: 0.75;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Message Display */
	.message {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		border: 1px solid;
	}

	.message.success {
		background-color: rgba(16, 185, 129, 0.1);
		border-color: rgba(16, 185, 129, 0.2);
	}

	.message.error {
		background-color: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.2);
	}

	.message-content {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.message-content svg {
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.message.success svg {
		color: var(--color-success);
	}

	.message.error svg {
		color: #ef4444;
	}

	.message-content p {
		flex: 1;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	.message.success p {
		color: var(--color-success);
	}

	.message.error p {
		color: #ef4444;
	}

	/* Divider */
	.divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background-color: var(--color-border);
	}

	.divider-text {
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	/* Sign Up Link */
	.signup-link {
		display: block;
		text-align: center;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.signup-link:hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	/* Info Box */
	.info-box {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		margin-top: 1rem;
	}

	.info-box svg {
		flex-shrink: 0;
		color: var(--color-accent);
		margin-top: 0.125rem;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
	}

	.info-list {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.info-list li {
		margin-bottom: 0.25rem;
	}

	/* Footer */
	.auth-footer {
		padding: 1.5rem;
		text-align: center;
	}

	.back-link {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 150ms;
	}

	.back-link:hover {
		color: var(--color-accent);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.auth-card {
			padding: 1.5rem;
		}

		.auth-title {
			font-size: 1.5rem;
		}
	}
</style>
