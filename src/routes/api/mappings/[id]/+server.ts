/**
 * DELETE /api/mappings/[id]
 *
 * Delete a saved mapping and update quota
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { recordUsage } from '$lib/services/quotaService';

/**
 * DELETE /api/mappings/[id]
 * Delete a specific mapping
 */
export const DELETE: RequestHandler = async ({ locals, params }) => {
	const session = await locals.safeGetSession();

	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const mappingId = params.id;

	if (!mappingId) {
		return json({ error: 'Mapping ID required' }, { status: 400 });
	}

	try {
		// First verify the mapping belongs to the user
		const { data: mapping, error: fetchError } = await locals.supabase
			.from('mappings')
			.select('id, user_id')
			.eq('id', mappingId)
			.single();

		if (fetchError || !mapping) {
			return json({ error: 'Mapping not found' }, { status: 404 });
		}

		if (mapping.user_id !== session.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		// Delete the mapping
		const { error: deleteError } = await locals.supabase
			.from('mappings')
			.delete()
			.eq('id', mappingId);

		if (deleteError) {
			console.error('Error deleting mapping:', deleteError);
			return json({ error: 'Failed to delete mapping' }, { status: 500 });
		}

		// Record usage (mapping freed up quota)
		await recordUsage(session.user.id, 'mapping_deleted', {
			rowsCount: 0,
			fileSizeBytes: 0,
			mappingId: mappingId
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error in DELETE /api/mappings/[id]:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
