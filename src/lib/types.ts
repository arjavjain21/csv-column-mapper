// Column data types we can detect
export type ColumnType =
	| 'string'
	| 'number'
	| 'email'
	| 'phone'
	| 'url'
	| 'date'
	| 'boolean'
	| 'unknown';

// Mapping action for a target column
export type MappingAction = 'map' | 'ignore' | 'new';

// App workflow steps
export type AppStep = 'upload' | 'mapping' | 'summary';

// A single column from either CSV file
export interface Column {
	name: string; // Original header name
	cleanName: string; // Whitespace-normalized name
	type: ColumnType;
	samples: string[]; // 3-5 sample non-empty values
	emptyCount: number; // Count of empty/null values
	isEmptyPercent: number; // Percentage of empty values
	index: number; // Original column index
}

// Transformation types
export type TransformationType =
	| 'none'
	| 'split'
	| 'concatenate'
	| 'uppercase'
	| 'lowercase'
	| 'trim'
	| 'regex_replace'
	| 'date_format'
	| 'number_format'
	| 'custom_formula';

// Transformation configuration
export interface Transformation {
	type: TransformationType;
	// For split: delimiter and which part (0-indexed)
	splitDelimiter?: string;
	splitIndex?: number;
	// For concatenate: array of source columns to join
	concatenateColumns?: string[];
	concatenateSeparator?: string;
	// For regex_replace: pattern and replacement
	regexPattern?: string;
	regexReplacement?: string;
	regexFlags?: string;
	// For date_format: input and output format
	dateInputFormat?: string;
	dateOutputFormat?: string;
	// For number_format: decimal places, thousands separator
	numberDecimals?: number;
	numberThousandsSeparator?: string;
	numberDecimalSeparator?: string;
	// For custom_formula: JavaScript expression
	customFormula?: string;
}

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
	required?: boolean;
	dateMin?: string;
	dateMax?: string;
	numberMin?: number;
	numberMax?: number;
	regexPattern?: string;
	regexErrorMessage?: string;
	customExpression?: string;
	customErrorMessage?: string;
}

// Mapping configuration for one target column
export interface ColumnMapping {
	targetColumn: string; // Schema column name
	action: MappingAction;
	sourceColumn?: string; // If 'map' - which source column
	addAsNew?: boolean; // If true, add as new column at end
	transformation?: Transformation; // Optional transformation to apply
	validationRules?: ValidationRule[]; // Optional validation rules
}

// Parsed CSV data
export interface ParsedCSV {
	filename: string;
	columns: Column[];
	rows: Record<string, string>[];
	rowCount: number;
}

// App state managed by the store
export interface MappingState {
	step: AppStep;
	schemaFile: ParsedCSV | null;
	dataFile: ParsedCSV | null;
	mappings: ColumnMapping[];
	addUnmappedAsNew: boolean;
}

// Summary statistics for the output
export interface OutputSummary {
	totalRows: number;
	totalColumns: number;
	mappedColumns: number;
	newColumns: number;
	ignoredColumns: number;
	columnsWithEmptyValues: string[];
	warnings: string[];
}

// Saved mapping configuration for export/import
export interface SavedMapping {
	version: string;
	name: string;
	createdAt: string;
	schemaColumns: string[]; // Column names from schema file
	dataColumns: string[]; // Column names from data file
	mappings: ColumnMapping[];
}

// Storage key for localStorage
export const MAPPINGS_STORAGE_KEY = 'csv-column-mapper-saved-mappings';
