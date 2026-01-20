import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		loading: true,
		error: null
	});

	// Initialize auth state from Supabase
	async function initialize() {
		try {
			const { data: { session } } = await supabase.auth.getSession();

			if (session?.user) {
				set({
					user: session.user,
					loading: false,
					error: null
				});
			} else {
				set({
					user: null,
					loading: false,
					error: null
				});
			}
		} catch (error) {
			set({
				user: null,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to initialize auth'
			});
		}
	}

	// Sign in with email and password
	async function signIn(email: string, password: string) {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) throw error;

			set({
				user: data.user,
				loading: false,
				error: null
			});

			return { success: true, user: data.user };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
			update((state) => ({
				...state,
				loading: false,
				error: errorMessage
			}));
			return { success: false, error: errorMessage };
		}
	}

	// Sign up with email, password, and full name
	async function signUp(email: string, password: string, fullName: string) {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullName,
						auth_method: 'password'
					}
				}
			});

			if (error) throw error;

			set({
				user: data.user || null,
				loading: false,
				error: null
			});

			return { success: true, user: data.user };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
			update((state) => ({
				...state,
				loading: false,
				error: errorMessage
			}));
			return { success: false, error: errorMessage };
		}
	}

	// Sign out
	async function signOut() {
		update((state) => ({ ...state, loading: true }));

		try {
			const { error } = await supabase.auth.signOut();

			if (error) throw error;

			set({
				user: null,
				loading: false,
				error: null
			});

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
			update((state) => ({
				...state,
				loading: false,
				error: errorMessage
			}));
			return { success: false, error: errorMessage };
		}
	}

	// Get current user (refresh from Supabase)
	async function getCurrentUser() {
		update((state) => ({ ...state, loading: true }));

		try {
			const { data: { user } } = await supabase.auth.getUser();

			set({
				user,
				loading: false,
				error: null
			});

			return user;
		} catch (error) {
			update((state) => ({
				...state,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to get user'
			}));
			return null;
		}
	}

	// Clear error
	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	return {
		subscribe,
		initialize,
		signIn,
		signUp,
		signOut,
		getCurrentUser,
		clearError
	};
}

export const authStore = createAuthStore();

// Initialize auth store on app load (browser only)
if (typeof window !== 'undefined') {
	authStore.initialize();
}

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
	if (event === 'SIGNED_IN' && session?.user) {
		authStore.initialize();
	} else if (event === 'SIGNED_OUT') {
		authStore.initialize();
	}
});
