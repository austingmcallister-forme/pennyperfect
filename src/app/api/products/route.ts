import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchProducts } from '@/lib/shopify'
import { decrypt } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopDomain = searchParams.get('shop')
  
  if (!shopDomain) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
  }
  
  try {
    const shop = await prisma.shop.findUnique({
      where: { domain: shopDomain },
      include: {
        products: {
          include: {
            variants: true,
          },
        },
      },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    return NextResponse.json(shop.products)
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopDomain = searchParams.get('shop')
  
  if (!shopDomain) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
  }
  
  try {
    const shop = await prisma.shop.findUnique({
      where: { domain: shopDomain },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    // Fetch products from Shopify
    const { products } = await fetchProducts(shop.accessTokenEnc, shopDomain)
    
    // Sync products to database
    for (const product of products) {
      await prisma.product.upsert({
        where: {
          shopId_shopifyId: {
            shopId: shop.id,
            shopifyId: BigInt(product.id),
          },
        },
        update: {
          title: product.title,
          handle: product.handle,
        },
        create: {
          shopId: shop.id,
          shopifyId: BigInt(product.id),
          title: product.title,
          handle: product.handle,
        },
      })
      
      // Sync variants
      for (const variant of product.variants) {
        await prisma.variant.upsert({
          where: {
            shopId_shopifyVariantId: {
              shopId: shop.id,
              shopifyVariantId: BigInt(variant.id),
            },
          },
          update: {
            productId: product.id,
            sku: variant.sku,
            title: variant.title,
            priceCents: Math.round(parseFloat(variant.price) * 100),
            compareAtCents: variant.compare_at_price 
              ? Math.round(parseFloat(variant.compare_at_price) * 100)
              : null,
          },
          create: {
            shopId: shop.id,
            productId: product.id,
            shopifyVariantId: BigInt(variant.id),
            shopifyProductId: BigInt(variant.product_id),
            sku: variant.sku,
            title: variant.title,
            priceCents: Math.round(parseFloat(variant.price) * 100),
            compareAtCents: variant.compare_at_price 
              ? Math.round(parseFloat(variant.compare_at_price) * 100)
              : null,
          },
        })
      }
    }
    
    return NextResponse.json({ message: 'Products synced successfully' })
    
  } catch (error) {
    console.error('Error syncing products:', error)
    return NextResponse.json({ error: 'Failed to sync products' }, { status: 500 })
  }
}