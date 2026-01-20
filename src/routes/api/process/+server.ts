/**
 * POST /api/process - Process CSV with a mapping
 * This endpoint allows programmatic CSV processing via API
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canProcessFile, recordUsage } from '$lib/services/quotaService';
import { getPlan } from '$lib/config/plans';
import Papa from 'papaparse';
import { generateOutputCSV } from '$lib/utils/csvGenerator';
import type { ParsedCSV, ColumnMapping } from '$lib/types';
import { detectColumnType } from '$lib/utils/typeDetector';

interface ProcessRequest {
	mappingId?: string;
	mapping?: {
		sourceColumns: string[];
		targetColumns: string[];
		columnMappings: Record<string, string>;
		transformations?: Record<string, any>;
		validationRules?: Record<string, any>;
	};
	csvData: string; // Base64 encoded CSV or raw CSV string
	csvFormat?: 'base64' | 'raw';
}

/**
 * POST /api/process
 * Process CSV data with a mapping configuration
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.safeGetSession();

	if (!session.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body: ProcessRequest = await request.json();

		// Validate required fields
		if (!body.csvData) {
			return json({ error: 'CSV data is required' }, { status: 400 });
		}

		// Decode CSV data
		let csvString: string;
		if (body.csvFormat === 'base64') {
			csvString = Buffer.from(body.csvData, 'base64').toString('utf-8');
		} else {
			csvString = body.csvData;
		}

		// Parse CSV
		const parsed = Papa.parse(csvString, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim()
		});

		if (parsed.errors.length > 0) {
			return json(
				{
					error: 'CSV parsing failed',
					details: parsed.errors.map((e) => ({
						message: e.message,
						row: e.row,
						type: e.type
					}))
				},
				{ status: 400 }
			);
		}

		const rows = parsed.data as Record<string, string>[];
		const headers = parsed.meta.fields || [];

		// Detect column types
		const columns = headers.map((name, index) => {
			const samples = rows
				.slice(0, 5)
				.map((row) => row[name])
				.filter((v) => v && v.trim() !== '');
			const emptyCount = rows.filter((row) => !row[name] || row[name].trim() === '').length;
			
			return {
				name,
				cleanName: name.trim(),
				type: detectColumnType(samples),
				samples: samples.slice(0, 5),
				emptyCount,
				isEmptyPercent: rows.length > 0 ? (emptyCount / rows.length) * 100 : 0,
				index
			};
		});

		// Create ParsedCSV object
		const dataFile: ParsedCSV = {
			filename: 'uploaded.csv',
			columns,
			rows,
			rowCount: rows.length
		};

		// Check quota
		const quotaCheck = await canProcessFile(session.user.id, rows.length, csvString.length);

		if (!quotaCheck.allowed) {
			const plan = getPlan(session.user.subscription_tier);
			return json(
				{
					error: {
						code: quotaCheck.errorCode || 'QUOTA_EXCEEDED',
						message: 'Processing quota exceeded',
						details: {
							quotaType: 'File Processing',
							current: quotaCheck.currentUsage || 0,
							limit: quotaCheck.limit || 0,
							remaining: quotaCheck.remaining || 0,
							planId: plan.id
						}
					}
				},
				{ status: 429 }
			);
		}

		// Get mapping configuration
		let mappings: ColumnMapping[] = [];
		let schemaFile: ParsedCSV | null = null;

		if (body.mappingId) {
			// Load mapping from database
			const { data: mapping, error } = await locals.supabase
				.from('mappings')
				.select('*')
				.eq('id', body.mappingId)
				.eq('user_id', session.user.id)
				.single();

			if (error || !mapping) {
				return json({ error: 'Mapping not found' }, { status: 404 });
			}

			// Convert stored mapping to ColumnMapping format
			const targetColumns = mapping.target_columns || [];
			schemaFile = {
				filename: 'schema.csv',
				columns: targetColumns.map((name: string, index: number) => ({
					name,
					cleanName: name.trim(),
					type: 'string' as const,
					samples: [],
					emptyCount: 0,
					isEmptyPercent: 0,
					index
				})),
				rows: [],
				rowCount: 0
			};

			mappings = targetColumns.map((targetCol: string) => {
				const sourceCol = mapping.column_mappings?.[targetCol];
				return {
					targetColumn: targetCol,
					action: sourceCol ? 'map' : 'ignore',
					sourceColumn: sourceCol,
					transformation: mapping.transformations?.[targetCol],
					validationRules: mapping.validation_rules?.[targetCol]
				};
			});
		} else if (body.mapping) {
			// Use provided mapping
			const targetColumns = body.mapping.targetColumns || [];
			schemaFile = {
				filename: 'schema.csv',
				columns: targetColumns.map((name: string, index: number) => ({
					name,
					cleanName: name.trim(),
					type: 'string' as const,
					samples: [],
					emptyCount: 0,
					isEmptyPercent: 0,
					index
				})),
				rows: [],
				rowCount: 0
			};

			mappings = targetColumns.map((targetCol: string) => {
				const sourceCol = body.mapping!.column_mappings[targetCol];
				return {
					targetColumn: targetCol,
					action: sourceCol ? 'map' : 'ignore',
					sourceColumn: sourceCol,
					transformation: body.mapping!.transformations?.[targetCol],
					validationRules: body.mapping!.validationRules?.[targetCol]
				};
			});
		} else {
			return json({ error: 'Either mappingId or mapping configuration is required' }, { status: 400 });
		}

		if (!schemaFile) {
			return json({ error: 'Invalid mapping configuration' }, { status: 400 });
		}

		// Generate output CSV
		const result = generateOutputCSV(schemaFile, dataFile, mappings);

		// Record usage
		await recordUsage(session.user.id, 'file_processed', {
			rowsCount: rows.length,
			fileSizeBytes: csvString.length,
			mappingId: body.mappingId
		});

		// Return result
		return json({
			success: true,
			data: {
				csv: result.data,
				filename: result.filename,
				summary: {
					totalRows: result.summary.totalRows,
					totalColumns: result.summary.totalColumns,
					mappedColumns: result.summary.mappedColumns,
					warnings: result.summary.warnings
				}
			}
		});
	} catch (error) {
		console.error('Error in POST /api/process:', error);
		return json(
			{
				error: 'Internal server error',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
