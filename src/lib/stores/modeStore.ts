/**
 * Mode Store
 *
 * Reactive state for theme mode using Svelte stores.
 */

import { writable } from 'svelte/store';

const THEME_KEY = 'csv-mapper-theme';

// Get initial mode from localStorage or system preference
const getInitialMode = (): 'light' | 'dark' => {
	if (typeof window === 'undefined') return 'dark';
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === 'light' || stored === 'dark') {
		return stored as 'light' | 'dark';
	}
	// Check system preference
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	return 'light';
};

// Create the store
export const modeState = writable<'light' | 'dark'>(getInitialMode());

// Set mode and persist to localStorage
export const setMode = (mode: 'light' | 'dark') => {
	modeState.set(mode);
	if (typeof window !== 'undefined') {
		localStorage.setItem(THEME_KEY, mode);
	}
};

// Get current mode
export const getMode = (): 'light' | 'dark' => {
	let current: 'light' | 'dark' = 'dark';
	modeState.subscribe((value) => (current = value))();
	return current;
};

