<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		getAllPlans,
		getPlan,
		getPlanDisplayInfo,
		isUnlimited,
		type PlanId
	} from '$lib/config/plans';

	let userProfile = $state<any>(null);
	let quotaStatus = $state<any>(null);
	let loading = $state(true);
	let saving = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');
	let yearlyBilling = $state(false);

	// Form fields
	let fullName = $state('');
	let subscriptionTier = $state<PlanId>('free');

	onMount(async () => {
		await loadProfile();
		await loadQuotaStatus();
	});

	async function loadProfile() {
		try {
			// Get session
			const { data: sessionData } = await fetch('/api/auth/session')
				.then((res) => res.json())
				.catch(() => ({ session: null }));

			if (!sessionData?.session) {
				goto('/auth');
				return;
			}

			// Get profile
			const response = await fetch('/api/user/profile');
			if (response.ok) {
				const data = await response.json();
				userProfile = data.profile;
				fullName = data.profile?.full_name || '';
				subscriptionTier = (data.profile?.subscription_tier || 'free') as PlanId;
			}
		} catch (error) {
			console.error('Error loading profile:', error);
		}
	}

	async function loadQuotaStatus() {
		try {
			const response = await fetch('/api/user/quota');
			if (response.ok) {
				const data = await response.json();
				quotaStatus = data;
			}
		} catch (error) {
			console.error('Error loading quota status:', error);
		} finally {
			loading = false;
		}
	}

	async function saveProfile(event: Event) {
		event.preventDefault();
		saving = true;
		message = '';

		try {
			const response = await fetch('/api/user/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ full_name: fullName })
			});

			if (response.ok) {
				message = 'Profile updated successfully!';
				messageType = 'success';
				await loadProfile();
			} else {
				const data = await response.json();
				message = data.error || 'Failed to update profile';
				messageType = 'error';
			}
		} catch (error) {
			message = 'Network error. Please try again.';
			messageType = 'error';
		} finally {
			saving = false;
		}
	}

	async function changePlan(newPlanId: PlanId) {
		if (newPlanId === 'lifetime') {
			alert('Lifetime access: Contact us at sales@csvmapper.com');
			return;
		}

		if (newPlanId === subscriptionTier) {
			return; // Already on this plan
		}

		// Redirect to pricing to checkout
		window.location.href = `/pricing?upgrade=${newPlanId}`;
	}

	async function manageSubscription() {
		try {
			const response = await fetch('/api/stripe/portal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					returnUrl: `${window.location.origin}/profile`
				})
			});

			const data = await response.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				alert('Unable to open customer portal. Please contact support.');
			}
		} catch (error) {
			console.error('Error opening portal:', error);
			alert('Something went wrong. Please try again.');
		}
	}

	async function deleteAccount() {
		if (
			!confirm(
				'Are you sure you want to delete your account? This action cannot be undone.\n\nAll your data will be permanently deleted.'
			)
		) {
			return;
		}

		if (
			!confirm(
				'This is your last chance! Your account and all data will be permanently deleted. Are you absolutely sure?'
			)
		) {
			return;
		}

		try {
			const response = await fetch('/api/user/account', {
				method: 'DELETE'
			});

			if (response.ok) {
				alert('Account deleted successfully.');
				window.location.href = '/';
			} else {
				const data = await response.json();
				alert(data.error || 'Failed to delete account');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
			alert('Something went wrong. Please try again.');
		}
	}

	function getUsagePercentage(current: number, limit: number): number {
		if (isUnlimited(limit) || limit === 0) return 0;
		return Math.min((current / limit) * 100, 100);
	}

	function getUsageColor(percentage: number): string {
		if (percentage >= 90) return 'bg-red-500';
		if (percentage >= 70) return 'bg-yellow-500';
		return 'bg-blue-500';
	}

	function getPlanPrice(plan: any): string {
		if (plan.priceMonthly === null) return 'Contact Sales';
		const price = yearlyBilling && plan.priceYearly ? plan.priceYearly : plan.priceMonthly;
		return price === 0 ? 'Free' : `$${price}`;
	}

	const currentPlan = getPlan(subscriptionTier);
	const allPlans = getAllPlans();
</script>

<svelte:head>
	<title>Profile Settings - CSV Column Mapper</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<a
					href="/dashboard"
					class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
				>
					← Back to Dashboard
				</a>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
				<div class="w-32"></div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="text-center py-12">
				<div
					class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
				></div>
				<p class="text-gray-600 dark:text-gray-400">Loading profile...</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Left Column: Profile Info -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Profile Information -->
					<div
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
					>
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Profile Information
						</h2>

						<form onsubmit={saveProfile} class="space-y-4">
							<!-- Email (read-only) -->
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
									>Email</label
								>
								<input
									type="email"
									value={userProfile?.email || ''}
									disabled
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
								/>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
									Email cannot be changed
								</p>
							</div>

							<!-- Full Name -->
							<div>
								<label
									for="fullName"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Full Name
								</label>
								<input
									id="fullName"
									type="text"
									bind:value={fullName}
									placeholder="Enter your full name"
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-gray-700 dark:text-white"
								/>
							</div>

							<!-- Save Button -->
							<div class="flex justify-end">
								<button
									type="submit"
									disabled={saving}
									class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition disabled:cursor-not-allowed"
								>
									{saving ? 'Saving...' : 'Save Changes'}
								</button>
							</div>
						</form>

						<!-- Message -->
						{#if message}
							<div
								class="mt-4 p-4 rounded-lg {messageType === 'success'
									? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
									: 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}"
							>
								<p class="text-sm">{message}</p>
							</div>
						{/if}
					</div>

					<!-- Usage Dashboard -->
					{#if quotaStatus}
						<div
							class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
						>
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
								Usage Dashboard
							</h2>

							<div class="space-y-6">
								<!-- Rows Analyzed -->
								<div>
									<div class="flex justify-between items-center mb-2">
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											Rows Analyzed This Month
										</span>
										<span class="text-sm text-gray-600 dark:text-gray-400">
											{quotaStatus.rowsAnalyzedCurrent?.toLocaleString() ||
												0} / {quotaStatus.rowsAnalyzedLimit === 0
												? 'Unlimited'
												: quotaStatus.rowsAnalyzedLimit?.toLocaleString() ||
													'0'}
										</span>
									</div>
									{#if quotaStatus.rowsAnalyzedLimit !== 0}
										<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
											<div
												class="h-2.5 rounded-full transition-all duration-300 {getUsageColor(
													getUsagePercentage(
														quotaStatus.rowsAnalyzedCurrent || 0,
														quotaStatus.rowsAnalyzedLimit || 0
													)
												)}"
												style="width: {getUsagePercentage(
													quotaStatus.rowsAnalyzedCurrent || 0,
													quotaStatus.rowsAnalyzedLimit || 0
												)}%"
											></div>
										</div>
									{:else}
										<div class="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2.5">
											<div class="h-2.5 rounded-full bg-green-500 w-full"></div>
										</div>
									{/if}
								</div>

								<!-- Rows Processed -->
								<div>
									<div class="flex justify-between items-center mb-2">
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											Rows Processed This Month
										</span>
										<span class="text-sm text-gray-600 dark:text-gray-400">
											{quotaStatus.rowsProcessedCurrent?.toLocaleString() ||
												0} / {quotaStatus.rowsProcessedLimit === 0
												? 'Unlimited'
												: quotaStatus.rowsProcessedLimit?.toLocaleString() ||
													'0'}
										</span>
									</div>
									{#if quotaStatus.rowsProcessedLimit !== 0}
										<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
											<div
												class="h-2.5 rounded-full transition-all duration-300 {getUsageColor(
													getUsagePercentage(
														quotaStatus.rowsProcessedCurrent || 0,
														quotaStatus.rowsProcessedLimit || 0
													)
												)}"
												style="width: {getUsagePercentage(
													quotaStatus.rowsProcessedCurrent || 0,
													quotaStatus.rowsProcessedLimit || 0
												)}%"
											></div>
										</div>
									{:else}
										<div class="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2.5">
											<div class="h-2.5 rounded-full bg-green-500 w-full"></div>
										</div>
									{/if}
								</div>

								<!-- Saved Mappings -->
								<div>
									<div class="flex justify-between items-center mb-2">
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											Saved Mappings
										</span>
										<span class="text-sm text-gray-600 dark:text-gray-400">
											{quotaStatus.savedMappingsCurrent?.toLocaleString() ||
												0} / {quotaStatus.savedMappingsLimit === 0
												? 'Unlimited'
												: quotaStatus.savedMappingsLimit?.toLocaleString() ||
													'0'}
										</span>
									</div>
									{#if quotaStatus.savedMappingsLimit !== 0}
										<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
											<div
												class="h-2.5 rounded-full transition-all duration-300 {getUsageColor(
													getUsagePercentage(
														quotaStatus.savedMappingsCurrent || 0,
														quotaStatus.savedMappingsLimit || 0
													)
												)}"
												style="width: {getUsagePercentage(
													quotaStatus.savedMappingsCurrent || 0,
													quotaStatus.savedMappingsLimit || 0
												)}%"
											></div>
										</div>
									{:else}
										<div class="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2.5">
											<div class="h-2.5 rounded-full bg-green-500 w-full"></div>
										</div>
									{/if}
								</div>

								<!-- Billing Period -->
								{#if quotaStatus.periodStart && quotaStatus.periodEnd}
									<div
										class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
									>
										<p class="text-sm text-blue-800 dark:text-blue-300">
											<strong>Billing Period:</strong> {new Date(
												quotaStatus.periodStart
											).toLocaleDateString()} - {new Date(
												quotaStatus.periodEnd
											).toLocaleDateString()}
										</p>
										<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
											Quotas reset on the {new Date(quotaStatus.periodEnd).getDate()}th of
											each month
										</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Plan Chooser (Compact) -->
					<div
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
					>
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Plan</h2>

						<!-- Billing Toggle -->
						<div class="flex items-center justify-center gap-4 mb-6">
							<span class="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
							<button
								onclick={() => (yearlyBilling = !yearlyBilling)}
								class="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors {yearlyBilling
									? 'bg-blue-600'
									: ''}"
								role="switch"
								aria-checked={yearlyBilling}
							>
								<span
									class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform {yearlyBilling
										? 'translate-x-6'
										: ''}"
								></span>
							</button>
							<span class="text-sm text-gray-600 dark:text-gray-400">
								Yearly <span class="text-green-600 dark:text-green-400 font-semibold">(Save 17%+)</span>
							</span>
						</div>

						<div class="grid grid-cols-2 gap-4">
							{#each allPlans as plan}
								{@const displayInfo = getPlanDisplayInfo(plan)}
								{@const isSelected = plan.id === subscriptionTier}
								<button
									onclick={() => changePlan(plan.id)}
									class="p-4 border-2 rounded-lg text-left transition {isSelected
										? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}"
								>
									<div class="flex items-center justify-between mb-2">
										<h3 class="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
										{#if isSelected}
											<span
												class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full"
												>Current</span
											>
										{/if}
									</div>
									<p class="text-sm font-bold text-gray-900 dark:text-white mb-2">
										{getPlanPrice(plan)}
										{#if plan.priceMonthly !== null && plan.priceMonthly > 0}
											<span class="text-xs font-normal text-gray-600 dark:text-gray-400">
												/{yearlyBilling && plan.priceYearly ? 'year' : 'month'}
											</span>
										{/if}
									</p>
									<div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
										<div>• {displayInfo.rowsPerMonth} rows/mo</div>
										<div>• {displayInfo.savedMappings} mappings</div>
										<div>• {displayInfo.fileSize} file size</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Right Column: Subscription & Actions -->
				<div class="space-y-6">
					<!-- Current Plan Summary -->
					<div
						class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
					>
						<h2 class="text-lg font-semibold mb-2">Current Plan</h2>
						<p class="text-3xl font-bold capitalize mb-2">{currentPlan.name}</p>
						<p class="text-sm text-blue-100 mb-4">{currentPlan.description}</p>

						<div class="space-y-2 mb-4">
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{getPlanDisplayInfo(currentPlan).fileSize} max file size</span>
							</div>
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{getPlanDisplayInfo(currentPlan).rowsPerMonth} rows/month</span>
							</div>
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{getPlanDisplayInfo(currentPlan).savedMappings} saved mappings</span>
							</div>
						</div>

						{#if subscriptionTier !== 'free' && subscriptionTier !== 'lifetime'}
							<button
								onclick={manageSubscription}
								class="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition backdrop-blur-sm"
							>
								Manage Subscription
							</button>
						{/if}
					</div>

					<!-- Support -->
					<div
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
					>
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h2>
						<div class="space-y-3">
							<a
								href="mailto:support@csvmapper.com"
								class="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span class="text-sm">Email Support</span>
							</a>
							<a
								href="/docs"
								class="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								<span class="text-sm">Documentation</span>
							</a>
						</div>
					</div>

					<!-- Danger Zone -->
					<div
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-red-200 dark:border-red-800"
					>
						<h2 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Once you delete your account, there is no going back. Please be certain.
						</p>
						<button
							onclick={deleteAccount}
							class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
