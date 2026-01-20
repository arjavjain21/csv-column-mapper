/**
 * Quota Service
 *
 * Server-side service for quota enforcement and usage tracking.
 * Interfaces with Supabase database functions.
 */

import { createClient } from '@supabase/supabase-js';
import { getPlan, isUnlimited, type PlanId, QUOTA_ERROR_CODES, type QuotaErrorCode } from '$lib/config/plans';

function getSupabaseAdmin() {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
	const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl) {
		throw new Error('VITE_SUPABASE_URL environment variable is not set');
	}

	// Use service role key for server-side operations (bypasses RLS)
	return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

export interface UsageMetrics {
	rowsAnalyzed: number;
	rowsProcessed: number;
	filesAnalyzed: number;
	filesProcessed: number;
}

export interface QuotaStatus {
	planTier: PlanId;
	limits: {
		maxFileSizeBytes: number;
		maxRowsPerFile: number;
		maxRowsAnalyzedPerMonth: number;
		maxRowsProcessedPerMonth: number;
		maxSavedMappings: number;
	};
	current: {
		rowsAnalyzed: number;
		rowsProcessed: number;
		savedMappings: number;
	};
	remaining: {
		rowsAnalyzed: number | null; // null = unlimited
		rowsProcessed: number | null; // null = unlimited
		savedMappings: number | null; // null = unlimited
	};
	period: {
		start: Date;
		end: Date;
	};
}

export interface QuotaCheckResult {
	allowed: boolean;
	errorCode?: QuotaErrorCode;
	currentUsage?: number;
	limit?: number;
	remaining?: number;
}

export type RecordType = 'file_analyzed' | 'file_processed' | 'mapping_created' | 'mapping_deleted';

/**
 * Get user's current quota status
 */
export async function getUserQuotaStatus(userId: string): Promise<QuotaStatus> {
	const supabaseAdmin = getSupabaseAdmin();
	const { data, error } = await supabaseAdmin.rpc('get_user_quota_status', {
		p_user_id: userId
	});

	if (error) {
		console.error('Error fetching quota status:', error);
		throw new Error('Failed to fetch quota status');
	}

	const status = data[0];
	const plan = getPlan(status.plan_tier);

	return {
		planTier: status.plan_tier,
		limits: {
			maxFileSizeBytes: status.file_size_limit,
			maxRowsPerFile: status.rows_per_file_limit,
			maxRowsAnalyzedPerMonth: status.rows_analyzed_per_month_limit,
			maxRowsProcessedPerMonth: status.rows_processed_per_month_limit,
			maxSavedMappings: status.saved_mappings_limit
		},
		current: {
			rowsAnalyzed: status.rows_analyzed_current,
			rowsProcessed: status.rows_processed_current,
			savedMappings: status.saved_mappings_current
		},
		remaining: {
			rowsAnalyzed: status.rows_analyzed_remaining,
			rowsProcessed: status.rows_processed_remaining,
			savedMappings: status.saved_mappings_remaining
		},
		period: {
			start: new Date(status.period_start),
			end: new Date(status.period_end)
		}
	};
}

/**
 * Check if user can perform an action
 */
export async function checkQuotaBeforeAction(
	userId: string,
	actionType: 'create_mapping' | 'analyze_file' | 'process_file',
	metadata: {
		rowsCount?: number;
		fileSizeBytes?: number;
	}
): Promise<QuotaCheckResult> {
	const supabaseAdmin = getSupabaseAdmin();
	const { data, error } = await supabaseAdmin.rpc('check_quota_limit', {
		p_user_id: userId,
		p_action_type: actionType,
		p_rows_count: metadata.rowsCount || 0,
		p_file_size_bytes: metadata.fileSizeBytes || 0
	});

	if (error) {
		console.error('Error checking quota:', error);
		// Fail open for safety, but log error
		return { allowed: true };
	}

	const result = data[0];
	return {
		allowed: result.allowed,
		errorCode: result.error_code || undefined,
		currentUsage: result.current_usage,
		limit: result.limit_value,
		remaining: result.remaining
	};
}

/**
 * Record usage atomically
 */
export async function recordUsage(
	userId: string,
	recordType: RecordType,
	metadata: {
		rowsCount: number;
		fileSizeBytes: number;
		mappingId?: string;
		additionalData?: Record<string, any>;
	}
): Promise<void> {
	const supabaseAdmin = getSupabaseAdmin();
	const { data: periodData } = await supabaseAdmin.rpc('get_or_create_subscription_period', {
		p_user_id: userId
	});

	if (!periodData) {
		console.error('Failed to get or create subscription period');
		return;
	}

	const { error } = await supabaseAdmin.from('usage_records').insert({
		user_id: userId,
		subscription_period_id: periodData,
		record_type: recordType,
		rows_count: metadata.rowsCount,
		file_size_bytes: metadata.fileSizeBytes,
		metadata: {
			mapping_id: metadata.mappingId,
			...metadata.additionalData
		}
	});

	if (error) {
		console.error('Error recording usage:', error);
		throw new Error('Failed to record usage');
	}
}

/**
 * Check if user can create a new mapping
 */
export async function canCreateMapping(userId: string): Promise<QuotaCheckResult> {
	return checkQuotaBeforeAction(userId, 'create_mapping', {});
}

/**
 * Check if user can analyze a file
 */
export async function canAnalyzeFile(
	userId: string,
	rowsCount: number,
	fileSizeBytes: number
): Promise<QuotaCheckResult> {
	return checkQuotaBeforeAction(userId, 'analyze_file', { rowsCount, fileSizeBytes });
}

/**
 * Check if user can process (export) a file
 */
export async function canProcessFile(
	userId: string,
	rowsCount: number
): Promise<QuotaCheckResult> {
	return checkQuotaBeforeAction(userId, 'process_file', { rowsCount, fileSizeBytes: 0 });
}

/**
 * Get formatted quota status for UI display
 */
export async function getFormattedQuotaStatus(userId: string) {
	const status = await getUserQuotaStatus(userId);
	const plan = getPlan(status.planTier);

	const formatValue = (value: number | null, isCount: boolean = false): string => {
		if (value === null || isUnlimited(value)) {
			return 'Unlimited';
		}
		return isCount ? value.toLocaleString() : formatBytes(value);
	};

	const formatBytes = (bytes: number): string => {
		if (isUnlimited(bytes)) return 'Unlimited';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	};

	return {
		planName: plan.name,
		planTier: status.planTier,

		// File size
		maxFileSize: formatBytes(status.limits.maxFileSizeBytes),
		maxFileSizeBytes: status.limits.maxFileSizeBytes,

		// Rows per file
		maxRowsPerFile: formatValue(status.limits.maxRowsPerFile, true),
		maxRowsPerFileNumber: status.limits.maxRowsPerFile,

		// Monthly rows analyzed
		rowsAnalyzedPerMonth: formatValue(status.limits.maxRowsAnalyzedPerMonth, true),
		rowsAnalyzedPerMonthNumber: status.limits.maxRowsAnalyzedPerMonth,
		rowsAnalyzedCurrent: status.current.rowsAnalyzed.toLocaleString(),
		rowsAnalyzedRemaining: status.remaining.rowsAnalyzed
			? status.remaining.rowsAnalyzed.toLocaleString()
			: 'Unlimited',
		rowsAnalyzedPercent: status.remaining.rowsAnalyzed
			? Math.round((status.current.rowsAnalyzed / status.limits.maxRowsAnalyzedPerMonth) * 100)
			: null,

		// Monthly rows processed
		rowsProcessedPerMonth: formatValue(status.limits.maxRowsProcessedPerMonth, true),
		rowsProcessedPerMonthNumber: status.limits.maxRowsProcessedPerMonth,
		rowsProcessedCurrent: status.current.rowsProcessed.toLocaleString(),
		rowsProcessedRemaining: status.remaining.rowsProcessed
			? status.remaining.rowsProcessed.toLocaleString()
			: 'Unlimited',
		rowsProcessedPercent: status.remaining.rowsProcessed
			? Math.round((status.current.rowsProcessed / status.limits.maxRowsProcessedPerMonth) * 100)
			: null,

		// Saved mappings
		maxSavedMappings: formatValue(status.limits.maxSavedMappings, true),
		maxSavedMappingsNumber: status.limits.maxSavedMappings,
		savedMappingsCurrent: status.current.savedMappings.toLocaleString(),
		savedMappingsRemaining: status.remaining.savedMappings
			? status.remaining.savedMappings.toLocaleString()
			: 'Unlimited',

		// Period info
		periodStart: status.period.start,
		periodEnd: status.period.end,
		periodResetDate: status.period.end.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	};
}

/**
 * Get usage percentage for progress bars
 */
export async function getUsagePercentages(userId: string) {
	const status = await getUserQuotaStatus(userId);

	const calculatePercent = (current: number, limit: number): number | null => {
		if (isUnlimited(limit)) return null;
		return Math.min(Math.round((current / limit) * 100), 100);
	};

	return {
		rowsAnalyzed: calculatePercent(status.current.rowsAnalyzed, status.limits.maxRowsAnalyzedPerMonth),
		rowsProcessed: calculatePercent(status.current.rowsProcessed, status.limits.maxRowsProcessedPerMonth),
		savedMappings: calculatePercent(status.current.savedMappings, status.limits.maxSavedMappings)
	};
}

/**
 * Check if any quota is above warning threshold (60%)
 */
export async function shouldShowUpgradePrompt(userId: string): Promise<boolean> {
	const percentages = await getUsagePercentages(userId);

	return !!(
		(percentages.rowsAnalyzed && percentages.rowsAnalyzed >= 60) ||
		(percentages.rowsProcessed && percentages.rowsProcessed >= 60) ||
		(percentages.savedMappings && percentages.savedMappings >= 60)
	);
}

/**
 * Get the most exceeded quota (for paywall modal)
 */
export async function getMostExceededQuota(userId: string): Promise<{
	quotaType: string;
	errorCode: QuotaErrorCode;
	currentUsage: number;
	limit: number;
	remaining: number;
} | null> {
	const status = await getUserQuotaStatus(userId);

	const checks = [
		{
			quotaType: 'Saved Mappings',
			errorCode: QUOTA_ERROR_CODES.SAVED_MAPPINGS_EXCEEDED,
			current: status.current.savedMappings,
			limit: status.limits.maxSavedMappings
		},
		{
			quotaType: 'Monthly Rows Analyzed',
			errorCode: QUOTA_ERROR_CODES.MONTHLY_ROWS_ANALYZED_EXCEEDED,
			current: status.current.rowsAnalyzed,
			limit: status.limits.maxRowsAnalyzedPerMonth
		},
		{
			quotaType: 'Monthly Rows Processed',
			errorCode: QUOTA_ERROR_CODES.MONTHLY_ROWS_PROCESSED_EXCEEDED,
			current: status.current.rowsProcessed,
			limit: status.limits.maxRowsProcessedPerMonth
		}
	];

	// Find quotas that are exceeded or close to limit
	for (const check of checks) {
		const remaining = check.limit - check.current;
		if (remaining <= 0 && !isUnlimited(check.limit)) {
			return {
				quotaType: check.quotaType,
				errorCode: check.errorCode,
				currentUsage: check.current,
				limit: check.limit,
				remaining: 0
			};
		}
	}

	return null;
}

/**
 * Create error response for quota violation
 */
export function createQuotaErrorResponse(checkResult: QuotaCheckResult, quotaType: string) {
	return {
		error: {
			code: checkResult.errorCode || 'QUOTA_EXCEEDED',
			message: `You've reached your ${quotaType.toLowerCase()} limit.`,
			details: {
				quotaType,
				current: checkResult.currentUsage || 0,
				limit: checkResult.limit || 0,
				remaining: checkResult.remaining || 0
			}
		}
	};
}
