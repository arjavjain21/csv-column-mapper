import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Don't initialize Supabase on client-side for now
	// This prevents errors if Supabase isn't configured
	event.locals.session = null;

	return resolve(event);
};
