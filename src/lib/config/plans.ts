/**
 * Plan Configuration
 *
 * Defines all subscription tiers, quotas, and feature flags.
 * This is the single source of truth for plan limits across the application.
 */

export type PlanId = 'free' | 'pro' | 'business' | 'lifetime';

export type FeatureFlag =
	| 'apiAccess'
	| 'webhooks'
	| 'asyncProcessing'
	| 's3Upload'
	| 'teamManagement'
	| 'priorityProcessing'
	| 'slaSupport';

export interface QuotaLimits {
	/** Maximum file size in bytes (0 = unlimited) */
	maxFileSizeBytes: number;

	/** Maximum rows per single file (0 = unlimited) */
	maxRowsPerFile: number;

	/** Maximum rows analyzed per month (upload) (0 = unlimited) */
	maxRowsAnalyzedPerMonth: number;

	/** Maximum rows processed per month (export) (0 = unlimited) */
	maxRowsProcessedPerMonth: number;

	/** Maximum saved mappings (0 = unlimited) */
	maxSavedMappings: number;
}

export interface FeatureFlags {
	/** Access to REST API */
	apiAccess: boolean;

	/** Webhook integrations */
	webhooks: boolean;

	/** Async/background processing */
	asyncProcessing: boolean;

	/** Direct S3 upload for large files */
	s3Upload: boolean;

	/** Team collaboration features */
	teamManagement: boolean;

	/** Priority queue for processing */
	priorityProcessing: boolean;

	/** SLA guarantee and priority support */
	slaSupport: boolean;
}

export interface Plan {
	id: PlanId;
	name: string;
	description: string;
	priceMonthly: number | null; // null for contact sales
	priceYearly: number | null; // null for contact sales
	limits: QuotaLimits;
	features: FeatureFlags;
	stripePriceIds?: {
		monthly?: string;
		yearly?: string;
	};
}

/**
 * Plan definitions
 */
export const PLANS: Record<PlanId, Plan> = {
	free: {
		id: 'free',
		name: 'Free',
		description: 'Perfect for getting started',
		priceMonthly: 0,
		priceYearly: 0,
		limits: {
			maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
			maxRowsPerFile: 1000,
			maxRowsAnalyzedPerMonth: 5000,
			maxRowsProcessedPerMonth: 5000,
			maxSavedMappings: 3
		},
		features: {
			apiAccess: false,
			webhooks: false,
			asyncProcessing: false,
			s3Upload: false,
			teamManagement: false,
			priorityProcessing: false,
			slaSupport: false
		}
	},

	pro: {
		id: 'pro',
		name: 'Pro',
		description: 'For power users and small teams',
		priceMonthly: 29,
		priceYearly: 290,
		limits: {
			maxFileSizeBytes: 50 * 1024 * 1024, // 50 MB
			maxRowsPerFile: 50000,
			maxRowsAnalyzedPerMonth: 100000,
			maxRowsProcessedPerMonth: 100000,
			maxSavedMappings: 50
		},
		features: {
			apiAccess: true,
			webhooks: false,
			asyncProcessing: true,
			s3Upload: false,
			teamManagement: false,
			priorityProcessing: false,
			slaSupport: false
		},
		stripePriceIds: {
			monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
			yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY
		}
	},

	business: {
		id: 'business',
		name: 'Business',
		description: 'For growing teams and businesses',
		priceMonthly: 99,
		priceYearly: 990,
		limits: {
			maxFileSizeBytes: 250 * 1024 * 1024, // 250 MB
			maxRowsPerFile: 250000,
			maxRowsAnalyzedPerMonth: 1000000,
			maxRowsProcessedPerMonth: 1000000,
			maxSavedMappings: 500
		},
		features: {
			apiAccess: true,
			webhooks: true,
			asyncProcessing: true,
			s3Upload: true,
			teamManagement: true,
			priorityProcessing: true,
			slaSupport: false
		},
		stripePriceIds: {
			monthly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY,
			yearly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_YEARLY
		}
	},

	lifetime: {
		id: 'lifetime',
		name: 'Lifetime',
		description: 'One-time payment for lifetime access',
		priceMonthly: null, // Contact sales
		priceYearly: null, // Contact sales
		limits: {
			maxFileSizeBytes: 2 * 1024 * 1024 * 1024, // 2 GB
			maxRowsPerFile: 5000000,
			maxRowsAnalyzedPerMonth: 0, // Unlimited
			maxRowsProcessedPerMonth: 0, // Unlimited
			maxSavedMappings: 0 // Unlimited
		},
		features: {
			apiAccess: true,
			webhooks: true,
			asyncProcessing: true,
			s3Upload: true,
			teamManagement: true,
			priorityProcessing: true,
			slaSupport: true
		}
	}
};

/**
 * Get plan configuration by ID
 */
export function getPlan(planId: PlanId): Plan {
	return PLANS[planId];
}

/**
 * Get all available plans (ordered by tier)
 */
export function getAllPlans(): Plan[] {
	return [PLANS.free, PLANS.pro, PLANS.business, PLANS.lifetime];
}

/**
 * Get upgrade path (next higher tier)
 */
export function getNextPlan(currentPlanId: PlanId): Plan | null {
	const plans = getAllPlans();
	const currentIndex = plans.findIndex((p) => p.id === currentPlanId);
	return plans[currentIndex + 1] || null;
}

/**
 * Check if a quota is unlimited
 */
export function isUnlimited(quotaValue: number): boolean {
	return quotaValue === 0;
}

/**
 * Format quota value for display
 */
export function formatQuotaValue(value: number, isCount: boolean = false): string {
	if (isUnlimited(value)) {
		return 'Unlimited';
	}

	if (isCount) {
		return value.toLocaleString();
	}

	// Format bytes
	if (value < 1024) {
		return `${value} B`;
	} else if (value < 1024 * 1024) {
		return `${(value / 1024).toFixed(1)} KB`;
	} else if (value < 1024 * 1024 * 1024) {
		return `${(value / (1024 * 1024)).toFixed(1)} MB`;
	} else {
		return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	}
}

/**
 * Get plan limits for display
 */
export function getPlanDisplayInfo(plan: Plan) {
	return {
		fileSize: formatQuotaValue(plan.limits.maxFileSizeBytes),
		rowsPerFile: formatQuotaValue(plan.limits.maxRowsPerFile, true),
		rowsPerMonth: formatQuotaValue(plan.limits.maxRowsProcessedPerMonth, true),
		savedMappings: formatQuotaValue(plan.limits.maxSavedMappings, true),
		hasApiAccess: plan.features.apiAccess,
		hasWebhooks: plan.features.webhooks,
		hasAsyncProcessing: plan.features.asyncProcessing,
		hasS3Upload: plan.features.s3Upload,
		hasTeamManagement: plan.features.teamManagement,
		hasPriorityProcessing: plan.features.priorityProcessing,
		hasSlaSupport: plan.features.slaSupport
	};
}

/**
 * Recommended upgrade plan based on limit hit
 */
export function getRecommendedPlanForLimit(limitType: keyof QuotaLimits): PlanId {
	const highVolumeLimits: (keyof QuotaLimits)[] = [
		'maxRowsProcessedPerMonth',
		'maxRowsAnalyzedPerMonth',
		'maxRowsPerFile'
	];

	const teamLimits: (keyof QuotaLimits)[] = ['maxSavedMappings'];

	// For high volume needs, recommend Business or Enterprise
	if (highVolumeLimits.includes(limitType)) {
		return 'business';
	}

	// For team features, recommend Business
	if (teamLimits.includes(limitType)) {
		return 'business';
	}

	// Default to Pro
	return 'pro';
}

/**
 * Error codes for quota violations
 */
export const QUOTA_ERROR_CODES = {
	FILE_SIZE_EXCEEDED: 'QUOTA_FILE_SIZE_EXCEEDED',
	ROWS_PER_FILE_EXCEEDED: 'QUOTA_ROWS_PER_FILE_EXCEEDED',
	MONTHLY_ROWS_ANALYZED_EXCEEDED: 'QUOTA_MONTHLY_ROWS_ANALYZED_EXCEEDED',
	MONTHLY_ROWS_PROCESSED_EXCEEDED: 'QUOTA_MONTHLY_ROWS_PROCESSED_EXCEEDED',
	SAVED_MAPPINGS_EXCEEDED: 'QUOTA_SAVED_MAPPINGS_EXCEEDED',
	FEATURE_NOT_AVAILABLE: 'QUOTA_FEATURE_NOT_AVAILABLE'
} as const;

export type QuotaErrorCode = (typeof QUOTA_ERROR_CODES)[keyof typeof QUOTA_ERROR_CODES];
