#!/bin/bash

# CSV Column Mapper - Local Build Script
# This script builds the application for local production deployment

set -e  # Exit on error

echo "🚀 CSV Column Mapper - Local Build Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Pre-build checks
echo "🔍 Running pre-build checks..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env.example template..."
    cat > .env.example << 'EOF'
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration (optional)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs (optional)
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_LIFETIME=price_xxxxxxxxxxxxx

# Application URL
PUBLIC_APP_URL=http://localhost:3000

# Resend API Key (optional)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Node Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
EOF
    echo -e "${YELLOW}⚠️  Please copy .env.example to .env and fill in your values${NC}"
    echo ""
    read -p "Continue with build anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Build cancelled"
        exit 0
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Clean previous build
echo ""
echo "🧹 Cleaning previous build..."
rm -rf build .svelte-kit
echo -e "${GREEN}✅ Clean complete${NC}"

# Build the application
echo ""
echo "🏗️  Building application..."
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo -e "${BLUE}📦 Build output:${NC}"
    echo "   Location: ./build/"
    echo ""
    echo -e "${BLUE}🚀 To run the application:${NC}"
    echo "   npm start"
    echo ""
    echo -e "${BLUE}🌐 Or preview with Vite:${NC}"
    echo "   npm run preview"
    echo ""
    echo -e "${BLUE}📝 Environment variables:${NC}"
    echo "   Make sure your .env file is configured with:"
    echo "   - PUBLIC_SUPABASE_URL"
    echo "   - PUBLIC_SUPABASE_ANON_KEY"
    echo "   - PUBLIC_APP_URL (e.g., http://localhost:3000)"
    echo ""
    echo -e "${BLUE}💡 Tips:${NC}"
    echo "   - The app will run on the port specified in PORT env var (default: 3000)"
    echo "   - Set HOST=0.0.0.0 to allow external connections"
    echo "   - For production, use PM2 or similar process manager"
    echo ""
    echo "📚 See VPS_DEPLOYMENT_GUIDE.md for production deployment instructions"
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo "Please check the error messages above"
    exit 1
fi
