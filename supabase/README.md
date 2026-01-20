# Supabase Database Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization (or create one)
4. Enter project details:
   - Name: `csv-column-mapper`
   - Database Password: (choose a strong password and save it)
   - Region: Choose closest to your users
5. Wait for project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → This is your `PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Run the Database Migration

1. In Supabase, go to **SQL Editor** (icon on left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" at the bottom

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Leave Stripe values empty for now - we'll configure those in the next step.

## Step 5: Verify Setup

1. In Supabase, go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `user_profiles`
   - `mappings`
   - `mapping_versions`
   - `templates`
   - `teams`
   - `team_members`

3. Check the `templates` table - you should see 2 sample templates:
   - Shopify Product Import
   - QuickBooks Transactions

## What This Migration Creates

### Tables:
- **user_profiles**: Extends Supabase auth with subscription tier, Stripe IDs
- **mappings**: Stores user's CSV column mappings
- **mapping_versions**: Version history for undo/redo
- **templates**: Public template library
- **teams**: Team accounts for Business tier
- **team_members**: Team membership with roles (owner/editor/viewer)

### Features:
- **Row Level Security (RLS)**: Users can only access their own data
- **Team sharing**: Team members can collaborate on mappings
- **Automatic timestamps**: `created_at` and `updated_at` managed automatically
- **User profile creation**: New users automatically get a profile record
- **Subscription tiering**: Built-in support for free/pro/business/lifetime tiers

### Security:
- All tables protected with RLS policies
- Authenticated users can manage their own data
- Templates are publicly readable
- Team-based access control for collaboration

## Troubleshooting

### Error: "relation does not exist"
This means the migration didn't run completely. Go back to SQL Editor and run the migration again.

### Error: "permission denied"
Make sure you're running the SQL as the database owner (you should be by default in SQL Editor).

### Can't see tables in Table Editor
Refresh the page. Sometimes Supabase takes a moment to update the UI.

## Next Steps

After database setup is complete:
1. Set up Stripe (see Stripe setup guide)
2. Implement authentication UI
3. Build the application features

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.gg/supabase
