# CSV Column Mapper

A professional SaaS application for mapping and transforming CSV columns with a visual, no-code interface.

## Features

- ✅ Visual drag-and-drop column mapping
- ✅ Column transformations (split, concatenate, format, regex)
- ✅ Data validation rules
- ✅ Cloud sync for mappings (Pro+ tiers)
- ✅ Template library (10 pre-built templates)
- ✅ Multiple export formats (CSV, Excel, JSON, SQL)
- ✅ Magic link authentication
- ✅ Professional UI with dark mode

## Tech Stack

- **Frontend:** SvelteKit 5, TypeScript, Tailwind CSS 4
- **Backend:** SvelteKit API routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Link)
- **Payments:** Stripe (to be integrated)
- **Email:** Resend (optional)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/arjavjain21/csv-column-mapper.git
cd csv-column-mapper

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Fill in your Supabase credentials in .env
# PUBLIC_SUPABASE_URL=your-project-url
# PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

See `VPS_DEPLOYMENT_COMPLETE.md` for detailed deployment instructions.

### Quick Deploy

1. Set up VPS (Ubuntu 22.04)
2. Install Node.js, PM2, Nginx, Certbot
3. Clone repository
4. Configure environment variables
5. Build and start with PM2
6. Configure Nginx and SSL

## Environment Variables

See `.env.example` for all required variables.

**Required:**
- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `PUBLIC_APP_URL` - Your app URL (e.g., https://csvmap.com)

**Optional:**
- Stripe keys (for payments)
- Resend API key (for emails)

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # State management
│   ├── utils/          # Utilities (CSV parsing, transformations, etc.)
│   └── config/         # Configuration (plans, pricing)
├── routes/             # Pages and API routes
└── test/               # Test setup
```

## Security

- Row-Level Security (RLS) enabled on all Supabase tables
- Secure cookie handling (httpOnly, secure, sameSite)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Authentication required for protected routes
- Input validation on all API endpoints

## License

Proprietary - All rights reserved

## Support

For issues and questions, please open an issue on GitHub.

---

**Deployed at:** https://csvmap.com
