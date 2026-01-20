// Supabase Database Types
// These types match the database schema we'll create

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			// User profiles table (extends Supabase auth.users)
			user_profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					avatar_url: string | null;
					subscription_tier: 'free' | 'pro' | 'business' | 'lifetime';
					stripe_customer_id: string | null;
					stripe_subscription_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					avatar_url?: string | null;
					subscription_tier?: 'free' | 'pro' | 'business' | 'lifetime';
					stripe_customer_id?: string | null;
					stripe_subscription_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					avatar_url?: string | null;
					subscription_tier?: 'free' | 'pro' | 'business' | 'lifetime';
					stripe_customer_id?: string | null;
					stripe_subscription_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			// CSV mappings table
			mappings: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					description: string | null;
					source_columns: Json; // Array of column names
					target_columns: Json; // Array of column names
					column_mappings: Json; // Map of source -> target
					transformations: Json | null; // Column transformations
					validation_rules: Json | null; // Validation rules
					is_template: boolean;
					team_id: string | null;
					created_at: string;
					updated_at: string;
					last_synced_at: string | null;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					description?: string | null;
					source_columns: Json;
					target_columns: Json;
					column_mappings: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					is_template?: boolean;
					team_id?: string | null;
					created_at?: string;
					updated_at?: string;
					last_synced_at?: string | null;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					description?: string | null;
					source_columns?: Json;
					target_columns?: Json;
					column_mappings?: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					is_template?: boolean;
					team_id?: string | null;
					created_at?: string;
					updated_at?: string;
					last_synced_at?: string | null;
				};
			};
			// Mapping version history
			mapping_versions: {
				Row: {
					id: string;
					mapping_id: string;
					version: number;
					column_mappings: Json;
					transformations: Json | null;
					validation_rules: Json | null;
					created_by: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					mapping_id: string;
					version: number;
					column_mappings: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					created_by: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					mapping_id?: string;
					version?: number;
					column_mappings?: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					created_by?: string;
					created_at?: string;
				};
			};
			// Template library (public and user-contributed)
			templates: {
				Row: {
					id: string;
					name: string;
					description: string;
					category: string; // e.g., "shopify", "quickbooks", "salesforce"
					source_columns: Json;
					target_columns: Json;
					column_mappings: Json;
					transformations: Json | null;
					validation_rules: Json | null;
					is_official: boolean;
					created_by: string;
					usage_count: number;
					rating: number | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description: string;
					category: string;
					source_columns: Json;
					target_columns: Json;
					column_mappings: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					is_official?: boolean;
					created_by: string;
					usage_count?: number;
					rating?: number | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					description?: string;
					category?: string;
					source_columns?: Json;
					target_columns?: Json;
					column_mappings?: Json;
					transformations?: Json | null;
					validation_rules?: Json | null;
					is_official?: boolean;
					created_by?: string;
					usage_count?: number;
					rating?: number | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			// Teams for Business tier
			teams: {
				Row: {
					id: string;
					name: string;
					owner_id: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					owner_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					owner_id?: string;
					created_at?: string;
				};
			};
			// Team members with roles
			team_members: {
				Row: {
					id: string;
					team_id: string;
					user_id: string;
					role: 'owner' | 'editor' | 'viewer';
					joined_at: string;
				};
				Insert: {
					id?: string;
					team_id: string;
					user_id: string;
					role?: 'owner' | 'editor' | 'viewer';
					joined_at?: string;
				};
				Update: {
					id?: string;
					team_id?: string;
					user_id?: string;
					role?: 'owner' | 'editor' | 'viewer';
					joined_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
