/**
 * Simple theme store without complexity
 */

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

// Get theme from localStorage
export function getTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	// Check system preference
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Set theme in localStorage and apply to document
export function setTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(THEME_KEY, theme);
	applyTheme(theme);
}

// Apply theme to document
export function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = theme;
	document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Toggle theme
export function toggleTheme() {
	const current = getTheme();
	const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
	setTheme(newTheme);
	return newTheme;
}

// Initialize theme
if (typeof window !== 'undefined') {
	applyTheme(getTheme());
}
