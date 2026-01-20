import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// Check if safeGetSession exists (it should be set by hooks.server.ts)
		if (!locals.safeGetSession || typeof locals.safeGetSession !== 'function') {
			console.error('safeGetSession not available in locals');
			// Fallback: return null session
			return json({ session: null, user: null, profile: null });
		}

		const { session, user, profile } = await locals.safeGetSession();

		return json({
			session,
			user: user ? { id: user.id, email: user.email } : null,
			profile
		});
	} catch (error) {
		console.error('Session endpoint error:', error);
		// Return null session instead of 500 error
		return json({ session: null, user: null, profile: null });
	}
};
