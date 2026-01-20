import { describe, it, expect } from 'vitest';
import { detectColumnType } from '../typeDetector';

describe('CSV Parser Utilities', () => {
	describe('detectColumnType', () => {
		it('should detect email columns', () => {
			const emails = ['test@example.com', 'user@domain.com', 'admin@site.org'];
			expect(detectColumnType(emails)).toBe('email');
		});

		it('should detect number columns', () => {
			const numbers = ['123', '456', '789', '1000'];
			expect(detectColumnType(numbers)).toBe('number');
		});

		it('should detect date columns', () => {
			const dates = ['2024-01-01', '2024-02-15', '2024-12-31'];
			expect(detectColumnType(dates)).toBe('date');
		});

		it('should detect URL columns', () => {
			const urls = ['https://example.com', 'http://test.org', 'https://site.net'];
			expect(detectColumnType(urls)).toBe('url');
		});

		it('should detect phone columns', () => {
			const phones = ['+1-555-123-4567', '(555) 987-6543', '555-111-2222'];
			expect(detectColumnType(phones)).toBe('phone');
		});

		it('should default to string for mixed content', () => {
			const mixed = ['text', '123', 'email@test.com', 'more text'];
			expect(detectColumnType(mixed)).toBe('string');
		});

		it('should handle empty arrays', () => {
			expect(detectColumnType([])).toBe('unknown');
		});
	});
});
