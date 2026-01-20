import type { ColumnMapping, ParsedCSV, Column } from '$lib/types';

// Validation rule types
export type ValidationRuleType =
	| 'required'
	| 'email'
	| 'url'
	| 'phone'
	| 'date_range'
	| 'number_range'
	| 'regex'
	| 'custom';

// Validation rule configuration
export interface ValidationRule {
	type: ValidationRuleType;
	// For required: just a flag
	required?: boolean;
	// For email/url/phone: just type
	// For date_range: min and max dates
	dateMin?: string;
	dateMax?: string;
	// For number_range: min and max numbers
	numberMin?: number;
	numberMax?: number;
	// For regex: pattern and error message
	regexPattern?: string;
	regexErrorMessage?: string;
	// For custom: JavaScript expression
	customExpression?: string;
	customErrorMessage?: string;
}

// Validation result for a single cell
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

// Validation result for entire column
export interface ColumnValidationResult {
	columnName: string;
	totalRows: number;
	validRows: number;
	invalidRows: number;
	errors: Array<{
		rowIndex: number;
		value: string;
		errors: string[];
	}>;
}

/**
 * Validate a single value against validation rules
 */
export function validateValue(
	value: string,
	rules: ValidationRule[],
	row: Record<string, string>,
	rowIndex: number
): ValidationResult {
	const errors: string[] = [];

	for (const rule of rules) {
		const error = validateRule(value, rule, row, rowIndex);
		if (error) {
			errors.push(error);
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate a single rule
 */
function validateRule(
	value: string,
	rule: ValidationRule,
	row: Record<string, string>,
	rowIndex: number
): string | null {
	switch (rule.type) {
		case 'required':
			if (rule.required && (!value || value.trim() === '')) {
				return 'This field is required';
			}
			break;

		case 'email':
			if (value && !isValidEmail(value)) {
				return 'Invalid email format';
			}
			break;

		case 'url':
			if (value && !isValidUrl(value)) {
				return 'Invalid URL format';
			}
			break;

		case 'phone':
			if (value && !isValidPhone(value)) {
				return 'Invalid phone number format';
			}
			break;

		case 'date_range':
			if (value) {
				const date = parseDate(value);
				if (!date) {
					return 'Invalid date format';
				}
				if (rule.dateMin && date < parseDate(rule.dateMin)!) {
					return `Date must be after ${rule.dateMin}`;
				}
				if (rule.dateMax && date > parseDate(rule.dateMax)!) {
					return `Date must be before ${rule.dateMax}`;
				}
			}
			break;

		case 'number_range':
			if (value) {
				const num = parseFloat(value);
				if (isNaN(num)) {
					return 'Invalid number format';
				}
				if (rule.numberMin !== undefined && num < rule.numberMin) {
					return `Number must be at least ${rule.numberMin}`;
				}
				if (rule.numberMax !== undefined && num > rule.numberMax) {
					return `Number must be at most ${rule.numberMax}`;
				}
			}
			break;

		case 'regex':
			if (value && rule.regexPattern) {
				try {
					const regex = new RegExp(rule.regexPattern);
					if (!regex.test(value)) {
						return rule.regexErrorMessage || 'Value does not match required pattern';
					}
				} catch {
					return 'Invalid regex pattern';
				}
			}
			break;

		case 'custom':
			if (value && rule.customExpression) {
				try {
					const result = evaluateValidationExpression(rule.customExpression, value, row, rowIndex);
					if (!result) {
						return rule.customErrorMessage || 'Custom validation failed';
					}
				} catch (error) {
					return `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
				}
			}
			break;
	}

	return null;
}

/**
 * Validate an entire column
 */
export function validateColumn(
	columnName: string,
	mapping: ColumnMapping,
	dataFile: ParsedCSV,
	rules: ValidationRule[]
): ColumnValidationResult {
	const errors: Array<{ rowIndex: number; value: string; errors: string[] }> = [];
	let validRows = 0;
	let invalidRows = 0;

	if (!mapping.sourceColumn) {
		return {
			columnName,
			totalRows: dataFile.rowCount,
			validRows: 0,
			invalidRows: 0,
			errors: []
		};
	}

	for (let i = 0; i < dataFile.rows.length; i++) {
		const row = dataFile.rows[i];
		const value = row[mapping.sourceColumn] ?? '';

		const result = validateValue(value, rules, row, i);

		if (result.isValid) {
			validRows++;
		} else {
			invalidRows++;
			errors.push({
				rowIndex: i,
				value,
				errors: result.errors
			});
		}
	}

	return {
		columnName,
		totalRows: dataFile.rowCount,
		validRows,
		invalidRows,
		errors
	};
}

/**
 * Validate all columns in mappings
 */
export function validateAllColumns(
	mappings: ColumnMapping[],
	dataFile: ParsedCSV,
	validationRules: Map<string, ValidationRule[]>
): Map<string, ColumnValidationResult> {
	const results = new Map<string, ColumnValidationResult>();

	for (const mapping of mappings) {
		if (mapping.action === 'map' && mapping.sourceColumn) {
			const rules = validationRules.get(mapping.targetColumn) ?? [];
			const result = validateColumn(mapping.targetColumn, mapping, dataFile, rules);
			results.set(mapping.targetColumn, result);
		}
	}

	return results;
}

// Helper functions

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

function isValidPhone(phone: string): boolean {
	// Basic phone validation - accepts various formats
	const phoneRegex = /^[\d\s\-\+\(\)]+$/;
	const digitsOnly = phone.replace(/\D/g, '');
	return phoneRegex.test(phone) && digitsOnly.length >= 10;
}

function parseDate(dateString: string): Date | null {
	// Try common date formats
	const formats = [
		/^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
		/^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
		/^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
		/^\d{2}-\d{2}-\d{4}$/ // MM-DD-YYYY or DD-MM-YYYY
	];

	for (const format of formats) {
		if (format.test(dateString)) {
			const date = new Date(dateString);
			if (!isNaN(date.getTime())) {
				return date;
			}
		}
	}

	return null;
}

/**
 * Evaluate a custom validation expression
 * SECURITY NOTE: In production, this should use a sandboxed environment
 */
function evaluateValidationExpression(
	expression: string,
	value: string,
	row: Record<string, string>,
	rowIndex: number
): boolean {
	try {
		const context = {
			value,
			row,
			rowIndex,
			// Helper functions
			isEmpty: (v: string) => !v || v.trim() === '',
			isNumber: (v: string) => !isNaN(parseFloat(v)),
			isEmail: (v: string) => isValidEmail(v),
			isUrl: (v: string) => isValidUrl(v),
			// Math functions
			Math,
			// String functions
			String,
			// Number functions
			Number,
			parseInt,
			parseFloat
		};

		// Replace common patterns
		let safeExpression = expression
			.replace(/\bvalue\b/g, 'context.value')
			.replace(/\brow\[['"]([^'"]+)['"]\]/g, (match, col) => `context.row['${col}']`);

		// Wrap in function that uses context
		const func = new Function('context', `return ${safeExpression}`);

		const result = func(context);
		return Boolean(result);
	} catch (error) {
		console.error('Validation expression error:', error);
		return false;
	}
}

/**
 * Get default validation rules for a column type
 */
export function getDefaultValidationRules(columnType: string): ValidationRule[] {
	switch (columnType) {
		case 'email':
			return [{ type: 'email' }];
		case 'url':
			return [{ type: 'url' }];
		case 'phone':
			return [{ type: 'phone' }];
		case 'date':
			return []; // No default rules for dates
		case 'number':
			return []; // No default rules for numbers
		default:
			return [];
	}
}
