import Papa from 'papaparse';
import type { ParsedCSV, ColumnMapping, OutputSummary } from '$lib/types';
import { applyTransformation } from './transformations';

/**
 * Generate output CSV based on mapping configuration
 */
export function generateOutputCSV(
	schemaFile: ParsedCSV,
	dataFile: ParsedCSV,
	mappings: ColumnMapping[]
): { data: string; filename: string; summary: OutputSummary } {
	// Build the output column order
	const outputColumns = buildOutputColumns(schemaFile, mappings);

	// Track summary statistics
	const summary: OutputSummary = {
		totalRows: dataFile.rowCount,
		totalColumns: outputColumns.length,
		mappedColumns: 0,
		newColumns: 0,
		ignoredColumns: 0,
		columnsWithEmptyValues: [],
		warnings: []
	};

	// Build a lookup map for source columns
	const sourceLookup = new Map<string, string[]>();
	for (const col of dataFile.columns) {
		sourceLookup.set(col.name, dataFile.rows.map((row) => row[col.name] ?? ''));
	}

	// Check for columns with high empty percentage
	for (const mapping of mappings) {
		if (mapping.action === 'map' && mapping.sourceColumn) {
			const sourceCol = dataFile.columns.find((c) => c.name === mapping.sourceColumn);
			if (sourceCol && sourceCol.isEmptyPercent > 50) {
				summary.columnsWithEmptyValues.push(mapping.targetColumn);
				summary.warnings.push(
					`Column "${mapping.targetColumn}" has ${sourceCol.isEmptyPercent}% empty values`
				);
			}
		}
	}

	// Count mapping types
	for (const mapping of mappings) {
		if (mapping.action === 'map') summary.mappedColumns++;
		else if (mapping.action === 'new') summary.newColumns++;
		else if (mapping.action === 'ignore') summary.ignoredColumns++;
	}

	// Transform each row
	const outputRows = dataFile.rows.map((dataRow) => {
		const row: Record<string, string> = {};

		for (const col of outputColumns) {
			const mapping = mappings.find((m) => m.targetColumn === col);

			if (!mapping) {
				// Not in mappings - shouldn't happen, but handle gracefully
				row[col] = '';
			} else if (mapping.action === 'ignore') {
				// This shouldn't be in outputColumns, but just in case
				row[col] = '';
			} else if (mapping.action === 'map' && mapping.sourceColumn) {
				// Map from source column
				let value = dataRow[mapping.sourceColumn] ?? '';
				// Apply transformation if configured
				if (mapping.transformation) {
					value = applyTransformation(value, mapping.transformation, dataRow, dataFile);
				}
				row[col] = value;
			} else if (mapping.action === 'new' && mapping.sourceColumn) {
				// Add as new column from source
				let value = dataRow[mapping.sourceColumn] ?? '';
				// Apply transformation if configured
				if (mapping.transformation) {
					value = applyTransformation(value, mapping.transformation, dataRow, dataFile);
				}
				row[col] = value;
			} else {
				// No mapping - empty value
				row[col] = '';
			}
		}

		return row;
	});

	// Generate CSV string
	const csv = Papa.unparse(outputRows, {
		quotes: true, // Quote all fields to handle special characters
		delimiter: ',',
		header: true,
		newline: '\n'
	});

	// Generate filename
	const timestamp = new Date().toISOString().slice(0, 10);
	const filename = `mapped_output_${timestamp}.csv`;

	return {
		data: csv,
		filename,
		summary
	};
}

/**
 * Build the list of output columns in order
 * ALL schema columns are included (even ignored ones will be in output with empty values)
 */
function buildOutputColumns(schemaFile: ParsedCSV, mappings: ColumnMapping[]): string[] {
	const outputColumns: string[] = [];
	const newColumns: string[] = [];

	// First, add ALL schema columns in order (including ignored ones)
	for (const col of schemaFile.columns) {
		const mapping = mappings.find((m) => m.targetColumn === col.name);

		if (mapping?.action === 'new') {
			// New columns go to the end
			newColumns.push(col.name);
		} else {
			// All other columns (mapped, ignored, or unmapped) in schema order
			outputColumns.push(col.name);
		}
	}

	// Append any "add as new" columns at the end
	return [...outputColumns, ...newColumns];
}

/**
 * Trigger a browser download of the CSV file
 */
export function downloadCSV(csvData: string, filename: string): void {
	const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

/**
 * Generate a preview of the output (first 10 rows)
 */
export function generatePreview(
	schemaFile: ParsedCSV,
	dataFile: ParsedCSV,
	mappings: ColumnMapping[]
): { headers: string[]; rows: Record<string, string>[] } {
	const outputColumns = buildOutputColumns(schemaFile, mappings);
	const previewRows = dataFile.rows.slice(0, 10);

	const preview = previewRows.map((dataRow) => {
		const row: Record<string, string> = {};

		for (const col of outputColumns) {
			const mapping = mappings.find((m) => m.targetColumn === col);

			if (!mapping || mapping.action === 'ignore') {
				row[col] = '';
			} else if (mapping.action === 'map' && mapping.sourceColumn) {
				let value = dataRow[mapping.sourceColumn] ?? '';
				// Apply transformation if configured
				if (mapping.transformation) {
					value = applyTransformation(value, mapping.transformation, dataRow, dataFile);
				}
				row[col] = value;
			} else if (mapping.action === 'new' && mapping.sourceColumn) {
				let value = dataRow[mapping.sourceColumn] ?? '';
				// Apply transformation if configured
				if (mapping.transformation) {
					value = applyTransformation(value, mapping.transformation, dataRow, dataFile);
				}
				row[col] = value;
			} else {
				row[col] = '';
			}
		}

		return row;
	});

	return {
		headers: outputColumns,
		rows: preview
	};
}
