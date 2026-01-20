import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '$lib/utils/rateLimiter';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Rate limiting
		const identifier = getRateLimitIdentifier(request);
		const rateLimit = checkRateLimit(
			identifier,
			RATE_LIMITS.auth.maxRequests,
			RATE_LIMITS.auth.windowMs
		);

		if (!rateLimit.allowed) {
			return json(
				{
					error: 'Too many login attempts',
					message: 'Please wait before trying again',
					retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
				},
				{
					status: 429,
					headers: {
						'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
						'X-RateLimit-Limit': String(RATE_LIMITS.auth.maxRequests),
						'X-RateLimit-Remaining': String(rateLimit.remaining),
						'X-RateLimit-Reset': String(rateLimit.resetAt)
					}
				}
			);
		}

		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Validate password length
		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
		}

		// Authenticate with Supabase
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Login error:', error);

			// Provide user-friendly error messages
			if (error.message === 'Invalid login credentials') {
				return json({ error: 'Invalid email or password' }, { status: 401 });
			}

			if (error.message.includes('Email not confirmed')) {
				return json({ error: 'Please verify your email before signing in' }, { status: 401 });
			}

			return json({ error: 'Authentication failed. Please try again.' }, { status: 500 });
		}

		// Return success response
		return json({
			success: true,
			message: 'Signed in successfully',
			user: {
				id: data.user.id,
				email: data.user.email,
				createdAt: data.user.created_at
			}
		});
	} catch (error) {
		console.error('Login endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
