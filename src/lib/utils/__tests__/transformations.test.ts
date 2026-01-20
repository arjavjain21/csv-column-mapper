import { describe, it, expect } from 'vitest';
import { applyTransformation, getDefaultTransformation } from '../transformations';
import type { Transformation, ParsedCSV } from '$lib/types';

describe('Transformations', () => {
	const mockDataFile: ParsedCSV = {
		filename: 'test.csv',
		columns: [],
		rows: [],
		rowCount: 0
	};

	const mockRow: Record<string, string> = {};

	describe('applyTransformation', () => {
		it('should apply uppercase transformation', () => {
			const transformation: Transformation = { type: 'uppercase' };
			const result = applyTransformation('hello world', transformation, mockRow, mockDataFile);
			expect(result).toBe('HELLO WORLD');
		});

		it('should apply lowercase transformation', () => {
			const transformation: Transformation = { type: 'lowercase' };
			const result = applyTransformation('HELLO WORLD', transformation, mockRow, mockDataFile);
			expect(result).toBe('hello world');
		});

		it('should apply trim transformation', () => {
			const transformation: Transformation = { type: 'trim' };
			const result = applyTransformation('  hello world  ', transformation, mockRow, mockDataFile);
			expect(result).toBe('hello world');
		});

		it('should apply split transformation', () => {
			const transformation: Transformation = {
				type: 'split',
				splitDelimiter: ' ',
				splitIndex: 0
			};
			const result = applyTransformation('John Doe', transformation, mockRow, mockDataFile);
			expect(result).toBe('John');
		});

		it('should apply concatenate transformation', () => {
			const transformation: Transformation = {
				type: 'concatenate',
				concatenateColumns: ['first', 'last'],
				concatenateSeparator: ' '
			};
			const row = { first: 'John', last: 'Doe', other: 'ignored' };
			const result = applyTransformation('', transformation, row, mockDataFile);
			expect(result).toBe('John Doe');
		});

		it('should apply regex replace transformation', () => {
			const transformation: Transformation = {
				type: 'regex_replace',
				regexPattern: '\\d+',
				regexReplacement: 'XXX',
				regexFlags: 'g'
			};
			const result = applyTransformation('Phone: 555-1234', transformation, mockRow, mockDataFile);
			expect(result).toBe('Phone: XXX-XXX');
		});

		it('should return original value for none transformation', () => {
			const transformation: Transformation = { type: 'none' };
			const result = applyTransformation('test', transformation, mockRow, mockDataFile);
			expect(result).toBe('test');
		});

		it('should handle empty values', () => {
			const transformation: Transformation = { type: 'uppercase' };
			const result = applyTransformation('', transformation, mockRow, mockDataFile);
			expect(result).toBe('');
		});
	});

	describe('getDefaultTransformation', () => {
		it('should return default split transformation', () => {
			const result = getDefaultTransformation('split');
			expect(result.type).toBe('split');
			expect(result.splitDelimiter).toBe(' ');
			expect(result.splitIndex).toBe(0);
		});

		it('should return default concatenate transformation', () => {
			const result = getDefaultTransformation('concatenate');
			expect(result.type).toBe('concatenate');
			expect(result.concatenateColumns).toEqual([]);
			expect(result.concatenateSeparator).toBe(' ');
		});

		it('should return default regex_replace transformation', () => {
			const result = getDefaultTransformation('regex_replace');
			expect(result.type).toBe('regex_replace');
			expect(result.regexPattern).toBe('');
			expect(result.regexReplacement).toBe('');
		});
	});
});
