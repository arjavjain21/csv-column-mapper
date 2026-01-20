import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';
import { sendWelcomeEmail } from '$lib/utils/emailService';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password, fullName } = await request.json();

		// Validate required fields
		if (!email || !password || !fullName) {
			return json({ error: 'Email, password, and full name are required' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Validate password strength
		if (password.length < 8) {
			return json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
		}

		// Check for at least one uppercase letter
		if (!/[A-Z]/.test(password)) {
			return json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 });
		}

		// Check for at least one number
		if (!/\d/.test(password)) {
			return json({ error: 'Password must contain at least one number' }, { status: 400 });
		}

		// Validate full name
		if (fullName.trim().length < 2) {
			return json({ error: 'Full name must be at least 2 characters' }, { status: 400 });
		}

		// Get the app URL from environment
		const appUrl = import.meta.env.PUBLIC_APP_URL || 'http://localhost:5173';

		// Sign up with Supabase
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName.trim(),
					auth_method: 'password'
				},
				emailRedirectTo: `${appUrl}/auth/callback`
			}
		});

		if (error) {
			console.error('Signup error:', error);

			// Handle specific error cases
			if (error.message.includes('User already registered')) {
				return json({ error: 'An account with this email already exists' }, { status: 409 });
			}

			return json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
		}

		// Send welcome email (don't fail if email fails)
		if (data.user?.email) {
			try {
				await sendWelcomeEmail(data.user.email, fullName.trim());
			} catch (emailError) {
				console.error('Failed to send welcome email:', emailError);
				// Don't fail the signup if email fails
			}
		}

		// Return success response
		return json({
			success: true,
			message: 'Account created successfully! Please check your email to verify your account.',
			user: {
				id: data.user?.id,
				email: data.user?.email,
				fullName: fullName,
				emailVerified: data.user?.email_confirmed_at != null
			}
		});
	} catch (error) {
		console.error('Signup endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
