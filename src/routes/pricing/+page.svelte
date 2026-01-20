<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getAllPlans, getPlan, getPlanDisplayInfo, type PlanId } from '$lib/config/plans';

	let yearlyBilling = $state(false);
	let session = $state<{ user?: { subscription_tier?: PlanId } } | null>(null);
	let currentPlanId = $state<PlanId>('free');

	onMount(async () => {
		// Get session
		try {
			const response = await fetch('/api/auth/session');
			const data = await response.json();
			session = data.session;

			// Get current plan tier
			if (session?.user?.subscription_tier) {
				currentPlanId = session.user.subscription_tier;
			}
		} catch (error) {
			console.error('Failed to get session:', error);
		}

		// Check for canceled parameter
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			if (params.get('canceled') === 'true') {
				alert('Checkout was canceled. You can try again anytime!');
			}
		}
	});

	async function subscribe(planId: PlanId) {
		// Lifetime tier shows contact modal
		if (planId === 'lifetime') {
			alert('Lifetime access: Contact us at sales@csvmapper.com');
			return;
		}

		// Not logged in - redirect to auth
		if (!session) {
			window.location.href = '/auth?redirect=/pricing';
			return;
		}

		// Get the plan configuration
		const plan = getPlan(planId);
		const priceId = yearlyBilling ? plan.stripePriceIds?.yearly : plan.stripePriceIds?.monthly;

		if (!priceId) {
			alert('This plan is not available for checkout yet.');
			return;
		}

		try {
			const response = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					priceId,
					successUrl: `${window.location.origin}/dashboard?upgrade=success`,
					cancelUrl: `${window.location.origin}/pricing?canceled=true`
				})
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			} else {
				alert('Failed to create checkout session. Please try again.');
			}
		} catch (error) {
			console.error('Subscribe error:', error);
			alert('Something went wrong. Please try again.');
		}
	}

	function getButtonLabel(planId: PlanId): string {
		// Not logged in
		if (!session) {
			if (planId === 'free') return 'Start Free';
			return `Upgrade to ${getPlan(planId).name}`;
		}

		// Logged in - check current plan
		if (planId === currentPlanId) {
			return 'Current Plan';
		}

		if (planId === 'lifetime') {
			return 'Buy Lifetime';
		}

		return `Upgrade to ${getPlan(planId).name}`;
	}

	function isPlanDisabled(planId: PlanId): boolean {
		// Not logged in - free plan is "Current Plan"
		if (!session && planId === 'free') {
			return true;
		}

		// Logged in - current plan is disabled
		if (session && planId === currentPlanId) {
			return true;
		}

		return false;
	}

	const plans = getAllPlans();

	const featureCategories = {
		integrations: {
			name: 'Integrations',
			features: ['apiAccess', 'webhooks'] as const
		},
		scale: {
			name: 'Scale & Performance',
			features: ['asyncProcessing', 's3Upload', 'priorityProcessing'] as const
		},
		support: {
			name: 'Support & SLA',
			features: ['teamManagement', 'slaSupport'] as const
		}
	};

	function formatFeatureName(feature: string): string {
		const names: Record<string, string> = {
			apiAccess: 'REST API Access',
			webhooks: 'Webhook Integrations',
			asyncProcessing: 'Async Processing',
			s3Upload: 'Direct S3 Upload',
			teamManagement: 'Team Collaboration',
			priorityProcessing: 'Priority Queue',
			slaSupport: 'SLA & Priority Support'
		};
		return names[feature] || feature;
	}
</script>

<svelte:head>
	<title>Pricing - CSV Column Mapper</title>
	<meta name="description" content="Simple, transparent pricing for CSV Column Mapper" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
	<!-- Header -->
	<div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center justify-between">
				<a href="/" class="text-2xl font-bold text-gray-900 dark:text-white">CSV Column Mapper</a>
				<div class="flex gap-4">
					{#if session}
						<a href="/dashboard" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">Dashboard</a>
						<a href="/profile" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">Profile</a>
					{:else}
						<a href="/auth" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">Sign In</a>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Hero Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
		<div class="text-center">
			<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
			<p class="text-xl text-gray-600 dark:text-gray-400 mb-8">Start free, upgrade when you need more</p>

			<!-- Billing Toggle -->
			<div class="flex items-center justify-center gap-4 mb-8">
				<span class="text-gray-600 dark:text-gray-400" class:text-blue-600={!yearlyBilling}>Monthly</span>
				<button
					onclick={() => (yearlyBilling = !yearlyBilling)}
					class="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors {yearlyBilling
						? 'bg-blue-600'
						: ''}"
					role="switch"
					aria-checked={yearlyBilling}
				>
					<span
						class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform {yearlyBilling
							? 'translate-x-6'
							: ''}"
					></span>
				</button>
				<span class="text-gray-600 dark:text-gray-400" class:text-blue-600={yearlyBilling}>
					Yearly <span class="text-green-600 dark:text-green-400 font-semibold">(Save 17%+)</span>
				</span>
			</div>
		</div>
	</div>

	<!-- Pricing Cards -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each plans as plan}
				{@const displayInfo = getPlanDisplayInfo(plan)}
				{@const isCurrentPlan = plan.id === currentPlanId}
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 {isCurrentPlan
						? 'border-blue-500 dark:border-blue-400 relative'
						: 'border-gray-200 dark:border-gray-700'} p-6 flex flex-col"
				>
					{#if isCurrentPlan}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<span class="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
								Current Plan
							</span>
						</div>
					{/if}

					<div class="mb-4">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
						<p class="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
					</div>

					<div class="mb-6">
						<div class="flex items-baseline gap-1">
							{#if plan.priceMonthly === null}
								<span class="text-3xl font-bold text-gray-900 dark:text-white">Contact Sales</span>
							{:else}
								<span class="text-4xl font-bold text-gray-900 dark:text-white">
									{yearlyBilling && plan.priceYearly !== null
										? `$${plan.priceYearly}`
										: plan.priceMonthly === 0
											? 'Free'
											: `$${plan.priceMonthly}`}
								</span>
								{#if plan.priceMonthly > 0}
									<span class="text-gray-600 dark:text-gray-400">
										/{yearlyBilling && plan.priceYearly !== null ? 'year' : 'month'}
									</span>
								{/if}
							{/if}
						</div>
					</div>

					<!-- Numeric Quotas -->
					<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-2">
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-600 dark:text-gray-400">Max file size</span>
							<span class="font-semibold text-gray-900 dark:text-white">{displayInfo.fileSize}</span>
						</div>
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-600 dark:text-gray-400">Rows per file</span>
							<span class="font-semibold text-gray-900 dark:text-white">{displayInfo.rowsPerFile}</span>
						</div>
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-600 dark:text-gray-400">Rows per month</span>
							<span class="font-semibold text-gray-900 dark:text-white">{displayInfo.rowsPerMonth}</span>
						</div>
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-600 dark:text-gray-400">Saved mappings</span>
							<span class="font-semibold text-gray-900 dark:text-white">{displayInfo.savedMappings}</span>
						</div>
					</div>

					<!-- Features by Category -->
					<div class="space-y-4 mb-6 flex-grow">
						{#each Object.values(featureCategories) as category}
							<div>
								<h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
									{category.name}
								</h3>
								<ul class="space-y-2">
									{#each category.features as feature}
										<li class="flex items-start gap-2 text-sm">
											{#if plan.features[feature]}
												<svg
													class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="text-gray-700 dark:text-gray-300">{formatFeatureName(feature)}</span>
											{:else}
												<svg
													class="w-4 h-4 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fill-rule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="text-gray-400 dark:text-gray-600">{formatFeatureName(feature)}</span>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>

					<button
						onclick={() => subscribe(plan.id)}
						disabled={isPlanDisabled(plan.id)}
						class="w-full py-3 px-6 rounded-lg font-semibold transition {isPlanDisabled(plan.id)
							? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
							: isCurrentPlan
								? 'bg-blue-600 dark:bg-blue-500 text-white'
								: 'bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white'}"
					>
						{getButtonLabel(plan.id)}
					</button>
				</div>
			{/each}
		</div>

		<!-- FAQ -->
		<div class="mt-16 max-w-3xl mx-auto">
			<h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
				Frequently Asked Questions
			</h2>

			<div class="space-y-6">
				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">
						How do the monthly quotas work?
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						Your quotas reset monthly based on your subscription start date (not calendar month).
						For example, if you subscribed on the 15th, your quotas will reset on the 15th of each
						month.
					</p>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">What happens if I exceed my quota?</h3>
					<p class="text-gray-600 dark:text-gray-400">
						You'll see a friendly upgrade prompt when you hit a limit. You can upgrade to a higher
						tier to continue processing, or wait until your quota resets on your billing anniversary.
					</p>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Can I change plans anytime?</h3>
					<p class="text-gray-600 dark:text-gray-400">
						Yes! You can upgrade or downgrade from your profile page. Upgrades take effect
						immediately. Downgrades take effect at the end of your billing period.
					</p>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">
						What's the difference between rows analyzed and processed?
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						<strong>Rows analyzed</strong> counts when you upload and preview a file.
						<strong>Rows processed</strong> counts when you export the transformed data. Both quotas
						reset monthly.
					</p>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Do you offer refunds?</h3>
					<p class="text-gray-600 dark:text-gray-400">
						Yes! If you're not satisfied, contact us within 14 days for a full refund, no
						questions asked.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
