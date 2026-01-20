<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let userProfile = $state(null);
	let analytics = $state(null);
	let loading = $state(true);

	onMount(async () => {
		await loadAnalytics();
	});

	async function loadAnalytics() {
		loading = true;
		try {
			// Get user profile
			const profileRes = await fetch('/api/user/profile');
			if (profileRes.ok) {
				const profileData = await profileRes.json();
				userProfile = profileData.profile;
			}

			// Get analytics data
			const analyticsRes = await fetch('/api/analytics');
			if (analyticsRes.ok) {
				const analyticsData = await analyticsRes.json();
				analytics = analyticsData;
			}
		} catch (error) {
			console.error('Failed to load analytics:', error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Analytics - CSV Column Mapper</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/dashboard" class="text-blue-600 hover:text-blue-700 transition">
					← Back to Dashboard
				</a>
				<h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
				<div class="w-32"></div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="text-center py-12">
				<div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
				<p class="text-gray-600">Loading analytics...</p>
			</div>
		{:else}
			<!-- Overview Stats -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Mappings</p>
							<p class="text-3xl font-bold text-gray-900 mt-1">{analytics?.totalMappings || 0}</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Files Processed</p>
							<p class="text-3xl font-bold text-gray-900 mt-1">{analytics?.filesProcessed || 0}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Templates Used</p>
							<p class="text-3xl font-bold text-gray-900 mt-1">{analytics?.templatesUsed || 0}</p>
						</div>
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Time Saved</p>
							<p class="text-3xl font-bold text-gray-900 mt-1">{analytics?.timeSaved || 0}h</p>
						</div>
						<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Usage Charts -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<!-- Recent Activity -->
				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Mappings</h2>
					{#if analytics?.recentMappings && analytics.recentMappings.length > 0}
						<div class="space-y-3">
							{#each analytics.recentMappings.slice(0, 5) as mapping}
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div>
										<p class="font-medium text-gray-900">{mapping.name}</p>
										<p class="text-sm text-gray-600">
											{new Date(mapping.created_at).toLocaleDateString()}
										</p>
									</div>
									<span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
										{mapping.is_template ? 'Template' : 'Custom'}
									</span>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500 text-center py-8">No mappings yet. Start by creating your first one!</p>
					{/if}
				</div>

				<!-- Popular Categories -->
				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-700">E-commerce</span>
							<div class="flex items-center gap-2">
								<div class="w-32 bg-gray-200 rounded-full h-2">
									<div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
								</div>
								<span class="text-sm text-gray-600">45%</span>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">Accounting</span>
							<div class="flex items-center gap-2">
								<div class="w-32 bg-gray-200 rounded-full h-2">
									<div class="bg-green-600 h-2 rounded-full" style="width: 30%"></div>
								</div>
								<span class="text-sm text-gray-600">30%</span>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">CRM</span>
							<div class="flex items-center gap-2">
								<div class="w-32 bg-gray-200 rounded-full h-2">
									<div class="bg-purple-600 h-2 rounded-full" style="width: 15%"></div>
								</div>
								<span class="text-sm text-gray-600">15%</span>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">Data Migration</span>
							<div class="flex items-center gap-2">
								<div class="w-32 bg-gray-200 rounded-full h-2">
									<div class="bg-yellow-600 h-2 rounded-full" style="width: 10%"></div>
								</div>
								<span class="text-sm text-gray-600">10%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Account Status -->
			<div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-xl font-bold mb-1">Current Plan: <span class="capitalize">{userProfile?.subscription_tier || 'Free'}</span></h2>
						<p class="text-blue-100">
							{userProfile?.subscription_tier === 'free'
								? 'Upgrade to Pro for cloud sync, templates, and more!'
								: 'You have access to all premium features'}
						</p>
					</div>
					<div>
						{#if userProfile?.subscription_tier === 'free'}
							<a
								href="/pricing"
								class="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition inline-block"
							>
								Upgrade Now
							</a>
						{:else}
							<a
								href="/profile"
								class="bg-white/20 backdrop-blur hover:bg-white/30 font-semibold py-2 px-6 rounded-lg transition inline-block"
							>
								Manage Plan
							</a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Tips -->
			<div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
				<div class="flex items-start gap-3">
					<svg class="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="font-semibold text-yellow-800 mb-1">Pro Tips</h3>
						<ul class="text-sm text-yellow-700 space-y-1">
							<li>• Save frequently used mappings as templates to reuse them later</li>
							<li>• Use keyboard shortcuts (press ? in the app to see all shortcuts)</li>
							<li>• Enable cloud sync to access your mappings from any device</li>
							<li>• Check out our template library for common use cases</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
