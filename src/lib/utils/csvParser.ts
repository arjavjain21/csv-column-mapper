import Papa from 'papaparse';
import type { ParsedCSV, Column } from '$lib/types';
import { detectColumnType } from './typeDetector';

/**
 * Parse a CSV file and return structured data
 */
export async function parseCSVFile(file: File): Promise<ParsedCSV> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: false, // Changed to false - we'll handle empty rows ourselves
			transformHeader: (header: string) => cleanColumnName(header),
			transform: (value: string) => value.trim(),
			complete: (results) => {
				try {
					const parsed = processParsedData(file.name, results as Papa.ParseResult<Record<string, string>>);
					resolve(parsed);
				} catch (error) {
					reject(error);
				}
			},
			error: (error) => {
				reject(new Error(`Failed to parse CSV: ${error.message}`));
			}
		});
	});
}

/**
 * Clean a column name - remove BOM, trim whitespace, normalize
 */
function cleanColumnName(name: string): string {
	// Remove BOM if present
	let cleaned = name.replace(/^\uFEFF/, '');
	// Trim whitespace
	cleaned = cleaned.trim();
	// If empty after cleaning, use a default
	return cleaned || 'unnamed_column';
}

/**
 * Process parsed data into our structured format
 */
function processParsedData(
	filename: string,
	results: Papa.ParseResult<Record<string, string>>
): ParsedCSV {
	// Get data rows, filtering out completely empty rows
	let rows = (results.data as Record<string, string>[]) || [];

	// Filter out rows where all values are empty
	rows = rows.filter(
		(row) => Object.values(row).some((value) => value && value.trim().length > 0)
	);

	// Get column names from meta.fields (provided by PapaParse) or from first row
	let columnNames: string[] = [];

	if (results.meta && results.meta.fields && Array.isArray(results.meta.fields)) {
		// Use the field names from PapaParse's metadata
		columnNames = results.meta.fields.filter((f) => f !== null && f !== undefined);
	} else if (rows.length > 0) {
		// Fall back to extracting from first row
		columnNames = Object.keys(rows[0]);
	} else {
		throw new Error('CSV file has no columns');
	}

	const rowCount = rows.length;

	// Build column info for each column
	const columns: Column[] = columnNames.map((name, index) => {
		// Extract all values for this column
		const values = rows.map((row) => row[name] ?? '');

		// Count empty values
		const emptyCount = values.filter((v) => v === '' || v === null || v === undefined).length;
		const emptyPercent = rowCount > 0 ? (emptyCount / rowCount) * 100 : 100;

		// Get sample values (first 3-5 non-empty values)
		const samples = values.filter((v) => v.trim().length > 0).slice(0, 5);

		// Detect column type
		const type = rowCount > 0 ? detectColumnType(values) : 'string';

		return {
			name,
			cleanName: cleanColumnName(name),
			type,
			samples,
			emptyCount,
			isEmptyPercent: Math.round(emptyPercent * 10) / 10,
			index
		};
	});

	return {
		filename,
		columns,
		rows,
		rowCount
	};
}

/**
 * Validate that a file is a CSV file
 */
export function isValidCSVFile(file: File): boolean {
	const validExtensions = ['.csv', '.tsv', '.txt'];
	const validMimeTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];

	const hasValidExtension = validExtensions.some((ext) =>
		file.name.toLowerCase().endsWith(ext)
	);
	const hasValidMimeType = validMimeTypes.includes(file.type);

	return hasValidExtension || hasValidMimeType;
}

/**
 * Get a readable file size
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get row count from file (quick check without full parse)
 * Uses a rough estimate based on file size
 */
export function estimateRowCount(file: File): number {
	// Rough estimate: assume ~100 bytes per row on average
	return Math.ceil(file.size / 100);
}
