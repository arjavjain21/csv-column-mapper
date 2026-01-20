// See https://kit.svelte.dev/docs/types#app
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/utils/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{
				session: Session | null;
				user: Session['user'] | null;
				profile: Database['public']['Tables']['user_profiles']['Row'] | null;
			}>;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
