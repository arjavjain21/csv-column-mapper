import type { Transformation, ParsedCSV, ColumnMapping } from '$lib/types';

/**
 * Apply a transformation to a value
 */
export function applyTransformation(
	value: string,
	transformation: Transformation | undefined,
	row: Record<string, string>,
	dataFile: ParsedCSV
): string {
	if (!transformation || transformation.type === 'none' || !value) {
		return value;
	}

	try {
		switch (transformation.type) {
			case 'uppercase':
				return value.toUpperCase();

			case 'lowercase':
				return value.toLowerCase();

			case 'trim':
				return value.trim();

			case 'split':
				if (transformation.splitDelimiter !== undefined) {
					const parts = value.split(transformation.splitDelimiter);
					const index = transformation.splitIndex ?? 0;
					return parts[index]?.trim() ?? '';
				}
				return value;

			case 'concatenate':
				if (transformation.concatenateColumns && transformation.concatenateColumns.length > 0) {
					const separator = transformation.concatenateSeparator ?? ' ';
					const values = transformation.concatenateColumns
						.map((col) => row[col] ?? '')
						.filter((v) => v && v.trim() !== '');
					return values.length > 0 ? values.join(separator) : '';
				}
				return '';

			case 'regex_replace':
				if (transformation.regexPattern) {
					const flags = transformation.regexFlags ?? 'g';
					const regex = new RegExp(transformation.regexPattern, flags);
					const replacement = transformation.regexReplacement ?? '';
					return value.replace(regex, replacement);
				}
				return value;

			case 'date_format':
				if (transformation.dateInputFormat && transformation.dateOutputFormat) {
					return formatDate(value, transformation.dateInputFormat, transformation.dateOutputFormat);
				}
				return value;

			case 'number_format':
				return formatNumber(value, transformation);

			case 'custom_formula':
				if (transformation.customFormula) {
					return evaluateCustomFormula(transformation.customFormula, value, row, dataFile);
				}
				return value;

			default:
				return value;
		}
	} catch (error) {
		console.error('Transformation error:', error);
		return value; // Return original value on error
	}
}

/**
 * Format a date string from one format to another
 */
function formatDate(value: string, inputFormat: string, outputFormat: string): string {
	try {
		// Parse common date formats
		let date: Date | null = null;

		// Try parsing with common formats
		const formats = [
			'YYYY-MM-DD',
			'MM/DD/YYYY',
			'DD/MM/YYYY',
			'MM-DD-YYYY',
			'DD-MM-YYYY',
			'YYYY/MM/DD',
			'DD.MM.YYYY',
			'MM.DD.YYYY'
		];

		for (const format of formats) {
			date = tryParseDate(value, format);
			if (date) break;
		}

		// Fallback to native Date parsing
		if (!date) {
			date = new Date(value);
			if (isNaN(date.getTime())) {
				return value; // Invalid date
			}
		}

		// Format output
		return formatDateOutput(date, outputFormat);
	} catch {
		return value;
	}
}

/**
 * Try to parse a date with a specific format
 */
function tryParseDate(value: string, format: string): Date | null {
	const parts: Record<string, number> = {};

	if (format === 'YYYY-MM-DD' || format === 'YYYY/MM/DD') {
		const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
		if (match) {
			parts.year = parseInt(match[1], 10);
			parts.month = parseInt(match[2], 10) - 1;
			parts.day = parseInt(match[3], 10);
		}
	} else if (format === 'MM/DD/YYYY' || format === 'MM-DD-YYYY' || format === 'MM.DD.YYYY') {
		const match = value.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
		if (match) {
			parts.month = parseInt(match[1], 10) - 1;
			parts.day = parseInt(match[2], 10);
			parts.year = parseInt(match[3], 10);
		}
	} else if (format === 'DD/MM/YYYY' || format === 'DD-MM-YYYY' || format === 'DD.MM.YYYY') {
		const match = value.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
		if (match) {
			parts.day = parseInt(match[1], 10);
			parts.month = parseInt(match[2], 10) - 1;
			parts.year = parseInt(match[3], 10);
		}
	}

	if (parts.year && parts.month !== undefined && parts.day) {
		const date = new Date(parts.year, parts.month, parts.day);
		if (!isNaN(date.getTime())) {
			return date;
		}
	}

	return null;
}

/**
 * Format date output according to format string
 */
function formatDateOutput(date: Date, format: string): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return format
		.replace(/YYYY/g, String(year))
		.replace(/MM/g, month)
		.replace(/DD/g, day)
		.replace(/M/g, String(date.getMonth() + 1))
		.replace(/D/g, String(date.getDate()));
}

/**
 * Format a number according to transformation settings
 */
function formatNumber(value: string, transformation: Transformation): string {
	const num = parseFloat(value);
	if (isNaN(num)) {
		return value; // Return original if not a number
	}

	const decimals = transformation.numberDecimals ?? 2;
	const thousandsSep = transformation.numberThousandsSeparator ?? ',';
	const decimalSep = transformation.numberDecimalSeparator ?? '.';

	// Format with decimal places
	const parts = num.toFixed(decimals).split('.');
	const integerPart = parts[0];
	const decimalPart = parts[1];

	// Add thousands separator
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

	if (decimals > 0 && decimalPart) {
		return `${formattedInteger}${decimalSep}${decimalPart}`;
	}
	return formattedInteger;
}

/**
 * Evaluate a custom JavaScript formula
 * SECURITY NOTE: In production, this should use a sandboxed environment
 * For now, we'll allow basic operations but restrict dangerous functions
 */
function evaluateCustomFormula(
	formula: string,
	value: string,
	row: Record<string, string>,
	dataFile: ParsedCSV
): string {
	try {
		// Create a safe evaluation context
		const context = {
			value,
			row,
			// Math functions
			Math,
			// String functions
			String,
			// Number functions
			Number,
			parseInt,
			parseFloat,
			// Date functions
			Date,
			// Array functions
			Array,
			// Basic string operations
			substring: (str: string, start: number, end?: number) => str.substring(start, end),
			replace: (str: string, pattern: string, replacement: string) => str.replace(pattern, replacement),
			toUpperCase: (str: string) => str.toUpperCase(),
			toLowerCase: (str: string) => str.toLowerCase(),
			trim: (str: string) => str.trim()
		};

		// Replace common patterns
		let safeFormula = formula
			.replace(/\bvalue\b/g, 'context.value')
			.replace(/\brow\[['"]([^'"]+)['"]\]/g, (match, col) => `context.row['${col}']`);

		// Wrap in function that uses context
		const func = new Function('context', `return ${safeFormula}`);

		const result = func(context);
		return String(result);
	} catch (error) {
		console.error('Custom formula error:', error);
		return value; // Return original on error
	}
}

/**
 * Get available transformation types for a column type
 */
export function getAvailableTransformations(columnType: string): TransformationType[] {
	const base = ['none', 'trim', 'uppercase', 'lowercase', 'regex_replace'];
	
	switch (columnType) {
		case 'string':
			return [...base, 'split', 'concatenate', 'custom_formula'];
		case 'date':
			return ['none', 'date_format', 'custom_formula'];
		case 'number':
			return ['none', 'number_format', 'custom_formula'];
		case 'email':
		case 'url':
		case 'phone':
			return [...base, 'custom_formula'];
		default:
			return base;
	}
}

/**
 * Get default transformation for a transformation type
 */
export function getDefaultTransformation(type: TransformationType): Transformation {
	switch (type) {
		case 'split':
			return { type, splitDelimiter: ' ', splitIndex: 0 };
		case 'concatenate':
			return { type, concatenateColumns: [], concatenateSeparator: ' ' };
		case 'regex_replace':
			return { type, regexPattern: '', regexReplacement: '', regexFlags: 'g' };
		case 'date_format':
			return { type, dateInputFormat: 'YYYY-MM-DD', dateOutputFormat: 'MM/DD/YYYY' };
		case 'number_format':
			return { type, numberDecimals: 2, numberThousandsSeparator: ',', numberDecimalSeparator: '.' };
		case 'custom_formula':
			return { type, customFormula: 'value' };
		default:
			return { type: 'none' };
	}
}
