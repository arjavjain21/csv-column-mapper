import { writable, derived, get } from 'svelte/store';
import type { MappingState, ColumnMapping, ParsedCSV, AppStep, SavedMapping } from '$lib/types';
import {
	saveMappings,
	loadMappings,
	exportMappings,
	importMappings,
	getSavedMappingList,
	deleteSavedMapping,
	clearAllSavedMappings
} from '$lib/utils/mappingStorage';

// Create the initial state
function createInitialMappingState(): MappingState {
	return {
		step: 'upload',
		schemaFile: null,
		dataFile: null,
		mappings: [],
		addUnmappedAsNew: false
	};
}

// Main writable store
export const mappingStore = writable<MappingState>(createInitialMappingState());

// Derived store for current step
export const currentStep = derived(mappingStore, (state) => state.step);

// Derived store for schema columns
export const schemaColumns = derived(mappingStore, (state) =>
	state.schemaFile?.columns ?? []
);

// Derived store for data columns
export const dataColumns = derived(mappingStore, (state) => state.dataFile?.columns ?? []);

// Derived store for whether we can proceed to mapping
export const canProceedToMapping = derived(mappingStore, (state) => {
	return state.schemaFile !== null && state.dataFile !== null;
});

// Derived store for whether we can proceed to summary
export const canProceedToSummary = derived(mappingStore, (state) => {
	return state.mappings.length > 0 && state.step === 'mapping';
});

// Derived store for whether we have any mappings to export
export const hasMappings = derived(mappingStore, (state) => {
	return state.mappings.some((m) => m.sourceColumn);
});

// Actions for the store
export const mappingActions = {
	/**
	 * Set the schema (target) file
	 */
	setSchemaFile: (file: ParsedCSV | null) => {
		mappingStore.update((state) => {
			const newState = {
				...state,
				schemaFile: file,
				// Reset mappings when schema changes
				mappings: file ? initializeMappings(file) : []
			};

			// Try to load saved mappings if both files are present
			if (file && state.dataFile) {
				const saved = loadMappings(file, state.dataFile);
				if (saved) {
					newState.mappings = saved;
				}
			}

			return newState;
		});
	},

	/**
	 * Set the data (source) file
	 */
	setDataFile: (file: ParsedCSV | null) => {
		mappingStore.update((state) => {
			const newState = {
				...state,
				dataFile: file
			};

			// Try to load saved mappings if both files are present
			if (file && state.schemaFile) {
				const saved = loadMappings(state.schemaFile, file);
				if (saved) {
					newState.mappings = saved;
				}
			}

			return newState;
		});
	},

	/**
	 * Navigate to a specific step
	 */
	setStep: (step: AppStep) => {
		mappingStore.update((state) => ({
			...state,
			step
		}));
	},

	/**
	 * Go back to upload step
	 */
	goToUpload: () => {
		mappingStore.update((state) => ({
			...state,
			step: 'upload'
		}));
	},

	/**
	 * Go to mapping step
	 */
	goToMapping: () => {
		mappingStore.update((state) => ({
			...state,
			step: 'mapping'
		}));
	},

	/**
	 * Go to summary step
	 */
	goToSummary: () => {
		mappingStore.update((state) => {
			// Auto-save mappings before going to summary
			if (state.schemaFile && state.dataFile) {
				saveMappings(state.schemaFile, state.dataFile, state.mappings);
			}
			return {
				...state,
				step: 'summary'
			};
		});
	},

	/**
	 * Update a single mapping
	 */
	updateMapping: (targetColumn: string, mapping: Partial<ColumnMapping>) => {
		mappingStore.update((state) => {
			const existingIndex = state.mappings.findIndex((m) => m.targetColumn === targetColumn);

			if (existingIndex >= 0) {
				// Update existing mapping
				const newMappings = [...state.mappings];
				newMappings[existingIndex] = { ...newMappings[existingIndex], ...mapping };
				const newState = { ...state, mappings: newMappings };

				// Auto-save to localStorage
				if (state.schemaFile && state.dataFile) {
					saveMappings(state.schemaFile, state.dataFile, newMappings);
				}

				return newState;
			} else {
				// Add new mapping
				const newMappings = [
					...state.mappings,
					{ targetColumn, action: 'map', ...mapping } as ColumnMapping
				];
				const newState = {
					...state,
					mappings: newMappings
				};

				// Auto-save to localStorage
				if (state.schemaFile && state.dataFile) {
					saveMappings(state.schemaFile, state.dataFile, newMappings);
				}

				return newState;
			}
		});
	},

	/**
	 * Toggle the "add unmapped as new" setting
	 */
	toggleAddUnmapped: () => {
		mappingStore.update((state) => ({
			...state,
			addUnmappedAsNew: !state.addUnmappedAsNew
		}));
	},

	/**
	 * Set the "add unmapped as new" setting
	 */
	setAddUnmapped: (value: boolean) => {
		mappingStore.update((state) => ({
			...state,
			addUnmappedAsNew: value
		}));
	},

	/**
	 * Save current mappings to localStorage with a name
	 */
	saveCurrentMappings: (name?: string) => {
		const state = get(mappingStore);
		if (state.schemaFile && state.dataFile) {
			saveMappings(state.schemaFile, state.dataFile, state.mappings, name);
		}
	},

	/**
	 * Export current mappings as JSON file
	 */
	exportCurrentMappings: () => {
		const state = get(mappingStore);
		if (state.schemaFile && state.dataFile) {
			exportMappings(state.schemaFile, state.dataFile, state.mappings);
		}
	},

	/**
	 * Import mappings from a JSON file
	 */
	importMappingsFromFile: async (file: File): Promise<void> => {
		const saved = await importMappings(file);
		if (saved) {
			mappingStore.update((state) => ({
				...state,
				mappings: saved.mappings
			}));
		}
	},

	/**
	 * Get list of all saved mappings
	 */
	getSavedMappings: () => {
		return getSavedMappingList();
	},

	/**
	 * Delete a saved mapping
	 */
	deleteSavedMapping: (key: string) => {
		deleteSavedMapping(key);
	},

	/**
	 * Clear all saved mappings
	 */
	clearSavedMappings: () => {
		clearAllSavedMappings();
	},

	/**
	 * Reset everything to initial state
	 */
	reset: () => {
		mappingStore.set(createInitialMappingState());
	}
};

/**
 * Initialize mappings for a schema file
 * All columns start with "map" action (but no source column selected yet)
 */
function initializeMappings(schemaFile: ParsedCSV): ColumnMapping[] {
	return schemaFile.columns.map(
		(col) =>
			({
				targetColumn: col.name,
				action: 'map' as const,
				sourceColumn: undefined
			}) as ColumnMapping
	);
}

/**
 * Get a mapping for a specific target column
 */
export function getMappingForColumn(targetColumn: string): ColumnMapping | undefined {
	const state = get(mappingStore);
	return state.mappings.find((m) => m.targetColumn === targetColumn);
}

/**
 * Check if a source column is already mapped
 */
export function isSourceColumnMapped(sourceColumn: string): boolean {
	const state = get(mappingStore);
	return state.mappings.some((m) => m.sourceColumn === sourceColumn && m.action === 'map');
}

/**
 * Get all available source columns (not yet mapped, or already mapped for one-to-many)
 */
export function getAvailableSourceColumns(): string[] {
	const state = get(mappingStore);
	return state.dataFile?.columns.map((c) => c.name) ?? [];
}


