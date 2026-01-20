import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { session, user, profile } = await locals.safeGetSession();

		return json({
			session,
			user: user ? { id: user.id, email: user.email } : null,
			profile
		});
	} catch (error) {
		console.error('Session endpoint error:', error);
		return json({ session: null, user: null, profile: null }, { status: 500 });
	}
};
