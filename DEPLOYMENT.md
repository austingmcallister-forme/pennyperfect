# PennyPerfect Production Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- Shopify Partners account
- GitHub account (for repository)

## Step 1: Shopify Partners App Setup

1. **Go to [Shopify Partners](https://partners.shopify.com/)**
2. **Create a new app:**
   - App name: "PennyPerfect"
   - App URL: `https://your-app-name.vercel.app` (update after Vercel deployment)
   - Allowed redirection URLs: `https://your-app-name.vercel.app/api/auth/shopify/callback`

3. **Configure App Settings:**
   - App type: Public app
   - Distribution: Public (for broader reach)
   - Scopes: `read_products,write_products,read_orders,read_price_rules`

4. **Set up Webhooks:**
   - Event: `orders/paid`
   - URL: `https://your-app-name.vercel.app/api/webhooks/orders/paid`
   - Format: JSON

5. **Note your credentials:**
   - API Key
   - API Secret Key

## Step 2: Database Setup (Vercel Postgres)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Create a new project**
3. **Add Vercel Postgres:**
   - Go to Storage tab
   - Click "Create Database"
   - Choose "Postgres"
   - Name: "pennyperfect-db"
   - Region: Choose closest to your users

4. **Get connection string:**
   - Copy the `DATABASE_URL` from the database settings
   - Format: `postgresql://username:password@host:port/database`

## Step 3: Environment Variables

Create `.env.local` with these variables:

```bash
# Database - From Vercel Postgres
DATABASE_URL="postgresql://username:password@host:port/database"

# Shopify App Configuration - From Partners dashboard
SHOPIFY_API_KEY="your_shopify_api_key_here"
SHOPIFY_API_SECRET="your_shopify_api_secret_here"
SHOPIFY_SCOPES="read_products,write_products,read_orders,read_price_rules"

# App URL - Update after Vercel deployment
APP_URL="https://your-app-name.vercel.app"

# Encryption key (32 characters) - Generate secure random string
ENCRYPTION_KEY="your_32_character_encryption_key_here"

# Cron secret - Generate secure random string
CRON_SECRET="your_cron_secret_here"

# Next.js
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your_nextauth_secret_here"
```

## Step 4: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/pennyperfect.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Set Environment Variables:**
   - In Vercel project settings
   - Go to Environment Variables
   - Add all variables from `.env.local`

## Step 5: Database Migration

After deployment, run database migration:

1. **Go to Vercel project dashboard**
2. **Open Functions tab**
3. **Create a new function** (temporary):
   ```javascript
   // api/migrate.js
   import { PrismaClient } from '@prisma/client'
   
   const prisma = new PrismaClient()
   
   export default async function handler(req, res) {
     try {
       await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
       res.status(200).json({ message: 'Migration completed' })
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
   }
   ```

4. **Or use Vercel CLI:**
   ```bash
   npx vercel env pull .env.local
   npx prisma db push
   ```

## Step 6: Configure Cron Job

1. **Go to Vercel project settings**
2. **Add Cron Job:**
   - Path: `/api/cron/switchback`
   - Schedule: `0 * * * *` (every hour)
   - Timezone: UTC

## Step 7: Update Shopify App URLs

1. **Go back to Shopify Partners dashboard**
2. **Update App URLs:**
   - App URL: `https://your-actual-app-name.vercel.app`
   - Allowed redirection URLs: `https://your-actual-app-name.vercel.app/api/auth/shopify/callback`
   - Webhook URL: `https://your-actual-app-name.vercel.app/api/webhooks/orders/paid`

## Step 8: Test Installation

1. **Create a development store:**
   - Go to Shopify Partners dashboard
   - Create development store

2. **Install the app:**
   - Visit: `https://your-app-name.vercel.app/api/auth/shopify/install?shop=your-dev-store.myshopify.com`
   - Complete OAuth flow

3. **Test the flow:**
   - Create a price band
   - Start an experiment
   - Verify webhook is receiving orders
   - Check cron job is running

## Step 9: Production Checklist

- [ ] Shopify app configured with correct URLs
- [ ] Database migrated and connected
- [ ] Environment variables set in Vercel
- [ ] Webhooks configured and tested
- [ ] Cron job scheduled
- [ ] App installs successfully
- [ ] Price bands can be created
- [ ] Experiments can be started
- [ ] Orders are being tracked
- [ ] Switchback is working

## Troubleshooting

### Common Issues:

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Ensure database is created in Vercel
   - Run `npx prisma db push` locally

2. **Shopify OAuth errors:**
   - Verify API key and secret
   - Check redirect URLs match exactly
   - Ensure scopes are correct

3. **Webhook not receiving data:**
   - Check webhook URL is accessible
   - Verify HMAC validation
   - Test with webhook testing tools

4. **Cron job not running:**
   - Check Vercel cron configuration
   - Verify CRON_SECRET is set
   - Check function logs in Vercel

## Security Notes

- Use strong, unique encryption keys
- Rotate secrets regularly
- Monitor webhook logs
- Set up error alerting
- Use HTTPS only (Vercel handles this)

## Monitoring

- Set up Vercel Analytics
- Monitor function execution times
- Track webhook success rates
- Set up error alerting
- Monitor database performance

## Next Steps After Deployment

1. **Set up monitoring and alerting**
2. **Create user documentation**
3. **Set up customer support**
4. **Plan for scaling**
5. **Consider additional features**

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test webhook endpoints
4. Check database connectivity
5. Review Shopify app configuration
