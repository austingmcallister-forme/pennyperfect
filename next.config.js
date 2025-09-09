/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com'],
  },
  env: {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    SHOPIFY_SCOPES: process.env.SHOPIFY_SCOPES,
    APP_URL: process.env.APP_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
}

module.exports = nextConfig
