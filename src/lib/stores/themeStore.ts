/**
 * Theme Store
 *
 * Single source of truth for application theme.
 * Supports light and dark modes using Svelte 5 runes.
 */

import { setMode } from './modeStore';

export type ThemeMode = 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

// System theme detection
const getSystemTheme = (): EffectiveTheme => {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme to document
const applyTheme = (mode: ThemeMode) => {
	if (typeof document === 'undefined') return;

	const effectiveTheme: EffectiveTheme = mode;

	// Set data-theme attribute on html element
	document.documentElement.dataset.theme = effectiveTheme;

	// Also set class for compatibility
	document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');

	// Update meta theme-color for mobile browsers
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		const color =
			effectiveTheme === 'dark'
				? '#0B1220' // --color-bg-primary in dark mode
				: '#ffffff'; // --color-bg-primary in light mode
		metaThemeColor.setAttribute('content', color);
	}
};

// Set theme mode and apply to document
export const setThemeMode = (mode: ThemeMode) => {
	setMode(mode);
	applyTheme(mode);
};

// Get current effective theme (respects system preference)
export const getEffectiveTheme = (): EffectiveTheme => {
	const stored = localStorage.getItem('csv-mapper-theme');
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	return getSystemTheme();
};

// Toggle between light and dark
export const toggleTheme = () => {
	const current = getEffectiveTheme();
	const newMode: ThemeMode = current === 'dark' ? 'light' : 'dark';
	setThemeMode(newMode);
};

// Initialize on client side
if (typeof window !== 'undefined') {
	// Apply theme immediately on load
	const currentMode = getEffectiveTheme();
	applyTheme(currentMode);

	// Listen for system theme changes
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const handleSystemThemeChange = () => {
		// Only update if user hasn't set a preference
		if (!localStorage.getItem('csv-mapper-theme')) {
			const systemTheme = getSystemTheme();
			applyTheme(systemTheme);
		}
	};

	// Modern browsers
	mediaQuery.addEventListener('change', handleSystemThemeChange);

	// Cleanup on page unload (not really needed for SPA, but good practice)
	window.addEventListener('beforeunload', () => {
		mediaQuery.removeEventListener('change', handleSystemThemeChange);
	});
}
