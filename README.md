# PennyPerfect - Price Ending Optimization MVP

Auto-test .99/.95/.90 price endings **by price band** with **switchback (time-slice) tests** on Shopify stores. Flip endings on a cadence, measure RPV/CVR/AOV, and **auto-promote or auto-revert** based on a threshold.

## Features

- **Switchback Testing**: Automatically cycles through price endings (.99, .95, .90) on a configurable cadence
- **Price Bands**: Define price ranges and allowed endings for different product categories
- **Auto-Decision**: Promotes winning endings or reverts based on RPV improvement thresholds
- **Real-time Tracking**: Session tracking and order attribution for accurate performance measurement
- **Shopify Integration**: Seamless OAuth and webhook integration

## Tech Stack

- **Next.js 14** with App Router (TypeScript)
- **Prisma** + PostgreSQL for data persistence
- **Shopify API** for product and order management
- **Tailwind CSS** for styling
- **Vercel** for deployment and cron jobs

## Quick Start

### 1. Environment Setup

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pennyperfect"

# Shopify App Configuration
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_API_SECRET="your_shopify_api_secret"
SHOPIFY_SCOPES="read_products,write_products,read_orders,read_price_rules"

# App URL for callbacks and webhooks
APP_URL="https://yourappurl.com"

# Encryption key for token encryption (32 characters)
ENCRYPTION_KEY="change_me_32chars_encryption_key"

# Cron secret for switchback job
CRON_SECRET="your_cron_secret"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 3. Development

```bash
# Start development server
npm run dev
```

### 4. Shopify App Setup

1. Create a new Shopify app in your Partners dashboard
2. Set the App URL to your deployed URL
3. Configure webhooks:
   - `orders/paid` → `https://yourappurl.com/api/webhooks/orders/paid`
4. Set up Vercel cron job:
   - `0 * * * *` → `https://yourappurl.com/api/cron/switchback`

## Usage

### 1. Install App
Visit `/api/auth/shopify/install?shop=your-shop.myshopify.com` to install the app.

### 2. Create Price Bands
Define price ranges and allowed endings:
- Min/Max price in cents
- Allowed endings (e.g., [99, 95, 90])
- Optional floor prices and exclusions

### 3. Start Experiments
Configure switchback tests:
- Cadence (hours between switches)
- RPV improvement threshold
- Minimum sessions and cycles

### 4. Monitor Performance
Track real-time metrics:
- Sessions per period
- Orders and revenue
- CVR and RPV calculations

## API Endpoints

- `GET /api/products` - Fetch and sync products
- `GET /api/bands` - Manage price bands
- `GET /api/experiments` - Manage experiments
- `POST /api/events/session-start` - Track sessions
- `POST /api/webhooks/orders/paid` - Process orders
- `GET /api/cron/switchback` - Hourly switchback job

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy and configure cron job

### Database Options

- **Vercel Postgres**: Recommended for Vercel deployment
- **PlanetScale**: MySQL-compatible with Prisma
- **Supabase**: PostgreSQL with additional features

## Pricing Logic

- **Round Down Only**: Prices are always rounded down to target endings
- **No Price Hikes**: Never increases prices during experiments
- **Floor Respect**: Respects minimum price floors
- **Primary Currency**: Only tests primary store currency

## Security

- HMAC validation for all webhooks
- Encrypted access token storage
- Session-based authentication
- CORS protection

## Monitoring

The app automatically:
- Tracks sessions via pixel
- Attributes orders to experiment periods
- Calculates RPV improvements
- Promotes winning endings
- Reverts underperforming tests

## Support

For issues or questions, please check the documentation or create an issue in the repository.
