#!/bin/bash

# PennyPerfect Test Script
echo "🧪 Testing PennyPerfect setup..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Run ./setup.sh first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Run npm install first."
    exit 1
fi

# Test Prisma connection
echo "🗄️ Testing database connection..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Check your DATABASE_URL."
    exit 1
fi

# Test build
echo "🏗️ Testing build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Check for TypeScript errors."
    exit 1
fi

# Test development server (background)
echo "🚀 Starting development server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server failed to start"
    kill $SERVER_PID
    exit 1
fi

# Stop server
kill $SERVER_PID

echo ""
echo "🎉 All tests passed!"
echo ""
echo "Your PennyPerfect app is ready for deployment!"
echo "Next steps:"
echo "1. Set up Shopify Partners app"
echo "2. Deploy to Vercel"
echo "3. Configure webhooks"
echo "4. Test with development store"
