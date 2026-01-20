import { describe, it, expect } from 'vitest';
import { validateValue, getDefaultValidationRules } from '../validation';
import type { ValidationRule, ParsedCSV, ColumnMapping } from '$lib/types';

describe('Validation', () => {
	const mockRow: Record<string, string> = {};
	const mockDataFile: ParsedCSV = {
		filename: 'test.csv',
		columns: [],
		rows: [],
		rowCount: 0
	};

	describe('validateValue', () => {
		it('should validate required fields', () => {
			const rules: ValidationRule[] = [{ type: 'required', required: true }];
			const result = validateValue('', rules, mockRow, 0);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('This field is required');
		});

		it('should pass required validation for non-empty values', () => {
			const rules: ValidationRule[] = [{ type: 'required', required: true }];
			const result = validateValue('test', rules, mockRow, 0);
			expect(result.isValid).toBe(true);
		});

		it('should validate email format', () => {
			const rules: ValidationRule[] = [{ type: 'email' }];
			const invalidResult = validateValue('not-an-email', rules, mockRow, 0);
			expect(invalidResult.isValid).toBe(false);

			const validResult = validateValue('test@example.com', rules, mockRow, 0);
			expect(validResult.isValid).toBe(true);
		});

		it('should validate URL format', () => {
			const rules: ValidationRule[] = [{ type: 'url' }];
			const invalidResult = validateValue('not-a-url', rules, mockRow, 0);
			expect(invalidResult.isValid).toBe(false);

			const validResult = validateValue('https://example.com', rules, mockRow, 0);
			expect(validResult.isValid).toBe(true);
		});

		it('should validate number range', () => {
			const rules: ValidationRule[] = [
				{ type: 'number_range', numberMin: 10, numberMax: 100 }
			];
			const tooLow = validateValue('5', rules, mockRow, 0);
			expect(tooLow.isValid).toBe(false);

			const tooHigh = validateValue('150', rules, mockRow, 0);
			expect(tooHigh.isValid).toBe(false);

			const valid = validateValue('50', rules, mockRow, 0);
			expect(valid.isValid).toBe(true);
		});

		it('should validate regex pattern', () => {
			const rules: ValidationRule[] = [
				{ type: 'regex', regexPattern: '^[A-Z]{2}\\d{4}$' }
			];
			const invalid = validateValue('ab1234', rules, mockRow, 0);
			expect(invalid.isValid).toBe(false);

			const valid = validateValue('AB1234', rules, mockRow, 0);
			expect(valid.isValid).toBe(true);
		});

		it('should handle multiple validation rules', () => {
			const rules: ValidationRule[] = [
				{ type: 'required', required: true },
				{ type: 'email' }
			];
			const result = validateValue('test@example.com', rules, mockRow, 0);
			expect(result.isValid).toBe(true);

			const invalidResult = validateValue('', rules, mockRow, 0);
			expect(invalidResult.isValid).toBe(false);
			expect(invalidResult.errors.length).toBeGreaterThan(0);
		});
	});

	describe('getDefaultValidationRules', () => {
		it('should return email rules for email column type', () => {
			const rules = getDefaultValidationRules('email');
			expect(rules).toHaveLength(1);
			expect(rules[0].type).toBe('email');
		});

		it('should return url rules for url column type', () => {
			const rules = getDefaultValidationRules('url');
			expect(rules).toHaveLength(1);
			expect(rules[0].type).toBe('url');
		});

		it('should return empty array for string type', () => {
			const rules = getDefaultValidationRules('string');
			expect(rules).toHaveLength(0);
		});
	});
});
