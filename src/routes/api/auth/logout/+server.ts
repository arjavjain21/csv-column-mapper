import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Sign out from Supabase
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Logout error:', error);
			return json({ error: 'Failed to sign out' }, { status: 500 });
		}

		return json({
			success: true,
			message: 'Signed out successfully'
		});
	} catch (error) {
		console.error('Logout endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
