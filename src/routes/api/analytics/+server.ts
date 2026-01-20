import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get user's mappings count
		const { count: totalMappings, error: mappingsError } = await locals.supabase
			.from('mappings')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', user.id);

		// Get recent mappings
		const { data: recentMappings, error: recentError } = await locals.supabase
			.from('mappings')
			.select('*')
			.eq('user_id', user.id)
			.order('updated_at', { ascending: false })
			.limit(10);

		// Calculate some analytics (mock data for now)
		const filesProcessed = totalMappings || 0;
		const templatesUsed = Math.floor((totalMappings || 0) * 0.3); // Approximate
		const timeSaved = Math.floor((totalMappings || 0) * 0.5); // ~30min per mapping saved

		return json({
			totalMappings: totalMappings || 0,
			filesProcessed,
			templatesUsed,
			timeSaved,
			recentMappings: recentMappings || [],
			accountCreated: user?.created_at
		});
	} catch (error) {
		console.error('Analytics error:', error);
		return json({ error: 'Failed to fetch analytics' }, { status: 500 });
	}
};
