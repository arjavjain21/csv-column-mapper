#!/bin/bash
# Script to run Supabase migrations
# This will output SQL that can be run in Supabase dashboard

echo "=========================================="
echo "Supabase Migration SQL"
echo "=========================================="
echo ""
echo "Copy and paste the following SQL into your Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/qxytijsztnxcnxwkwtjf/sql/new"
echo ""
echo "=========================================="
echo "MIGRATION 001: Initial Schema"
echo "=========================================="
cat supabase/migrations/001_initial_schema.sql
echo ""
echo "=========================================="
echo "MIGRATION 002: Subscription Usage"
echo "=========================================="
cat supabase/migrations/002_subscription_usage.sql
