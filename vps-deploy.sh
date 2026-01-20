#!/bin/bash

# VPS Deployment Helper Script
# This script helps automate the deployment process to your VPS

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="hyperke-vps"
VPS_USER="${USER}"
APP_DIR="~/apps/csv-column-mapper"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo -e "${BLUE}🚀 CSV Column Mapper - VPS Deployment Helper${NC}"
echo "=========================================="
echo ""

# Function to print colored messages
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    error "rsync is not installed. Please install it first."
    exit 1
fi

# Check if .env exists
if [ ! -f "$LOCAL_DIR/.env" ]; then
    warning ".env file not found in local directory"
    read -p "Do you want to create a .env.example template? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > "$LOCAL_DIR/.env.example" << 'EOF'
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_LIFETIME=price_xxxxxxxxxxxxx

# Application URL
PUBLIC_APP_URL=https://your-domain.com

# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Node Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
EOF
        success ".env.example created. Please copy it to .env and fill in your values."
    fi
    exit 1
fi

# Function to transfer files
transfer_files() {
    info "Transferring files to VPS..."
    
    rsync -avz \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'build' \
        --exclude '.svelte-kit' \
        --exclude '.env' \
        --exclude '*.log' \
        --exclude 'logs' \
        "$LOCAL_DIR/" "${VPS_USER}@${VPS_HOST}:${APP_DIR}/"
    
    success "Files transferred successfully!"
}

# Function to check VPS connection
check_connection() {
    info "Checking VPS connection..."
    if ssh -o ConnectTimeout=5 "${VPS_USER}@${VPS_HOST}" exit 2>/dev/null; then
        success "VPS connection successful"
        return 0
    else
        error "Cannot connect to VPS. Please check:"
        echo "  1. SSH key is set up"
        echo "  2. VPS hostname/IP is correct"
        echo "  3. You have network access"
        return 1
    fi
}

# Function to run remote commands
run_remote() {
    ssh "${VPS_USER}@${VPS_HOST}" "$1"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Transfer files to VPS"
    echo "2) Install dependencies on VPS"
    echo "3) Build application on VPS"
    echo "4) Restart PM2 application"
    echo "5) View PM2 logs"
    echo "6) Full deployment (transfer + install + build + restart)"
    echo "7) Exit"
    echo ""
    read -p "Enter choice [1-7]: " choice
}

# Main execution
main() {
    if ! check_connection; then
        exit 1
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1)
                transfer_files
                ;;
            2)
                info "Installing dependencies on VPS..."
                run_remote "cd ${APP_DIR} && npm install"
                success "Dependencies installed"
                ;;
            3)
                info "Building application on VPS..."
                run_remote "cd ${APP_DIR} && npm run build"
                success "Application built"
                ;;
            4)
                info "Restarting PM2 application..."
                run_remote "cd ${APP_DIR} && pm2 restart csv-column-mapper || pm2 start ecosystem.config.js"
                success "Application restarted"
                ;;
            5)
                info "Showing PM2 logs (last 50 lines)..."
                run_remote "cd ${APP_DIR} && pm2 logs csv-column-mapper --lines 50 --nostream"
                ;;
            6)
                transfer_files
                info "Installing dependencies..."
                run_remote "cd ${APP_DIR} && npm install"
                info "Building application..."
                run_remote "cd ${APP_DIR} && npm run build"
                info "Restarting application..."
                run_remote "cd ${APP_DIR} && pm2 restart csv-column-mapper || pm2 start ecosystem.config.js"
                success "Full deployment complete!"
                echo ""
                info "Next steps:"
                echo "  1. SSH into VPS: ssh ${VPS_HOST}"
                echo "  2. Check logs: pm2 logs csv-column-mapper"
                echo "  3. Verify app is running: pm2 status"
                ;;
            7)
                success "Goodbye!"
                exit 0
                ;;
            *)
                error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
