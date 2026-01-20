-- ============================================
-- SUBSCRIPTION AND USAGE TRACKING
-- ============================================
-- Migration 002: Add subscription periods, usage records, and billing cycle support

-- Update subscription_tier to include 'enterprise'
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
CREATE INDEX idx_subscription_periods_user_id ON public.subscription_periods(user_id);
CREATE INDEX idx_subscription_periods_dates ON public.subscription_periods(period_start, period_end);

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
CREATE INDEX idx_usage_records_user_id ON public.usage_records(user_id);
CREATE INDEX idx_usage_records_period_id ON public.usage_records(subscription_period_id);
CREATE INDEX idx_usage_records_type_created ON public.usage_records(record_type, created_at);
CREATE INDEX idx_usage_records_created_at ON public.usage_records(created_at);

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

CREATE INDEX idx_sales_leads_status ON public.sales_leads(status);
CREATE INDEX idx_sales_leads_created_at ON public.sales_leads(created_at);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

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
	-- If subscription_started_at is NULL, use account creation date
	-- billing_cycle_anchor is day of month (1-31)
	-- We calculate based on the anniversary date

	-- Simple approach: Use subscription started date as anchor
	-- Period is 30 days from start
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

	-- Calculate end date (30 days later or end of next month)
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

-- Trigger to auto-update updated_at on sales_leads
CREATE TRIGGER update_sales_leads_updated_at
	BEFORE UPDATE ON public.sales_leads
	FOR EACH ROW
	EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS FOR QUOTA CHECKS
-- ============================================

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
		SELECT * FROM public.get_or_create_subscription_period(p_user_id)
	),
	usage AS (
		SELECT
			COALESCE(SUM(CASE WHEN record_type = 'file_analyzed' THEN rows_count ELSE 0 END), 0) as rows_analyzed,
			COALESCE(SUM(CASE WHEN record_type = 'file_processed' THEN rows_count ELSE 0 END), 0) as rows_processed
		FROM public.usage_records
		WHERE subscription_period_id = (SELECT id FROM current_period)
	),
	saved_mappings AS (
		SELECT COUNT(*) as count
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

		cp.period_start,
		cp.period_end
	FROM public.user_profiles up
	CROSS JOIN current_period cp
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.subscription_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

-- Subscription periods policies
CREATE POLICY "Users can view own subscription periods" ON public.subscription_periods
	FOR SELECT USING (auth.uid() = user_id);

-- Usage records policies
CREATE POLICY "Users can view own usage records" ON public.usage_records
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage records" ON public.usage_records
	FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sales leads policies (users can view their own leads, admins can view all)
CREATE POLICY "Users can view own sales leads" ON public.sales_leads
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sales leads" ON public.sales_leads
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales leads" ON public.sales_leads
	FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- GRANTS
-- ============================================

-- Grant necessary permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON public.usage_records TO authenticated;
GRANT INSERT, UPDATE ON public.sales_leads TO authenticated;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite index for quota checks
CREATE INDEX idx_usage_records_user_period_type
	ON public.usage_records(user_id, subscription_period_id, record_type);

-- Index for period queries
CREATE INDEX idx_subscription_periods_user_dates
	ON public.subscription_periods(user_id, period_start, period_end);
