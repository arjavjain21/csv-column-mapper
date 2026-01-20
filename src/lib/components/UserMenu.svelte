<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';

	let isOpen = $state(false);

	function getUserInitials(user: User | null): string {
		if (!user) return '?';

		const fullName = user.user_metadata?.full_name;
		if (fullName) {
			const names = fullName.split(' ');
			if (names.length >= 2) {
				return (names[0][0] + names[names.length - 1][0]).toUpperCase();
			}
			return fullName.slice(0, 2).toUpperCase();
		}

		const email = user.email;
		if (email) {
			return email.slice(0, 2).toUpperCase();
		}

		return '?';
	}

	function getUserDisplayName(user: User | null): string {
		if (!user) return 'User';

		const fullName = user.user_metadata?.full_name;
		if (fullName) return fullName.split(' ')[0];

		const email = user.email;
		if (email) return email.split('@')[0];

		return 'User';
	}

	async function handleSignOut() {
		await authStore.signOut();
		isOpen = false;
		goto('/');
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-menu')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onmousedown={handleClickOutside} />

{#if $authStore.user}
	<div class="user-menu">
		<button
			class="user-button"
			onclick={() => isOpen = !isOpen}
			aria-label="User menu"
			aria-expanded={isOpen}
		>
			<div class="avatar">
				<span class="avatar-initials">{getUserInitials($authStore.user)}</span>
			</div>
			<span class="user-name">{getUserDisplayName($authStore.user)}</span>
			<svg class="dropdown-icon" class:rotate={isOpen} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M4 6l4 4l4-4" />
			</svg>
		</button>

		{#if isOpen}
			<div class="dropdown-menu">
				<div class="dropdown-header">
					<div class="user-info">
						<p class="user-email">{$authStore.user.email}</p>
						<p class="user-status">Free Plan</p>
					</div>
				</div>

				<div class="dropdown-divider"></div>

				<div class="dropdown-items">
					<a href="/dashboard" class="dropdown-item" onclick={() => isOpen = false}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="3" width="7" height="7"></rect>
							<rect x="14" y="3" width="7" height="7"></rect>
							<rect x="14" y="14" width="7" height="7"></rect>
							<rect x="3" y="14" width="7" height="7"></rect>
						</svg>
						<span>Dashboard</span>
					</a>

					<a href="/app" class="dropdown-item" onclick={() => isOpen = false}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
							<line x1="16" y1="13" x2="8" y2="13"></line>
							<line x1="16" y1="17" x2="8" y2="17"></line>
						</svg>
						<span>CSV Mapper</span>
					</a>

					<a href="/profile" class="dropdown-item" onclick={() => isOpen = false}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						<span>Profile</span>
					</a>
				</div>

				<div class="dropdown-divider"></div>

				<div class="dropdown-footer">
					<button class="sign-out-btn" onclick={handleSignOut}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
						<span>Sign Out</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<a href="/auth" class="sign-in-btn">Sign In</a>
{/if}

<style>
	.user-menu {
		position: relative;
	}

	.user-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.user-button:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-accent);
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dropdown-icon {
		color: var(--color-text-secondary);
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.dropdown-icon.rotate {
		transform: rotate(180deg);
	}

	/* Dropdown Menu */
	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 280px;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		overflow: hidden;
		animation: slideDown 0.15s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-header {
		padding: 1rem;
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-bg-tertiary);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.user-email {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-status {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		margin: 0;
	}

	.dropdown-divider {
		height: 1px;
		background-color: var(--color-border);
	}

	.dropdown-items {
		padding: 0.5rem 0;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.dropdown-item:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.dropdown-item svg {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
	}

	.dropdown-item:hover svg {
		color: var(--color-accent);
	}

	.dropdown-footer {
		padding: 0.5rem;
		border-top: 1px solid var(--color-border);
		background-color: var(--color-bg-tertiary);
	}

	.sign-out-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		border: none;
		border-radius: 0.375rem;
		background-color: transparent;
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.sign-out-btn:hover {
		background-color: rgba(239, 68, 68, 0.1);
	}

	.sign-out-btn svg {
		flex-shrink: 0;
	}

	/* Sign In Button (when not authenticated) */
	.sign-in-btn {
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.sign-in-btn:hover {
		background-color: var(--color-accent);
		border-color: var(--color-accent);
		color: #ffffff;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.user-name {
			display: none;
		}
	}
</style>
