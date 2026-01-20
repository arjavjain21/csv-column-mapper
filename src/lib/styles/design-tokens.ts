/**
 * DESIGN SYSTEM - CSV Column Mapper
 *
 * Production-grade SaaS interface for data transformation workflows.
 * Built for power users who value speed, clarity, and predictability.
 *
 * PHILOSOPHY:
 * - Function over aesthetics
 * - Clarity over creativity
 * - Familiar patterns over novelty
 * - Fewer elements beats clever layouts
 */

/**
 * COLOR PALETTE
 *
 * Deep navy background system for reduced eye fatigue during long sessions.
 * High contrast for readability. Functional accent colors only.
 */
export const colors = {
	// Backgrounds - Deep Navy System
	background: {
		primary: '#0B1220', // Main background
		secondary: '#111A2E', // Panels, sections
		tertiary: '#16213A', // Cards, modals
		elevated: '#1A2845', // Hover states, elevated elements
	},

	// Text - High Contrast Hierarchy
	text: {
		primary: '#E8EAF0', // Main content, high readability
		secondary: '#9CA3AF', // Supporting text, descriptions
		tertiary: '#6B7280', // Labels, helper text, muted
		inverse: '#0B1220', // Text on dark backgrounds
	},

	// Borders - Subtle Definition
	border: {
		default: '#1F2937',
		subtle: '#374151',
		highlight: '#4B5563',
	},

	// Functional Accents - Purposeful Color Only
	accent: {
		primary: '#3B82F6', // Primary actions, links
		primaryHover: '#2563EB', // Primary hover state
		success: '#10B981', // Success states, confirmations
		successHover: '#059669',
		warning: '#F59E0B', // Warnings, caution
		warningHover: '#D97706',
		error: '#EF4444', // Errors, destructive actions
		errorHover: '#DC2626',
		info: '#6366F1', // Information, neutral highlights
	},

	// Data Visualization
	data: {
		blue: '#3B82F6',
		green: '#10B981',
		amber: '#F59E0B',
		red: '#EF4444',
		purple: '#8B5CF6',
		cyan: '#06B6D4',
	},
} as const;

/**
 * TYPOGRAPHY
 *
 * System font stack for performance and familiarity.
 * Clear hierarchy for scannability.
 */
export const typography = {
	family: {
		sans:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
	},

	// Font Sizes - Compact but Readable
	size: {
		xs: '0.75rem', // 12px - Small labels, metadata
		sm: '0.875rem', // 14px - Body text, table cells
		base: '1rem', // 16px - Default text
		lg: '1.125rem', // 18px - Section headers
		xl: '1.25rem', // 20px - Page titles
		'2xl': '1.5rem', // 24px - Large headings (rare)
	},

	// Font Weights - Subtle Hierarchy
	weight: {
		normal: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},

	// Line Heights - Optimized for Readability
	lineHeight: {
		tight: '1.25',
		normal: '1.5',
		relaxed: '1.75',
	},
} as const;

/**
 * SPACING
 *
 * Consistent 4px grid system for predictable layouts.
 */
export const spacing = {
	0: '0',
	1: '0.25rem', // 4px
	2: '0.5rem', // 8px
	3: '0.75rem', // 12px
	4: '1rem', // 16px
	5: '1.25rem', // 20px
	6: '1.5rem', // 24px
	8: '2rem', // 32px
	10: '2.5rem', // 40px
	12: '3rem', // 48px
	16: '4rem', // 64px
	20: '5rem', // 80px
} as const;

/**
 * BORDERS
 *
 * Minimal radius for professional appearance.
 */
export const borders = {
	radius: {
		none: '0',
		sm: '0.125rem', // 2px - Subtle rounding
		default: '0.25rem', // 4px - Standard corners
		md: '0.375rem', // 6px - Cards, panels
		lg: '0.5rem', // 8px - Larger elements
	},
	width: {
		thin: '1px',
		medium: '2px',
		thick: '3px',
	},
} as const;

/**
 * SHADOWS
 *
 * Minimal elevation. Subtle depth without distraction.
 */
export const shadows = {
	none: 'none',
	sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
	default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

/**
 * TRANSITIONS
 *
 * Fast, subtle transitions. No decorative animations.
 */
export const transitions = {
	duration: {
		instant: '100ms',
		fast: '150ms', // Default for micro-interactions
		normal: '200ms',
		slow: '300ms',
	},
	easing: {
		default: 'cubic-bezier(0.4, 0, 0.2, 1)',
		in: 'cubic-bezier(0.4, 0, 1, 1)',
		out: 'cubic-bezier(0, 0, 0.2, 1)',
	},
} as const;

/**
 * LAYOUT
 *
 * Consistent max-widths and breakpoints.
 */
export const layout = {
	maxWidth: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
		full: '100%',
	},
	container: {
		default: '1200px',
		narrow: '800px',
		wide: '1400px',
	},
	sidebar: {
		width: '280px',
		collapsed: '64px',
	},
} as const;

/**
 * Z-INDEX
 *
 * Layer management for modals, dropdowns, tooltips.
 */
export const zIndex = {
	base: 0,
	dropdown: 1000,
	sticky: 1100,
	overlay: 1200,
	modal: 1300,
	tooltip: 1400,
} as const;

/**
 * COMPONENT TOKENS
 *
 * Specific styles for common components.
 */
export const components = {
	button: {
		// Primary Button
		primary: {
			background: colors.accent.primary,
			color: colors.text.primary,
			hover: colors.accent.primaryHover,
			border: 'none',
			radius: borders.radius.default,
			padding: `${spacing[3]} ${spacing[5]}`, // 12px 20px
			fontWeight: typography.weight.medium,
			fontSize: typography.size.sm,
		},

		// Secondary Button
		secondary: {
			background: colors.background.secondary,
			color: colors.text.primary,
			hover: colors.background.elevated,
			border: `${borders.width.thin} solid ${colors.border.default}`,
			radius: borders.radius.default,
			padding: `${spacing[3]} ${spacing[5]}`,
			fontWeight: typography.weight.medium,
			fontSize: typography.size.sm,
		},

		// Ghost Button (minimal)
		ghost: {
			background: 'transparent',
			color: colors.text.secondary,
			hover: colors.background.tertiary,
			border: 'none',
			radius: borders.radius.default,
			padding: `${spacing[2]} ${spacing[3]}`,
			fontWeight: typography.weight.normal,
			fontSize: typography.size.sm,
		},
	},

	input: {
		background: colors.background.primary,
		color: colors.text.primary,
		border: `${borders.width.thin} solid ${colors.border.default}`,
		borderFocus: colors.accent.primary,
		radius: borders.radius.default,
		padding: `${spacing[2]} ${spacing[3]}`,
		fontSize: typography.size.sm,
		placeholder: colors.text.tertiary,
	},

	table: {
		background: colors.background.primary,
		border: `${borders.width.thin} solid ${colors.border.default}`,
		headerBackground: colors.background.secondary,
		headerText: colors.text.secondary,
		rowHover: colors.background.tertiary,
		zebra: colors.background.secondary,
		cellPadding: `${spacing[3]} ${spacing[4]}`,
	},

	card: {
		background: colors.background.tertiary,
		border: `${borders.width.thin} solid ${colors.border.default}`,
		radius: borders.radius.md,
		padding: spacing[6],
	},

	modal: {
		background: colors.background.secondary,
		border: `${borders.width.thin} solid ${colors.border.default}`,
		radius: borders.radius.lg,
		padding: spacing[8],
		maxWidth: '600px',
	},
} as const;

/**
 * UTILITY CLASSES GENERATOR
 *
 * Helper function to generate CSS strings from tokens.
 */
export const cssVars = {
	'--color-bg-primary': colors.background.primary,
	'--color-bg-secondary': colors.background.secondary,
	'--color-bg-tertiary': colors.background.tertiary,
	'--color-bg-elevated': colors.background.elevated,
	'--color-text-primary': colors.text.primary,
	'--color-text-secondary': colors.text.secondary,
	'--color-text-tertiary': colors.text.tertiary,
	'--color-border': colors.border.default,
	'--color-accent': colors.accent.primary,
	'--color-accent-hover': colors.accent.primaryHover,
	'--color-success': colors.accent.success,
	'--color-warning': colors.accent.warning,
	'--color-error': colors.accent.error,
	'--font-sans': typography.family.sans,
	'--font-mono': typography.family.mono,
} as const;
