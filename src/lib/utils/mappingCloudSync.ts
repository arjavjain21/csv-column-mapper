import { supabase } from './supabaseClient';
import type { Column } from '../types';

export interface CloudMapping {
	id?: string;
	user_id: string;
	name: string;
	description?: string;
	source_columns: Column[];
	target_columns: Column[];
	column_mappings: Record<string, string>;
	transformations?: any;
	validation_rules?: any;
	is_template?: boolean;
	team_id?: string;
	created_at?: string;
	updated_at?: string;
	last_synced_at?: string;
}

/**
 * Save mapping to cloud
 */
export async function saveMappingToCloud(
	userId: string,
	mapping: Omit<CloudMapping, 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at'>
): Promise<{ success: boolean; data?: CloudMapping; error?: string }> {
	try {
		const mappingData = {
			user_id: userId,
			name: mapping.name,
			description: mapping.description || null,
			source_columns: mapping.source_columns as any, // JSONB
			target_columns: mapping.target_columns as any, // JSONB
			column_mappings: mapping.column_mappings as any, // JSONB
			transformations: mapping.transformations || null,
			validation_rules: mapping.validation_rules || null,
			is_template: mapping.is_template || false,
			team_id: mapping.team_id || null
		};

		// Check if mapping has an ID (update) or not (create)
		if (mapping.id) {
			const { data, error } = await supabase
				.from('mappings')
				.update({
					...mappingData,
					updated_at: new Date().toISOString(),
					last_synced_at: new Date().toISOString()
				})
				.eq('id', mapping.id)
				.select()
				.single();

			if (error) throw error;
			return { success: true, data };
		} else {
			const { data, error } = await supabase
				.from('mappings')
				.insert({
					...mappingData,
					last_synced_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) throw error;
			return { success: true, data };
		}
	} catch (error) {
		console.error('Save mapping error:', error);
		return { success: false, error: 'Failed to save mapping to cloud' };
	}
}

/**
 * Load all mappings for a user
 */
export async function loadUserMappings(userId: string): Promise<{
	success: boolean;
	data?: CloudMapping[];
	error?: string;
}> {
	try {
		const { data, error } = await supabase
			.from('mappings')
			.select('*')
			.eq('user_id', userId)
			.is('is_template', false) // Don't load templates
			.order('updated_at', { ascending: false });

		if (error) throw error;
		return { success: true, data: data as CloudMapping[] };
	} catch (error) {
		console.error('Load mappings error:', error);
		return { success: false, error: 'Failed to load mappings from cloud' };
	}
}

/**
 * Load a single mapping by ID
 */
export async function loadMappingById(
	mappingId: string
): Promise<{ success: boolean; data?: CloudMapping; error?: string }> {
	try {
		const { data, error } = await supabase
			.from('mappings')
			.select('*')
			.eq('id', mappingId)
			.single();

		if (error) throw error;
		return { success: true, data: data as CloudMapping };
	} catch (error) {
		console.error('Load mapping error:', error);
		return { success: false, error: 'Failed to load mapping' };
	}
}

/**
 * Delete mapping from cloud
 */
export async function deleteMappingFromCloud(
	mappingId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase.from('mappings').delete().eq('id', mappingId);

		if (error) throw error;
		return { success: true };
	} catch (error) {
		console.error('Delete mapping error:', error);
		return { success: false, error: 'Failed to delete mapping' };
	}
}

/**
 * Load templates from the library
 */
export async function loadTemplates(category?: string): Promise<{
	success: boolean;
	data?: CloudMapping[];
	error?: string;
}> {
	try {
		let query = supabase
			.from('templates')
			.select('*')
			.order('usage_count', { ascending: false })
			.order('rating', { ascending: false });

		if (category) {
			query = query.eq('category', category);
		}

		const { data, error } = await query;

		if (error) throw error;
		return { success: true, data: data as CloudMapping[] };
	} catch (error) {
		console.error('Load templates error:', error);
		return { success: false, error: 'Failed to load templates' };
	}
}

/**
 * Save a mapping as a template
 */
export async function saveAsTemplate(
	userId: string,
	mapping: CloudMapping,
	category: string,
	isOfficial: boolean = false
): Promise<{ success: boolean; data?: CloudMapping; error?: string }> {
	try {
		const { data, error } = await supabase
			.from('templates')
			.insert({
				name: mapping.name,
				description: mapping.description || '',
				category,
				source_columns: mapping.source_columns as any,
				target_columns: mapping.target_columns as any,
				column_mappings: mapping.column_mappings as any,
				transformations: mapping.transformations || null,
				validation_rules: mapping.validation_rules || null,
				is_official: isOfficial,
				created_by: userId
			})
			.select()
			.single();

		if (error) throw error;
		return { success: true, data: data as CloudMapping };
	} catch (error) {
		console.error('Save template error:', error);
		return { success: false, error: 'Failed to save template' };
	}
}

/**
 * Update last synced timestamp
 */
export async function updateSyncTimestamp(
	mappingId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase
			.from('mappings')
			.update({ last_synced_at: new Date().toISOString() })
			.eq('id', mappingId);

		if (error) throw error;
		return { success: true };
	} catch (error) {
		console.error('Update sync timestamp error:', error);
		return { success: false, error: 'Failed to update sync timestamp' };
	}
}
