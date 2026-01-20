/**
 * GET /api/user/quota
 *
 * Returns the current user's quota status and usage
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFormattedQuotaStatus } from '$lib/services/quotaService';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.safeGetSession();

	// Require authentication
	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const quotaStatus = await getFormattedQuotaStatus(session.user.id);
		return json(quotaStatus);
	} catch (error) {
		console.error('Error fetching quota status:', error);
		return json({ error: 'Failed to fetch quota status' }, { status: 500 });
	}
};
