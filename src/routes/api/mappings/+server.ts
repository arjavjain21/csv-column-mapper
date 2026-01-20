/**
 * POST /api/mappings - Save a new mapping
 * GET /api/mappings - List user's mappings
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canCreateMapping, recordUsage } from '$lib/services/quotaService';
import { getPlan } from '$lib/config/plans';

interface SaveMappingBody {
	name: string;
	description?: string;
	sourceColumns: string[];
	targetColumns: string[];
	columnMappings: Record<string, string>;
	transformations?: Record<string, any>;
	validationRules?: Record<string, any>;
}

/**
 * POST /api/mappings
 * Save a new mapping with quota check
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.safeGetSession();

	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body: SaveMappingBody = await request.json();

		// Validate required fields
		if (!body.name || !body.sourceColumns || !body.targetColumns || !body.columnMappings) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Check quota before saving
		const quotaCheck = await canCreateMapping(session.user.id);

		if (!quotaCheck.allowed) {
			const plan = getPlan(session.user.subscription_tier);
			return json(
				{
					error: {
						code: quotaCheck.errorCode || 'QUOTA_EXCEEDED',
						message: 'You have reached your saved mappings limit',
						details: {
							quotaType: 'Saved Mappings',
							current: quotaCheck.currentUsage || 0,
							limit: quotaCheck.limit || 0,
							remaining: quotaCheck.remaining || 0,
							planId: plan.id
						}
					}
				},
				{ status: 429 }
			);
		}

		// Save mapping to database
		const { data: mapping, error } = await locals.supabase
			.from('mappings')
			.insert({
				user_id: session.user.id,
				name: body.name,
				description: body.description || '',
				source_columns: body.sourceColumns,
				target_columns: body.targetColumns,
				column_mappings: body.columnMappings,
				transformations: body.transformations || {},
				validation_rules: body.validationRules || {},
				is_template: false
			})
			.select()
			.single();

		if (error) {
			console.error('Error saving mapping:', error);
			return json({ error: 'Failed to save mapping' }, { status: 500 });
		}

		// Record usage
		await recordUsage(session.user.id, 'mapping_created', {
			rowsCount: 0,
			fileSizeBytes: 0,
			mappingId: mapping.id
		});

		return json({ success: true, mapping });
	} catch (error) {
		console.error('Error in POST /api/mappings:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * GET /api/mappings
 * List user's saved mappings
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.safeGetSession();

	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { data: mappings, error } = await locals.supabase
			.from('mappings')
			.select('id, name, description, source_columns, target_columns, created_at, updated_at')
			.eq('user_id', session.user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching mappings:', error);
			return json({ error: 'Failed to fetch mappings' }, { status: 500 });
		}

		return json({ mappings: mappings || [] });
	} catch (error) {
		console.error('Error in GET /api/mappings:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
