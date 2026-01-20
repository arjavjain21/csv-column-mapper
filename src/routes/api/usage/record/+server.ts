/**
 * POST /api/usage/record
 *
 * Record usage events (file uploads, exports, etc.)
 * Internal endpoint called by frontend after successful actions
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { recordUsage, canAnalyzeFile, canProcessFile } from '$lib/services/quotaService';

interface RecordUsageBody {
	action: 'file_analyzed' | 'file_processed';
	rowsCount: number;
	fileSizeBytes: number;
	metadata?: {
		mappingId?: string;
		fileName?: string;
		[key: string]: any;
	};
}

/**
 * POST /api/usage/record
 * Record a usage event
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.safeGetSession();

	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body: RecordUsageBody = await request.json();

		// Validate required fields
		if (!body.action || body.rowsCount === undefined || body.fileSizeBytes === undefined) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// For file_analyzed, check if within quota first
		if (body.action === 'file_analyzed') {
			const quotaCheck = await canAnalyzeFile(
				session.user.id,
				body.rowsCount,
				body.fileSizeBytes
			);

			if (!quotaCheck.allowed) {
				return json(
					{
						error: {
							code: quotaCheck.errorCode || 'QUOTA_EXCEEDED',
							message: 'You have reached your monthly file analysis limit',
							details: {
								quotaType: 'Monthly Rows Analyzed',
								current: quotaCheck.currentUsage || 0,
								limit: quotaCheck.limit || 0,
								remaining: quotaCheck.remaining || 0
							}
						}
					},
					{ status: 429 }
				);
			}
		}

		// For file_processed, check if within quota
		if (body.action === 'file_processed') {
			const quotaCheck = await canProcessFile(session.user.id, body.rowsCount);

			if (!quotaCheck.allowed) {
				return json(
					{
						error: {
							code: quotaCheck.errorCode || 'QUOTA_EXCEEDED',
							message: 'You have reached your monthly export limit',
							details: {
								quotaType: 'Monthly Rows Processed',
								current: quotaCheck.currentUsage || 0,
								limit: quotaCheck.limit || 0,
								remaining: quotaCheck.remaining || 0
							}
						}
					},
					{ status: 429 }
				);
			}
		}

		// Record the usage
		await recordUsage(session.user.id, body.action, {
			rowsCount: body.rowsCount,
			fileSizeBytes: body.fileSizeBytes,
			...body.metadata
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error in POST /api/usage/record:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
