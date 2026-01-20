import type { RequestEvent } from '@sveltejs/kit';

export type SubscriptionTier = 'free' | 'pro' | 'business' | 'lifetime';

export interface TierLimits {
	maxMappings: number;
	cloudSync: boolean;
	templates: boolean;
	transformations: boolean;
	validationRules: boolean;
	teamCollaboration: boolean;
	apiAccess: boolean;
	prioritySupport: boolean;
	customBranding: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
	free: {
		maxMappings: Infinity, // Unlimited local mappings
		cloudSync: false,
		templates: false,
		transformations: false,
		validationRules: false,
		teamCollaboration: false,
		apiAccess: false,
		prioritySupport: false,
		customBranding: false
	},
	pro: {
		maxMappings: Infinity,
		cloudSync: true,
		templates: true,
		transformations: true,
		validationRules: true,
		teamCollaboration: false,
		apiAccess: false,
		prioritySupport: true,
		customBranding: false
	},
	business: {
		maxMappings: Infinity,
		cloudSync: true,
		templates: true,
		transformations: true,
		validationRules: true,
		teamCollaboration: true,
		apiAccess: true,
		prioritySupport: true,
		customBranding: true
	},
	lifetime: {
		maxMappings: Infinity,
		cloudSync: true,
		templates: true,
		transformations: true,
		validationRules: true,
		teamCollaboration: false,
		apiAccess: false,
		prioritySupport: true,
		customBranding: false
	}
};

/**
 * Check if user has required tier or higher
 */
export function hasRequiredTier(
	userTier: SubscriptionTier,
	requiredTier: SubscriptionTier
): boolean {
	const tierHierarchy: SubscriptionTier[] = ['free', 'pro', 'business', 'lifetime'];
	const userTierIndex = tierHierarchy.indexOf(userTier);
	const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

	return userTierIndex >= requiredTierIndex;
}

/**
 * Check if user can access a specific feature
 */
export function canAccessFeature(
	userTier: SubscriptionTier,
	feature: keyof TierLimits
): boolean {
	return Boolean(TIER_LIMITS[userTier][feature]);
}

/**
 * Middleware to check user tier
 */
export async function getUserTier(event: RequestEvent): Promise<SubscriptionTier> {
	try {
		const { profile } = await event.locals.safeGetSession();
		return (profile?.subscription_tier as SubscriptionTier) || 'free';
	} catch {
		return 'free';
	}
}

/**
 * Require a specific tier for a route
 */
export async function requireTier(
	event: RequestEvent,
	requiredTier: SubscriptionTier
): Promise<{ allowed: boolean; userTier: SubscriptionTier }> {
	const userTier = await getUserTier(event);
	const allowed = hasRequiredTier(userTier, requiredTier);

	return { allowed, userTier };
}
