/**
 * Advanced export format utilities
 * Supports Excel, JSON, Parquet, and database INSERT formats
 */

import Papa from 'papaparse';
import type { ParsedCSV, ColumnMapping } from '$lib/types';
import { generateOutputCSV } from './csvGenerator';

export type ExportFormat = 'csv' | 'excel' | 'json' | 'parquet' | 'sql';

export interface ExportOptions {
	format: ExportFormat;
	schemaFile: ParsedCSV;
	dataFile: ParsedCSV;
	mappings: ColumnMapping[];
	// Excel options
	excelSheetName?: string;
	// SQL options
	sqlTableName?: string;
	sqlDialect?: 'postgresql' | 'mysql' | 'sqlite';
}

/**
 * Export data in the specified format
 */
export async function exportData(options: ExportOptions): Promise<{
	data: string | Blob;
	filename: string;
	mimeType: string;
}> {
	switch (options.format) {
		case 'csv':
			return exportCSV(options);
		case 'excel':
			return exportExcel(options);
		case 'json':
			return exportJSON(options);
		case 'parquet':
			return exportParquet(options);
		case 'sql':
			return exportSQL(options);
		default:
			throw new Error(`Unsupported export format: ${options.format}`);
	}
}

/**
 * Export as CSV (default)
 */
function exportCSV(options: ExportOptions): {
	data: string;
	filename: string;
	mimeType: string;
} {
	const result = generateOutputCSV(options.schemaFile, options.dataFile, options.mappings);
	return {
		data: result.data,
		filename: result.filename,
		mimeType: 'text/csv'
	};
}

/**
 * Export as JSON
 */
function exportJSON(options: ExportOptions): {
	data: string;
	filename: string;
	mimeType: string;
} {
	const result = generateOutputCSV(options.schemaFile, options.dataFile, options.mappings);
	const csv = Papa.parse(result.data, { header: true });
	const json = JSON.stringify(csv.data, null, 2);
	
	const timestamp = new Date().toISOString().slice(0, 10);
	return {
		data: json,
		filename: `mapped_output_${timestamp}.json`,
		mimeType: 'application/json'
	};
}

/**
 * Export as Excel (.xlsx)
 * Note: Requires xlsx library - install with: npm install xlsx
 */
async function exportExcel(options: ExportOptions): Promise<{
	data: Blob;
	filename: string;
	mimeType: string;
}> {
	try {
		// Dynamic import to avoid bundling if not used
		const XLSX = await import('xlsx');
		
		const result = generateOutputCSV(options.schemaFile, options.dataFile, options.mappings);
		const csv = Papa.parse(result.data, { header: true });
		
		// Create workbook
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(csv.data as Record<string, string>[]);
		
		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, options.excelSheetName || 'Sheet1');
		
		// Generate Excel file
		const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
		const blob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		
		const timestamp = new Date().toISOString().slice(0, 10);
		return {
			data: blob,
			filename: `mapped_output_${timestamp}.xlsx`,
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
	} catch (error) {
		throw new Error('Excel export requires xlsx library. Install with: npm install xlsx');
	}
}

/**
 * Export as Parquet
 * Note: Parquet export requires server-side processing
 * This is a placeholder - implement via API endpoint for production
 */
async function exportParquet(options: ExportOptions): Promise<{
	data: Blob;
	filename: string;
	mimeType: string;
}> {
	// Parquet export requires server-side processing
	// For now, throw informative error
	throw new Error('Parquet export requires server-side processing. Please use the /api/export endpoint or export as CSV/Excel instead.');
}

/**
 * Export as SQL INSERT statements
 */
function exportSQL(options: ExportOptions): {
	data: string;
	filename: string;
	mimeType: string;
} {
	const result = generateOutputCSV(options.schemaFile, options.dataFile, options.mappings);
	const csv = Papa.parse(result.data, { header: true });
	
	const tableName = options.sqlTableName || 'mapped_data';
	const dialect = options.sqlDialect || 'postgresql';
	
	let sql = '';
	
	// Generate INSERT statements
	for (const row of csv.data as Record<string, string>[]) {
		const columns = Object.keys(row);
		const values = columns.map((col) => {
			const value = row[col];
			if (value === null || value === undefined || value === '') {
				return 'NULL';
			}
			// Escape single quotes
			const escaped = value.replace(/'/g, "''");
			return `'${escaped}'`;
		});
		
		if (dialect === 'postgresql') {
			sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
		} else if (dialect === 'mysql') {
			sql += `INSERT INTO \`${tableName}\` (${columns.map((c) => `\`${c}\``).join(', ')}) VALUES (${values.join(', ')});\n`;
		} else {
			// SQLite
			sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
		}
	}
	
	const timestamp = new Date().toISOString().slice(0, 10);
	return {
		data: sql,
		filename: `mapped_output_${timestamp}.sql`,
		mimeType: 'text/sql'
	};
}

/**
 * Download exported file
 */
export function downloadExport(
	data: string | Blob,
	filename: string,
	mimeType: string
): void {
	const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data;
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
