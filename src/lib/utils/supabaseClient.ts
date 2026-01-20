import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './database.types';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase environment variables. Please copy .env.example to .env and fill in your Supabase credentials.'
	);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		detectSessionInUrl: true, // Automatically detect OAuth callback in URL
		persistSession: true, // Persist session to localStorage
		autoRefreshToken: true, // Automatically refresh expired tokens
	},
});
