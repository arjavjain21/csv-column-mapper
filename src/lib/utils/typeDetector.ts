import type { ColumnType } from '$lib/types';

// Type detection patterns
const PATTERNS = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^[\d\s\-\+\(\)]+$/,
	url: /^https?:\/\//i,
	number: /^-?\d+\.?\d*$/,
	boolean: /^(true|false|yes|no|1|0)$/i,
	// Date patterns - more flexible matching
	date: /\d{4}[-/]\d{1,2}[-/]\d{1,2}|^\d{1,2}[-/]\d{1,2}[-/]\d{4}/
};

/**
 * Detect the type of a column based on sample values
 */
export function detectColumnType(values: string[]): ColumnType {
	// Filter out empty values and get up to 100 samples
	const samples = values.filter((v) => v.trim().length > 0).slice(0, 100);

	if (samples.length === 0) return 'unknown';

	// Count matches for each type
	const counts = {
		email: 0,
		phone: 0,
		url: 0,
		number: 0,
		boolean: 0,
		date: 0,
		string: 0
	};

	for (const value of samples) {
		const trimmed = value.trim();

		if (PATTERNS.email.test(trimmed)) counts.email++;
		else if (PATTERNS.phone.test(trimmed) && trimmed.length > 6) counts.phone++;
		else if (PATTERNS.url.test(trimmed)) counts.url++;
		else if (PATTERNS.number.test(trimmed)) counts.number++;
		else if (PATTERNS.boolean.test(trimmed)) counts.boolean++;
		else if (PATTERNS.date.test(trimmed)) counts.date++;
		else counts.string++;
	}

	// Calculate percentages
	const total = samples.length;
	const thresholds = {
		email: 0.9,
		phone: 0.7,
		url: 0.9,
		number: 0.9,
		boolean: 0.9,
		date: 0.7
	};

	// Check each type against its threshold
	if (counts.email / total >= thresholds.email) return 'email';
	if (counts.phone / total >= thresholds.phone) return 'phone';
	if (counts.url / total >= thresholds.url) return 'url';
	if (counts.number / total >= thresholds.number) return 'number';
	if (counts.boolean / total >= thresholds.boolean) return 'boolean';
	if (counts.date / total >= thresholds.date) return 'date';

	return 'string';
}

/**
 * Get an icon name for a column type
 */
export function getIconForType(type: ColumnType): string {
	const icons = {
		email: '✉️',
		phone: '📱',
		url: '🔗',
		number: '🔢',
		boolean: '☑️',
		date: '📅',
		string: '📝',
		unknown: '❓'
	};
	return icons[type] || icons.unknown;
}

/**
 * Get a display label for a column type
 */
export function getLabelForType(type: ColumnType): string {
	const labels = {
		email: 'Email',
		phone: 'Phone',
		url: 'URL',
		number: 'Number',
		boolean: 'Boolean',
		date: 'Date',
		string: 'Text',
		unknown: 'Unknown'
	};
	return labels[type] || labels.unknown;
}

/**
 * Get CSS color class for a column type badge
 */
export function getColorForType(type: ColumnType): string {
	const colors = {
		email: 'bg-purple-100 text-purple-700',
		phone: 'bg-green-100 text-green-700',
		url: 'bg-blue-100 text-blue-700',
		number: 'bg-orange-100 text-orange-700',
		boolean: 'bg-pink-100 text-pink-700',
		date: 'bg-indigo-100 text-indigo-700',
		string: 'bg-gray-100 text-gray-700',
		unknown: 'bg-slate-100 text-slate-700'
	};
	return colors[type] || colors.unknown;
}
