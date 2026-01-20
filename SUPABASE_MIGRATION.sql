-- ============================================
-- CSV COLUMN MAPPER - SUPABASE DATABASE MIGRATION
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/qxytijsztnxcnxwkwtjf/sql/new
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
-- Extends Supabase auth.users with additional user data
CREATE TABLE IF NOT EXISTS public.user_profiles (
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
CREATE TABLE IF NOT EXISTS public.mappings (
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
CREATE INDEX IF NOT EXISTS idx_mappings_user_id ON public.mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_mappings_team_id ON public.mappings(team_id);
CREATE INDEX IF NOT EXISTS idx_mappings_is_template ON public.mappings(is_template);

-- ============================================
-- MAPPING VERSIONS TABLE
-- ============================================
-- Track version history for undo/redo
CREATE TABLE IF NOT EXISTS public.mapping_versions (
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

CREATE INDEX IF NOT EXISTS idx_mapping_versions_mapping_id ON public.mapping_versions(mapping_id);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
-- Public template library
CREATE TABLE IF NOT EXISTS public.templates (
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

CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_official ON public.templates(is_official);

-- ============================================
-- TEAMS TABLE
-- ============================================
-- For Business tier collaboration
CREATE TABLE IF NOT EXISTS public.teams (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
-- Team membership with roles
CREATE TABLE IF NOT EXISTS public.team_members (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
	joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

	UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- ============================================
-- SUBSCRIPTION PERIODS TABLE
-- ============================================
-- Tracks billing periods for each user (subscription anniversary model)
CREATE TABLE IF NOT EXISTS public.subscription_periods (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	period_start DATE NOT NULL,
	period_end DATE NOT NULL,

	-- Starting counts for this period
	starting_rows_analyzed INTEGER DEFAULT 0,
	starting_rows_processed INTEGER DEFAULT 0,
	starting_files_analyzed INTEGER DEFAULT 0,
	starting_files_processed INTEGER DEFAULT 0,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

	UNIQUE (user_id, period_start)
);

-- Index for efficient period lookups
CREATE INDEX IF NOT EXISTS idx_subscription_periods_user_id ON public.subscription_periods(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_periods_dates ON public.subscription_periods(period_start, period_end);

-- ============================================
-- USAGE RECORDS TABLE
-- ============================================
-- Individual usage events for tracking and analytics
CREATE TABLE IF NOT EXISTS public.usage_records (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	subscription_period_id UUID REFERENCES public.subscription_periods(id) ON DELETE SET NULL,

	-- What action was performed
	record_type TEXT NOT NULL CHECK (record_type IN ('file_analyzed', 'file_processed', 'mapping_created', 'mapping_deleted')),

	-- Usage metrics
	rows_count INTEGER NOT NULL DEFAULT 0,
	file_size_bytes INTEGER NOT NULL DEFAULT 0,

	-- Additional metadata
	metadata JSONB, -- Store mapping_id, file_name, etc.

	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON public.usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_period_id ON public.usage_records(subscription_period_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_type_created ON public.usage_records(record_type, created_at);
CREATE INDEX IF NOT EXISTS idx_usage_records_created_at ON public.usage_records(created_at);

-- ============================================
-- SALES LEADS TABLE
-- ============================================
-- Track Enterprise "Contact Sales" inquiries
CREATE TABLE IF NOT EXISTS public.sales_leads (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

	name TEXT NOT NULL,
	email TEXT NOT NULL,
	company TEXT,
	use_case TEXT,
	expected_monthly_rows INTEGER,
	message TEXT,

	status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),

	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON public.sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_created_at ON public.sales_leads(created_at);

-- ============================================
-- UPDATE USER_PROFILES FOR BILLING CYCLE
-- ============================================
ALTER TABLE public.user_profiles
	DROP CONSTRAINT IF EXISTS user_profiles_subscription_tier_check;

ALTER TABLE public.user_profiles
	ADD CONSTRAINT user_profiles_subscription_tier_check
	CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise', 'lifetime'));

-- Add billing cycle fields to user_profiles
ALTER TABLE public.user_profiles
	ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP WITH TIME ZONE,
	ADD COLUMN IF NOT EXISTS billing_cycle_anchor INTEGER DEFAULT 1,
	ADD COLUMN IF NOT EXISTS billing_cycle_start DATE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapping_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can insert own mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can update own mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can delete own mappings" ON public.mappings;
DROP POLICY IF EXISTS "Team members can view team mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can view versions of own mappings" ON public.mapping_versions;
DROP POLICY IF EXISTS "Users can insert versions for own mappings" ON public.mapping_versions;
DROP POLICY IF EXISTS "Anyone can view templates" ON public.templates;
DROP POLICY IF EXISTS "Authenticated users can create templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.templates;
DROP POLICY IF EXISTS "Team owners can view team" ON public.teams;
DROP POLICY IF EXISTS "Team owners can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team owners can update team" ON public.teams;
DROP POLICY IF EXISTS "Team owners can delete team" ON public.teams;
DROP POLICY IF EXISTS "Team members can view team membership" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can add members" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can update member roles" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON public.team_members;
DROP POLICY IF EXISTS "Users can remove themselves from teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can view own subscription periods" ON public.subscription_periods;
DROP POLICY IF EXISTS "Users can view own usage records" ON public.usage_records;
DROP POLICY IF EXISTS "Users can insert own usage records" ON public.usage_records;
DROP POLICY IF EXISTS "Users can view own sales leads" ON public.sales_leads;
DROP POLICY IF EXISTS "Users can create sales leads" ON public.sales_leads;
DROP POLICY IF EXISTS "Users can update own sales leads" ON public.sales_leads;

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

-- Subscription Periods Policies
CREATE POLICY "Users can view own subscription periods" ON public.subscription_periods
	FOR SELECT USING (auth.uid() = user_id);

-- Usage Records Policies
CREATE POLICY "Users can view own usage records" ON public.usage_records
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage records" ON public.usage_records
	FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sales Leads Policies
CREATE POLICY "Users can view own sales leads" ON public.sales_leads
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sales leads" ON public.sales_leads
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales leads" ON public.sales_leads
	FOR UPDATE USING (auth.uid() = user_id);

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
	)
	ON CONFLICT (id) DO NOTHING;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

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

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_mappings_updated_at ON public.mappings;
DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
DROP TRIGGER IF EXISTS update_sales_leads_updated_at ON public.sales_leads;

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

CREATE TRIGGER update_sales_leads_updated_at
	BEFORE UPDATE ON public.sales_leads
	FOR EACH ROW
	EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get or create current subscription period for a user
CREATE OR REPLACE FUNCTION public.get_or_create_subscription_period(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
	v_period_id UUID;
	v_billing_start DATE;
	v_billing_end DATE;
	v_profile RECORD;
BEGIN
	-- Get user's billing cycle info
	SELECT
		billing_cycle_anchor,
		COALESCE(subscription_started_at::DATE, created_at::DATE) as joined_date
	INTO v_profile
	FROM public.user_profiles
	WHERE id = p_user_id;

	-- Calculate current billing period
	v_billing_start := (
		DATE_TRUNC('month',
			COALESCE(v_profile.subscription_started_at::DATE, v_profile.joined_date)
		) +
		((v_profile.billing_cycle_anchor - 1) || ' days')::INTERVAL
	);

	-- If calculated date is in future, use previous month
	IF v_billing_start > CURRENT_DATE THEN
		v_billing_start := v_billing_start - INTERVAL '1 month';
	END IF;

	-- Calculate end date (30 days later)
	v_billing_end := v_billing_start + INTERVAL '30 days';

	-- Try to get existing period
	SELECT id INTO v_period_id
	FROM public.subscription_periods
	WHERE user_id = p_user_id
		AND period_start = v_billing_start;

	-- If doesn't exist, create it
	IF v_period_id IS NULL THEN
		INSERT INTO public.subscription_periods (
			user_id,
			period_start,
			period_end,
			starting_rows_analyzed,
			starting_rows_processed,
			starting_files_analyzed,
			starting_files_processed
		)
		VALUES (
			p_user_id,
			v_billing_start,
			v_billing_end,
			COALESCE((
				SELECT SUM(rows_count)
				FROM public.usage_records
				WHERE user_id = p_user_id
				AND created_at < v_billing_start
			), 0),
			0,
			0,
			0
		)
		RETURNING id INTO v_period_id;
	END IF;

	RETURN v_period_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current usage status
CREATE OR REPLACE FUNCTION public.get_user_quota_status(p_user_id UUID)
RETURNS TABLE (
	plan_tier TEXT,
	file_size_limit BIGINT,
	rows_per_file_limit BIGINT,
	rows_analyzed_per_month_limit BIGINT,
	rows_processed_per_month_limit BIGINT,
	saved_mappings_limit BIGINT,

	rows_analyzed_current BIGINT,
	rows_processed_current BIGINT,
	saved_mappings_current BIGINT,

	rows_analyzed_remaining BIGINT,
	rows_processed_remaining BIGINT,
	saved_mappings_remaining BIGINT,

	period_start DATE,
	period_end DATE
) AS $$
BEGIN
	RETURN QUERY
	WITH current_period AS (
		SELECT * FROM public.get_or_create_subscription_period(p_user_id) as period_id
	),
	period_data AS (
		SELECT id, period_start, period_end
		FROM public.subscription_periods
		WHERE user_id = p_user_id
		ORDER BY period_start DESC
		LIMIT 1
	),
	usage AS (
		SELECT
			COALESCE(SUM(CASE WHEN record_type = 'file_analyzed' THEN rows_count ELSE 0 END), 0) as rows_analyzed,
			COALESCE(SUM(CASE WHEN record_type = 'file_processed' THEN rows_count ELSE 0 END), 0) as rows_processed
		FROM public.usage_records
		WHERE user_id = p_user_id
		AND subscription_period_id = (SELECT id FROM period_data LIMIT 1)
	),
	saved_mappings AS (
		SELECT COUNT(*)::BIGINT as count
		FROM public.mappings
		WHERE user_id = p_user_id
	)
	SELECT
		up.subscription_tier as plan_tier,
		CASE up.subscription_tier
			WHEN 'free' THEN 5242880 -- 5 MB
			WHEN 'pro' THEN 52428800 -- 50 MB
			WHEN 'business' THEN 262144000 -- 250 MB
			WHEN 'enterprise' THEN 2147483648 -- 2 GB
			ELSE 5242880
		END as file_size_limit,

		CASE up.subscription_tier
			WHEN 'free' THEN 1000
			WHEN 'pro' THEN 50000
			WHEN 'business' THEN 250000
			WHEN 'enterprise' THEN 5000000
			ELSE 1000
		END as rows_per_file_limit,

		CASE up.subscription_tier
			WHEN 'free' THEN 5000
			WHEN 'pro' THEN 100000
			WHEN 'business' THEN 1000000
			WHEN 'enterprise' THEN 0 -- Unlimited
			ELSE 5000
		END as rows_analyzed_per_month_limit,

		CASE up.subscription_tier
			WHEN 'free' THEN 5000
			WHEN 'pro' THEN 100000
			WHEN 'business' THEN 1000000
			WHEN 'enterprise' THEN 0 -- Unlimited
			ELSE 5000
		END as rows_processed_per_month_limit,

		CASE up.subscription_tier
			WHEN 'free' THEN 3
			WHEN 'pro' THEN 50
			WHEN 'business' THEN 500
			WHEN 'enterprise' THEN 0 -- Unlimited
			ELSE 3
		END as saved_mappings_limit,

		COALESCE(u.rows_analyzed, 0) as rows_analyzed_current,
		COALESCE(u.rows_processed, 0) as rows_processed_current,
		COALESCE(sm.count, 0) as saved_mappings_current,

		GREATEST(
			CASE up.subscription_tier
				WHEN 'free' THEN 5000 - COALESCE(u.rows_analyzed, 0)
				WHEN 'pro' THEN 100000 - COALESCE(u.rows_analyzed, 0)
				WHEN 'business' THEN 1000000 - COALESCE(u.rows_analyzed, 0)
				WHEN 'enterprise' THEN NULL -- Unlimited
				ELSE 5000 - COALESCE(u.rows_analyzed, 0)
			END,
			0
		) as rows_analyzed_remaining,

		GREATEST(
			CASE up.subscription_tier
				WHEN 'free' THEN 5000 - COALESCE(u.rows_processed, 0)
				WHEN 'pro' THEN 100000 - COALESCE(u.rows_processed, 0)
				WHEN 'business' THEN 1000000 - COALESCE(u.rows_processed, 0)
				WHEN 'enterprise' THEN NULL -- Unlimited
				ELSE 5000 - COALESCE(u.rows_processed, 0)
			END,
			0
		) as rows_processed_remaining,

		GREATEST(
			CASE up.subscription_tier
				WHEN 'free' THEN 3 - COALESCE(sm.count, 0)
				WHEN 'pro' THEN 50 - COALESCE(sm.count, 0)
				WHEN 'business' THEN 500 - COALESCE(sm.count, 0)
				WHEN 'enterprise' THEN NULL -- Unlimited
				ELSE 3 - COALESCE(sm.count, 0)
			END,
			0
		) as saved_mappings_remaining,

		(SELECT period_start FROM period_data LIMIT 1),
		(SELECT period_end FROM period_data LIMIT 1)
	FROM public.user_profiles up
	CROSS JOIN usage u
	CROSS JOIN saved_mappings sm
	WHERE up.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can perform an action
CREATE OR REPLACE FUNCTION public.check_quota_limit(
	p_user_id UUID,
	p_action_type TEXT,
	p_rows_count INTEGER DEFAULT 0,
	p_file_size_bytes INTEGER DEFAULT 0
)
RETURNS TABLE (
	allowed BOOLEAN,
	error_code TEXT,
	current_usage BIGINT,
	limit_value BIGINT,
	remaining BIGINT
) AS $$
BEGIN
	RETURN QUERY
	WITH quota_status AS (
		SELECT * FROM public.get_user_quota_status(p_user_id)
	)
	SELECT
		CASE
			-- Check saved mappings limit
			WHEN p_action_type = 'create_mapping' AND
				 saved_mappings_remaining IS NOT NULL AND
				 saved_mappings_remaining <= 0 THEN
				false

			-- Check rows per file limit
			WHEN p_action_type = 'analyze_file' AND
				 p_rows_count > rows_per_file_limit THEN
				false

			-- Check monthly rows analyzed limit
			WHEN p_action_type = 'analyze_file' AND
				 rows_analyzed_remaining IS NOT NULL AND
				 (rows_analyzed_current + p_rows_count) > rows_analyzed_per_month_limit THEN
				false

			-- Check monthly rows processed limit
			WHEN p_action_type = 'process_file' AND
				 rows_processed_remaining IS NOT NULL AND
				 (rows_processed_current + p_rows_count) > rows_processed_per_month_limit THEN
				false

			ELSE true
		END as allowed,

		CASE
			WHEN p_action_type = 'create_mapping' AND saved_mappings_remaining <= 0 THEN 'QUOTA_SAVED_MAPPINGS_EXCEEDED'
			WHEN p_action_type = 'analyze_file' AND p_rows_count > rows_per_file_limit THEN 'QUOTA_ROWS_PER_FILE_EXCEEDED'
			WHEN p_action_type = 'analyze_file' AND (rows_analyzed_current + p_rows_count) > rows_analyzed_per_month_limit THEN 'QUOTA_MONTHLY_ROWS_ANALYZED_EXCEEDED'
			WHEN p_action_type = 'process_file' AND (rows_processed_current + p_rows_count) > rows_processed_per_month_limit THEN 'QUOTA_MONTHLY_ROWS_PROCESSED_EXCEEDED'
			ELSE NULL
		END as error_code,

		CASE
			WHEN p_action_type = 'create_mapping' THEN saved_mappings_current
			WHEN p_action_type IN ('analyze_file', 'process_file') THEN p_rows_count
			ELSE 0
		END as current_usage,

		CASE
			WHEN p_action_type = 'create_mapping' THEN saved_mappings_limit
			WHEN p_action_type IN ('analyze_file', 'process_file') THEN rows_per_file_limit
			ELSE 0
		END as limit_value,

		CASE
			WHEN p_action_type = 'create_mapping' THEN COALESCE(saved_mappings_remaining, 0)
			WHEN p_action_type = 'analyze_file' THEN COALESCE(rows_analyzed_remaining, 0)
			WHEN p_action_type = 'process_file' THEN COALESCE(rows_processed_remaining, 0)
			ELSE 0
		END as remaining
	FROM quota_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Grant necessary permissions for usage and sales
GRANT INSERT, UPDATE ON public.usage_records TO authenticated;
GRANT INSERT, UPDATE ON public.sales_leads TO authenticated;

-- ============================================
-- COMPOSITE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_usage_records_user_period_type
	ON public.usage_records(user_id, subscription_period_id, record_type);

CREATE INDEX IF NOT EXISTS idx_subscription_periods_user_dates
	ON public.subscription_periods(user_id, period_start, period_end);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All tables, policies, functions, and triggers have been created
-- Your database is now ready for the CSV Column Mapper application
