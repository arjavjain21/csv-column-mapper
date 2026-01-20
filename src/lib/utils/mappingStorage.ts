import type { SavedMapping, ColumnMapping, ParsedCSV, MAPPINGS_STORAGE_KEY } from '$lib/types';

const STORAGE_KEY = 'csv-column-mapper-saved-mappings';
const VERSION = '1.0';

/**
 * Generate a unique key for a file pair
 */
export function getFilePairKey(schemaFilename: string, dataFilename: string): string {
	return `${schemaFilename}|||${dataFilename}`;
}

/**
 * Generate a hash of column names for more precise matching
 */
export function getColumnHash(columns: string[]): string {
	return columns.sort().join('|');
}

/**
 * Save mappings to localStorage
 */
export function saveMappings(
	schemaFile: ParsedCSV,
	dataFile: ParsedCSV,
	mappings: ColumnMapping[],
	name?: string
): void {
	const savedMappings = loadAllSavedMappings();

	const schemaColumnNames = schemaFile.columns.map((c) => c.name);
	const dataColumnNames = dataFile.columns.map((c) => c.name);

	const key = getFilePairKey(schemaFile.filename, dataFile.filename);
	const entry: SavedMapping = {
		version: VERSION,
		name: name || `${schemaFile.filename} → ${dataFile.filename}`,
		createdAt: new Date().toISOString(),
		schemaColumns: schemaColumnNames,
		dataColumns: dataColumnNames,
		mappings
	};

	savedMappings.set(key, entry);

	// Also save by column hash for auto-matching different files with same structure
	const schemaHash = getColumnHash(schemaColumnNames);
	const dataHash = getColumnHash(dataColumnNames);
	const hashKey = `${schemaHash}|||${dataHash}`;
	savedMappings.set(hashKey, entry);

	localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedMappings.entries()]));
}

/**
 * Load all saved mappings from localStorage
 */
export function loadAllSavedMappings(): Map<string, SavedMapping> {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return new Map();

	try {
		const entries = JSON.parse(data);
		return new Map(entries);
	} catch {
		return new Map();
	}
}

/**
 * Load mappings for a specific file pair
 */
export function loadMappings(
	schemaFile: ParsedCSV,
	dataFile: ParsedCSV
): ColumnMapping[] | null {
	const savedMappings = loadAllSavedMappings();

	// Try exact filename match first
	const exactKey = getFilePairKey(schemaFile.filename, dataFile.filename);
	let entry = savedMappings.get(exactKey);

	// If not found, try column hash match
	if (!entry) {
		const schemaColumnNames = schemaFile.columns.map((c) => c.name);
		const dataColumnNames = dataFile.columns.map((c) => c.name);
		const schemaHash = getColumnHash(schemaColumnNames);
		const dataHash = getColumnHash(dataColumnNames);
		const hashKey = `${schemaHash}|||${dataHash}`;
		entry = savedMappings.get(hashKey);
	}

	if (entry) {
		// Validate that the mappings match current columns
		const schemaColumnNames = schemaFile.columns.map((c) => c.name);
		const dataColumnNames = dataFile.columns.map((c) => c.name);

		// Check if all target columns exist
		const validMappings = entry.mappings.filter(
			(m) => schemaColumnNames.includes(m.targetColumn) && (!m.sourceColumn || dataColumnNames.includes(m.sourceColumn))
		);

		// Add mappings for any new schema columns that weren't in the saved mapping
		const missingColumns = schemaColumnNames.filter(
			(col) => !validMappings.some((m) => m.targetColumn === col)
		);

		return [
			...validMappings,
			...missingColumns.map(
				(col) =>
					({
						targetColumn: col,
						action: 'map',
						sourceColumn: undefined
					}) as ColumnMapping
			)
		];
	}

	return null;
}

/**
 * Export mappings as a JSON file
 */
export function exportMappings(
	schemaFile: ParsedCSV,
	dataFile: ParsedCSV,
	mappings: ColumnMapping[]
): void {
	console.log('exportMappings called with:', { schemaFile, dataFile, mappings });

	const schemaColumnNames = schemaFile.columns.map((c) => c.name);
	const dataColumnNames = dataFile.columns.map((c) => c.name);

	const savedMapping: SavedMapping = {
		version: VERSION,
		name: `${schemaFile.filename} → ${dataFile.filename}`,
		createdAt: new Date().toISOString(),
		schemaColumns: schemaColumnNames,
		dataColumns: dataColumnNames,
		mappings
	};

	console.log('Creating blob for:', savedMapping);

	const blob = new Blob([JSON.stringify(savedMapping, null, 2)], {
		type: 'application/json'
	});
	const url = URL.createObjectURL(blob);

	console.log('Blob URL created:', url);

	const link = document.createElement('a');
	link.href = url;
	link.download = `mapping-${schemaFile.filename}-to-${dataFile.filename}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);

	console.log('Download triggered');
}

/**
 * Import mappings from a JSON file
 */
export async function importMappings(
	file: File
): Promise<SavedMapping | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);

				// Validate the structure
				if (
					!data.version ||
					!Array.isArray(data.schemaColumns) ||
					!Array.isArray(data.dataColumns) ||
					!Array.isArray(data.mappings)
				) {
					reject(new Error('Invalid mapping file format'));
					return;
				}

				resolve(data as SavedMapping);
			} catch (error) {
				reject(new Error('Failed to parse mapping file'));
			}
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsText(file);
	});
}

/**
 * Get all saved mapping names for display
 */
export function getSavedMappingList(): Array<{ key: string; name: string; createdAt: string }> {
	const savedMappings = loadAllSavedMappings();
	return Array.from(savedMappings.entries())
		.filter(([key]) => !key.includes('|||')) // Filter out hash-based keys
		.map(([key, value]) => ({
			key,
			name: value.name,
			createdAt: value.createdAt
		}))
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Delete a saved mapping
 */
export function deleteSavedMapping(key: string): void {
	const savedMappings = loadAllSavedMappings();
	savedMappings.delete(key);
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedMappings.entries()]));
}

/**
 * Clear all saved mappings
 */
export function clearAllSavedMappings(): void {
	localStorage.removeItem(STORAGE_KEY);
}
