import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Get the app URL from environment
		const appUrl = import.meta.env.PUBLIC_APP_URL || 'http://localhost:5173';

		// Send magic link using Supabase Auth
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${appUrl}/auth/callback`,
				shouldCreateUser: true
			}
		});

		if (error) {
			console.error('Magic link error:', error);
			return json({ error: 'Failed to send magic link. Please try again.' }, { status: 500 });
		}

		return json({
			success: true,
			message: 'Magic link sent successfully',
			email: email
		});
	} catch (error) {
		console.error('Magic link endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
