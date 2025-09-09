#!/bin/bash

# PennyPerfect Setup Script
echo "🚀 Setting up PennyPerfect for production..."

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Create .env.local template
echo "📝 Creating environment template..."
cat > .env.local << 'EOF'
# Database - Get this from Vercel Postgres after setup
DATABASE_URL="postgresql://username:password@host:port/database"

# Shopify App Configuration - Get these from Shopify Partners dashboard
SHOPIFY_API_KEY="your_shopify_api_key_here"
SHOPIFY_API_SECRET="your_shopify_api_secret_here"
SHOPIFY_SCOPES="read_products,write_products,read_orders,read_price_rules"

# App URL - Update this after Vercel deployment
APP_URL="https://your-app-name.vercel.app"

# Encryption key for token encryption (32 characters) - Generate a secure random string
ENCRYPTION_KEY="your_32_character_encryption_key_here"

# Cron secret for switchback job - Generate a secure random string
CRON_SECRET="your_cron_secret_here"

# Next.js
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your_nextauth_secret_here"
EOF

echo "✅ Environment template created"

# Generate secure keys
echo "🔐 Generating secure keys..."
ENCRYPTION_KEY=$(openssl rand -hex 16)
CRON_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)

echo "Generated keys:"
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo "CRON_SECRET=$CRON_SECRET"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to Shopify Partners dashboard and create your app"
echo "2. Set up Vercel Postgres database"
echo "3. Update .env.local with your actual values"
echo "4. Deploy to Vercel"
echo "5. Configure webhooks and cron job"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
