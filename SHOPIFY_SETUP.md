# Shopify Dev Store Setup Guide

## 🏪 **Create a Shopify Dev Store**

1. **Go to**: [partners.shopify.com](https://partners.shopify.com)
2. **Sign up** for a Shopify Partners account (free)
3. **Create a new app**:
   - Click "Create app"
   - Choose "Create app manually"
   - App name: "PennyPerfect"
   - App URL: `https://pennyperfect-p4285b5o0-austins-projects-8ddb27c7.vercel.app`
   - Allowed redirection URL: `des`

4. **Get your credentials**:
   - API Key (Client ID)
   - API Secret (Client Secret)

5. **Create a development store**:
   - In your Partners dashboard, go to "Stores"
   - Click "Create store"
   - Choose "Development store"
   - Add some test products and collections

## 🔧 **Update Environment Variables**

Add these to your Vercel environment variables:

```bash
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_orders,read_price_rules
APP_URL=https://pennyperfect-p4285b5o0-austins-projects-8ddb27c7.vercel.app
```

## 🔄 **Replace Mock Data with Real Shopify API**

Once you have a dev store, I can update the API endpoints to fetch real data from Shopify instead of using mock data.

## 🧪 **Test the Integration**

1. **Install the app** on your dev store
2. **Create price bands** with real collections and products
3. **Run experiments** with actual Shopify data

---

## 🚀 **Quick Start (Current Status)**

**Right now, you can test locally:**
- Visit `http://localhost:3000/test` to see API data
- Visit `http://localhost:3000/bands/new` to test dropdowns
- The mock data will work perfectly for UI testing

**Next steps:**
1. Set up Shopify dev store (5 minutes)
2. Update environment variables
3. Replace mock APIs with real Shopify APIs
4. Test with real data
