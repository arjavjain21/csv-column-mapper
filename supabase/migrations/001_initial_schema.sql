-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
-- Extends Supabase auth.users with additional user data
CREATE TABLE public.user_profiles (
	id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	email TEXT NOT NULL UNIQUE,
	full_name TEXT,
	avatar_url TEXT,
	subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'lifetime')),
	stripe_customer_id TEXT UNIQUE,
	stripe_subscription_id TEXT UNIQUE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MAPPINGS TABLE
-- ============================================
-- Stores user's CSV column mappings
CREATE TABLE public.mappings (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	name TEXT NOT NULL,
	description TEXT,
	source_columns JSONB NOT NULL, -- Array of column names
	target_columns JSONB NOT NULL, -- Array of column names
	column_mappings JSONB NOT NULL, -- Map of source -> target
	transformations JSONB, -- Column transformations
	validation_rules JSONB, -- Validation rules
	is_template BOOLEAN DEFAULT FALSE,
	team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster queries
CREATE INDEX idx_mappings_user_id ON public.mappings(user_id);
CREATE INDEX idx_mappings_team_id ON public.mappings(team_id);
CREATE INDEX idx_mappings_is_template ON public.mappings(is_template);

-- ============================================
-- MAPPING VERSIONS TABLE
-- ============================================
-- Track version history for undo/redo
CREATE TABLE public.mapping_versions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mapping_id UUID NOT NULL REFERENCES public.mappings(id) ON DELETE CASCADE,
	version INTEGER NOT NULL,
	column_mappings JSONB NOT NULL,
	transformations JSONB,
	validation_rules JSONB,
	created_by UUID NOT NULL REFERENCES auth.users(id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

	UNIQUE (mapping_id, version)
);

CREATE INDEX idx_mapping_versions_mapping_id ON public.mapping_versions(mapping_id);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
-- Public template library
CREATE TABLE public.templates (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	category TEXT NOT NULL, -- e.g., "shopify", "quickbooks", "salesforce"
	source_columns JSONB NOT NULL,
	target_columns JSONB NOT NULL,
	column_mappings JSONB NOT NULL,
	transformations JSONB,
	validation_rules JSONB,
	is_official BOOLEAN DEFAULT FALSE,
	created_by UUID NOT NULL REFERENCES auth.users(id),
	usage_count INTEGER DEFAULT 0,
	rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_official ON public.templates(is_official);

-- ============================================
-- TEAMS TABLE
-- ============================================
-- For Business tier collaboration
CREATE TABLE public.teams (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
-- Team membership with roles
CREATE TABLE public.team_members (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
	joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

	UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapping_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
-- Templates table is public-read, auth-write
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
	FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
	FOR UPDATE USING (auth.uid() = id);

-- Mappings Policies
CREATE POLICY "Users can view own mappings" ON public.mappings
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mappings" ON public.mappings
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mappings" ON public.mappings
	FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mappings" ON public.mappings
	FOR DELETE USING (auth.uid() = user_id);

-- Mappings can be accessed by team members
CREATE POLICY "Team members can view team mappings" ON public.mappings
	FOR SELECT USING (
		EXISTS (
			SELECT 1 FROM public.team_members
			WHERE team_members.team_id = mappings.team_id
			AND team_members.user_id = auth.uid()
		)
	);

-- Mapping Versions Policies
CREATE POLICY "Users can view versions of own mappings" ON public.mapping_versions
	FOR SELECT USING (
		EXISTS (
			SELECT 1 FROM public.mappings
			WHERE mappings.id = mapping_versions.mapping_id
			AND mappings.user_id = auth.uid()
		)
	);

CREATE POLICY "Users can insert versions for own mappings" ON public.mapping_versions
	FOR INSERT WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.mappings
			WHERE mappings.id = mapping_versions.mapping_id
			AND mappings.user_id = auth.uid()
		)
	);

-- Templates Policies (public read, authenticated write)
CREATE POLICY "Anyone can view templates" ON public.templates
	FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create templates" ON public.templates
	FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON public.templates
	FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates" ON public.templates
	FOR DELETE USING (auth.uid() = created_by);

-- Teams Policies
CREATE POLICY "Team owners can view team" ON public.teams
	FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can create teams" ON public.teams
	FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update team" ON public.teams
	FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete team" ON public.teams
	FOR DELETE USING (auth.uid() = owner_id);

-- Team Members Policies
CREATE POLICY "Team members can view team membership" ON public.team_members
	FOR SELECT USING (
		auth.uid() = user_id
		OR EXISTS (
			SELECT 1 FROM public.teams
			WHERE teams.id = team_members.team_id
			AND teams.owner_id = auth.uid()
		)
	);

CREATE POLICY "Team owners can add members" ON public.team_members
	FOR INSERT WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.teams
			WHERE teams.id = team_members.team_id
			AND teams.owner_id = auth.uid()
		)
	);

CREATE POLICY "Team owners can update member roles" ON public.team_members
	FOR UPDATE USING (
		EXISTS (
			SELECT 1 FROM public.teams
			WHERE teams.id = team_members.team_id
			AND teams.owner_id = auth.uid()
		)
	);

CREATE POLICY "Team owners can remove members" ON public.team_members
	FOR DELETE USING (
		EXISTS (
			SELECT 1 FROM public.teams
			WHERE teams.id = team_members.team_id
			AND teams.owner_id = auth.uid()
		)
	);

CREATE POLICY "Users can remove themselves from teams" ON public.team_members
	FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
	VALUES (
		NEW.id,
		NEW.email,
		NEW.raw_user_meta_data->>'full_name',
		NEW.raw_user_meta_data->>'avatar_url'
	);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
	BEFORE UPDATE ON public.user_profiles
	FOR EACH ROW
	EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mappings_updated_at
	BEFORE UPDATE ON public.mappings
	FOR EACH ROW
	EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
	BEFORE UPDATE ON public.templates
	FOR EACH ROW
	EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment template usage count
CREATE OR REPLACE FUNCTION public.increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE public.templates
	SET usage_count = usage_count + 1
	WHERE id = NEW.template_id;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has a specific subscription tier
CREATE OR REPLACE FUNCTION public.has_subscription_tier(user_id UUID, required_tier TEXT)
RETURNS BOOLEAN AS $$
BEGIN
	RETURN EXISTS (
		SELECT 1 FROM public.user_profiles
		WHERE id = user_id
		AND (
			subscription_tier = required_tier
			OR subscription_tier = 'lifetime'
			OR (required_tier = 'pro' AND subscription_tier = 'business')
			OR (required_tier = 'free')
		)
	);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id UUID)
RETURNS TEXT AS $$
BEGIN
	RETURN (SELECT subscription_tier FROM public.user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE TEMPLATES (OPTIONAL)
-- ============================================

-- Insert some official templates (you can customize these)
INSERT INTO public.templates (name, description, category, source_columns, target_columns, column_mappings, is_official, created_by)
VALUES
	(
		'Shopify Product Import',
		'Map your CSV to Shopify product import format',
		'shopify',
		'["product_title", "sku", "price", "quantity", "description"]'::jsonb,
		'["Handle", "Title", "Variant SKU", "Variant Price", "Variant Inventory Qty", "Body HTML"]'::jsonb,
		'{"product_title": "Title", "sku": "Variant SKU", "price": "Variant Price", "quantity": "Variant Inventory Qty", "description": "Body HTML"}'::jsonb,
		true,
		(SELECT id FROM auth.users LIMIT 1) -- Will be updated with actual user ID
	),
	(
		'QuickBooks Transactions',
		'Import transactions into QuickBooks',
		'quickbooks',
		'["date", "description", "amount", "payee"]'::jsonb,
		'["Date", "Description", "Amount", "Name"]'::jsonb,
		'{"date": "Date", "description": "Description", "amount": "Amount", "payee": "Name"}'::jsonb,
		true,
		(SELECT id FROM auth.users LIMIT 1)
	);

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant select on tables for authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant necessary permissions for authenticated users
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant select on templates to anonymous users
GRANT SELECT ON public.templates TO anon;
