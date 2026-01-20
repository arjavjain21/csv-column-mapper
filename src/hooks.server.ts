import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Database } from '$lib/utils/database.types';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		// If Supabase is not configured, continue without it (for static pages)
		return resolve(event);
	}

	event.locals.supabase = createServerClient<Database>(
		supabaseUrl,
		supabaseAnonKey,
		{
			cookies: {
				getAll() {
					return event.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/', httpOnly: true, secure: true, sameSite: 'lax' })
					);
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, this returns the session *and*
	 * refreshes the token if it's expired.
	 */
	event.locals.safeGetSession = async () => {
		if (!event.locals.supabase) {
			return { session: null, user: null, profile: null };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null, profile: null };
		}

		// Fetch user profile from public user_profiles table
		const { data: profile } = await event.locals.supabase
			.from('user_profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();

		return { session, user: session.user, profile };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Supabase libraries add `set-cookie` header. SvelteKit's default handling is fine.
			return name === 'set-cookie';
		}
	});
};

const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

	// Add HSTS header for HTTPS (only in production)
	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	}

	// Add CSP header (Content Security Policy)
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for SvelteKit
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self' https://*.supabase.co https://*.supabase.in",
		"frame-ancestors 'self'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);

	return response;
};

const authGuard: Handle = async ({ event, resolve }) => {
	// Protect specific routes that require authentication
	const protectedRoutes = ['/dashboard', '/profile', '/mappings', '/app', '/analytics', '/templates'];
	const apiProtectedRoutes = ['/api/mappings', '/api/analytics', '/api/user', '/api/process', '/api/usage'];
	const requestedRoute = event.url.pathname;
	const isApiRoute = requestedRoute.startsWith('/api/');

	// Check if route requires authentication
	const requiresAuth = protectedRoutes.some((route) => requestedRoute.startsWith(route));
	const requiresApiAuth = apiProtectedRoutes.some((route) => requestedRoute.startsWith(route));

	if (requiresAuth || requiresApiAuth) {
		const { session } = await event.locals.safeGetSession();

		if (!session) {
			if (isApiRoute) {
				// Return 401 for API routes
				return new Response(
					JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }),
					{
						status: 401,
						headers: {
							'Content-Type': 'application/json',
							'WWW-Authenticate': 'Bearer'
						}
					}
				);
			} else {
				// Redirect to login for page routes
				return new Response('Redirect', {
					status: 302,
					headers: {
						Location: `/auth?redirect=${encodeURIComponent(event.url.pathname)}`
					}
				});
			}
		}
	}

	return resolve(event);
};

export const handle = sequence(supabase, securityHeaders, authGuard);
