<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let fullName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let agreeToTerms = $state(false);
	let loading = $state(false);
	let message = $state('');
	let messageType: 'success' | 'error' = $state('success');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	async function handleSignup() {
		// Validation
		if (!fullName || !email || !password) {
			message = 'Please fill in all required fields';
			messageType = 'error';
			return;
		}

		if (password !== confirmPassword) {
			message = 'Passwords do not match';
			messageType = 'error';
			return;
		}

		if (!agreeToTerms) {
			message = 'Please agree to the Terms of Service';
			messageType = 'error';
			return;
		}

		loading = true;
		message = '';

		try {
			// Use authStore for signup
			const result = await authStore.signUp(email, password, fullName);

			if (result.success) {
				message = 'Account created! Please check your email to verify your account.';
				messageType = 'success';
				// Clear form
				fullName = '';
				email = '';
				password = '';
				confirmPassword = '';
				agreeToTerms = false;
			} else {
				message = result.error || 'Failed to create account';
				messageType = 'error';
			}
		} catch (error) {
			message = 'Network error. Please check your connection and try again.';
			messageType = 'error';
		} finally {
			loading = false;
		}
	}

	function checkPasswordMatch() {
		if (confirmPassword && password !== confirmPassword) {
			return false;
		}
		return true;
	}

	function getPasswordStrength() {
		if (!password) return 0;

		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.length >= 12) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;

		return strength;
	}

	let passwordStrength = $derived(getPasswordStrength());
	let passwordsMatch = $derived(checkPasswordMatch());
</script>

<svelte:head>
	<title>Sign Up - CSV Column Mapper</title>
	<meta name="description" content="Create an account to start using CSV Column Mapper" />
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
				<h1 class="auth-title">Create your account</h1>
				<p class="auth-subtitle">Start transforming your CSV files today</p>
			</div>

			<!-- Signup Form -->
			<form onsubmit={handleSignup} class="auth-form">
				<div class="form-group">
					<label for="fullName" class="form-label">
						Full name <span class="required">*</span>
					</label>
					<input
						id="fullName"
						type="text"
						bind:value={fullName}
						placeholder="John Doe"
						required
						disabled={loading}
						class="form-input"
					/>
				</div>

				<div class="form-group">
					<label for="email" class="form-label">
						Email address <span class="required">*</span>
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

				<div class="form-group">
					<label for="password" class="form-label">
						Password <span class="required">*</span>
					</label>
					<div class="password-input-wrapper">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="Create a strong password"
							required
							disabled={loading}
							class="form-input"
							minlength="8"
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
					{#if password}
						<div class="password-strength">
							<div class="strength-bar">
								<div
									class="strength-fill {passwordStrength <= 2 ? 'weak' : passwordStrength <= 4 ? 'medium' : 'strong'}"
									style="width: {(passwordStrength / 6) * 100}%;"
								></div>
							</div>
							<span class="strength-text">
								{passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}
							</span>
						</div>
					{/if}
				</div>

				<div class="form-group">
					<label for="confirmPassword" class="form-label">
						Confirm password <span class="required">*</span>
					</label>
					<div class="password-input-wrapper">
						<input
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							placeholder="Confirm your password"
							required
							disabled={loading}
							class="form-input"
							class:invalid={!passwordsMatch && confirmPassword}
						/>
						<button
							type="button"
							class="password-toggle"
							onclick={() => showConfirmPassword = !showConfirmPassword}
							aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
						>
							{#if showConfirmPassword}
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
					{#if confirmPassword && !passwordsMatch}
						<p class="error-text">Passwords do not match</p>
					{/if}
				</div>

				<div class="form-group checkbox-group">
					<label class="checkbox-label">
						<input
							type="checkbox"
							bind:checked={agreeToTerms}
							disabled={loading}
							class="checkbox-input"
						/>
						<span class="checkbox-text">
							I agree to the <a href="/terms" target="_blank" class="link">Terms of Service</a>
							and <a href="/privacy" target="_blank" class="link">Privacy Policy</a>
						</span>
					</label>
				</div>

				<button
					type="submit"
					disabled={loading || !fullName || !email || !password || !passwordsMatch || !agreeToTerms}
					class="btn-submit"
				>
					{#if loading}
						<svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
							<circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
							<path class="spinner-path" d="M4 12a8 8 0 0 1 8-8v8H4z" fill="currentColor"></path>
						</svg>
						<span>Creating account...</span>
					{:else}
						<span>Create Account</span>
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
				<span class="divider-text">Already have an account?</span>
				<div class="divider-line"></div>
			</div>

			<!-- Sign In Link -->
			<a href="/auth" class="signup-link">
				Sign in instead
			</a>
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

	.required {
		color: #ef4444;
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

	.form-input.invalid {
		border-color: #ef4444;
	}

	.form-input.invalid:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.form-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.error-text {
		font-size: 0.8125rem;
		color: #ef4444;
		margin: 0;
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

	/* Password Strength */
	.password-strength {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.strength-bar {
		flex: 1;
		height: 4px;
		background-color: var(--color-bg-tertiary);
		border-radius: 2px;
		overflow: hidden;
	}

	.strength-fill {
		height: 100%;
		transition: all 0.3s ease;
	}

	.strength-fill.weak {
		background-color: #ef4444;
	}

	.strength-fill.medium {
		background-color: #f59e0b;
	}

	.strength-fill.strong {
		background-color: #10b981;
	}

	.strength-text {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	/* Checkbox */
	.checkbox-group {
		flex-direction: row;
		align-items: flex-start;
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-input {
		width: 18px;
		height: 18px;
		margin-top: 0.125rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.checkbox-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.link {
		color: var(--color-accent);
		text-decoration: none;
		font-weight: 500;
	}

	.link:hover {
		text-decoration: underline;
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
