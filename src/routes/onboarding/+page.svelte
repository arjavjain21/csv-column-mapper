<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let step = $state(1);
	const totalSteps = 4;

	// Onboarding state
	let userName = $state('');
	let userGoal = $state('');
	let hasUsedSimilarTools = $state('');

	onMount(async () => {
		// Check if user has already completed onboarding
		const response = await fetch('/api/user/profile');
		if (response.ok) {
			const data = await response.json();
			if (data.profile?.onboarding_completed) {
				goto('/dashboard');
			}
		}
	});

	async function skipOnboarding() {
		await markOnboardingComplete();
		goto('/dashboard');
	}

	async function completeOnboarding() {
		await markOnboardingComplete();
		goto('/app?tour=true');
	}

	async function markOnboardingComplete() {
		try {
			await fetch('/api/user/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					onboarding_completed: true,
					onboarding_data: {
						name: userName,
						goal: userGoal,
						experience: hasUsedSimilarTools
					}
				})
			});
		} catch (error) {
			console.error('Failed to save onboarding:', error);
		}
	}

	function nextStep() {
		if (step < totalSteps) {
			step++;
		}
	}

	function prevStep() {
		if (step > 1) {
			step--;
		}
	}
</script>

<svelte:head>
	<title>Welcome - CSV Column Mapper</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
	<div class="w-full max-w-2xl">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
				<span class="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% complete</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-2">
				<div
					class="bg-blue-600 h-2 rounded-full transition-all duration-300"
					style="width: {(step / totalSteps) * 100}%"
				></div>
			</div>
		</div>

		<!-- Step 1: Welcome -->
		{#if step === 1}
			<div class="bg-white rounded-2xl shadow-xl p-8 text-center">
				<div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to CSV Column Mapper! 🎉</h1>
				<p class="text-lg text-gray-600 mb-8">
					Let's get you set up in 60 seconds. We'll personalize your experience based on your
					needs.
				</p>

				<div class="grid grid-cols-2 gap-4 mb-8">
					<div class="bg-blue-50 p-4 rounded-lg">
						<div class="text-2xl mb-2">⚡</div>
						<h3 class="font-semibold text-gray-900">Fast Setup</h3>
						<p class="text-sm text-gray-600">Get started in seconds</p>
					</div>
					<div class="bg-purple-50 p-4 rounded-lg">
						<div class="text-2xl mb-2">🎯</div>
						<h3 class="font-semibold text-gray-900">Personalized</h3>
						<p class="text-sm text-gray-600">Tailored to your needs</p>
					</div>
				</div>

				<div class="flex gap-4">
					<button
						onclick={skipOnboarding}
						class="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						Skip
					</button>
					<button
						onclick={nextStep}
						class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
					>
						Get Started →
					</button>
				</div>
			</div>
		{/if}

		<!-- Step 2: What's your goal? -->
		{#if step === 2}
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">
					What's your primary goal? 🎯
				</h2>
				<p class="text-gray-600 text-center mb-8">
					Select the option that best describes what you're trying to achieve.
				</p>

				<div class="space-y-3">
					<button
						onclick={() => (userGoal = 'ecommerce')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {userGoal === 'ecommerce'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">🛒</div>
							<div>
								<h3 class="font-semibold text-gray-900">E-commerce Import</h3>
								<p class="text-sm text-gray-600">Shopify, WooCommerce, product catalogs</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (userGoal = 'accounting')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {userGoal === 'accounting'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">💰</div>
							<div>
								<h3 class="font-semibold text-gray-900">Accounting/Finance</h3>
								<p class="text-sm text-gray-600">QuickBooks, Xero, transactions, invoices</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (userGoal = 'crm')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {userGoal === 'crm'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">👥</div>
							<div>
								<h3 class="font-semibold text-gray-900">CRM/Sales</h3>
								<p class="text-sm text-gray-600">Salesforce, HubSpot, leads, contacts</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (userGoal = 'data')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {userGoal === 'data'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">🔄</div>
							<div>
								<h3 class="font-semibold text-gray-900">Data Migration</h3>
								<p class="text-sm text-gray-600">Database migration, format conversion</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (userGoal = 'other')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {userGoal === 'other'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">📊</div>
							<div>
								<h3 class="font-semibold text-gray-900">Other</h3>
								<p class="text-sm text-gray-600">General CSV transformation needs</p>
							</div>
						</div>
					</button>
				</div>

				<div class="flex gap-4 mt-8">
					<button
						onclick={prevStep}
						class="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						← Back
					</button>
					<button
						onclick={nextStep}
						disabled={!userGoal}
						class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
					>
						Next →
					</button>
				</div>
			</div>
		{/if}

		<!-- Step 3: Experience level -->
		{#if step === 3}
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">
					Have you used CSV mapping tools before? 💭
				</h2>
				<p class="text-gray-600 text-center mb-8">
					This helps us tailor the tutorial to your experience level.
				</p>

				<div class="space-y-3">
					<button
						onclick={() => (hasUsedSimilarTools = 'beginner')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {hasUsedSimilarTools ===
						'beginner'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">🌱</div>
							<div>
								<h3 class="font-semibold text-gray-900">Complete Beginner</h3>
								<p class="text-sm text-gray-600">Never used data mapping tools before</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (hasUsedSimilarTools = 'intermediate')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {hasUsedSimilarTools ===
						'intermediate'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">🌿</div>
							<div>
								<h3 class="font-semibold text-gray-900">Some Experience</h3>
								<p class="text-sm text-gray-600">Used Excel or similar tools before</p>
							</div>
						</div>
					</button>

					<button
						onclick={() => (hasUsedSimilarTools = 'expert')}
						class="w-full p-4 border-2 rounded-lg text-left transition hover:border-blue-500 {hasUsedSimilarTools === 'expert'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-center gap-3">
							<div class="text-2xl">🌳</div>
							<div>
								<h3 class="font-semibold text-gray-900">Experienced User</h3>
								<p class="text-sm text-gray-600">Regularly work with data transformations</p>
							</div>
						</div>
					</button>
				</div>

				<div class="flex gap-4 mt-8">
					<button
						onclick={prevStep}
						class="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						← Back
					</button>
					<button
						onclick={nextStep}
						disabled={!hasUsedSimilarTools}
						class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
					>
						Next →
					</button>
				</div>
			</div>
		{/if}

		<!-- Step 4: Success & Next Steps -->
		{#if step === 4}
			<div class="bg-white rounded-2xl shadow-xl p-8 text-center">
				<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">You're All Set! 🚀</h1>
				<p class="text-lg text-gray-600 mb-8">
					Based on your goals, we'll recommend relevant templates and features to help you
					work faster.
				</p>

				<div class="bg-blue-50 p-6 rounded-lg mb-8">
					<h3 class="font-semibold text-gray-900 mb-3">What's Next?</h3>
					<div class="text-left space-y-2">
						<div class="flex items-start gap-2">
							<svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm text-gray-700"
								>Take a quick tour of the app with our interactive tutorial</span
							>
						</div>
						<div class="flex items-start gap-2">
							<svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm text-gray-700"
								>Start mapping your first CSV file with guided assistance</span
							>
						</div>
						<div class="flex items-start gap-2">
							<svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm text-gray-700">Explore our template library for {userGoal} use cases</span>
						</div>
					</div>
				</div>

				<div class="flex gap-4">
					<button
						onclick={completeOnboarding}
						class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
					>
						Start Mapping Files →
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
