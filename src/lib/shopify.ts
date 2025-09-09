import { encrypt, decrypt } from './crypto'

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  variants: ShopifyVariant[]
}

export interface ShopifyVariant {
  id: string
  product_id: string
  sku: string | null
  title: string
  price: string
  compare_at_price: string | null
}

export async function fetchProducts(accessToken: string, shopDomain: string) {
  const response = await fetch(`https://${shopDomain}/admin/api/2023-10/products.json?limit=250`, {
    headers: {
      'X-Shopify-Access-Token': decrypt(accessToken),
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  
  return await response.json() as { products: ShopifyProduct[] }
}

export async function updateVariantPrice(
  accessToken: string,
  shopDomain: string,
  variantId: string,
  newPrice: string
) {
  const response = await fetch(`https://${shopDomain}/admin/api/2023-10/variants/${variantId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': decrypt(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId,
        price: newPrice,
      },
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to update variant: ${response.statusText}`)
  }
  
  return await response.json()
}

export function createOAuthUrl(shop: string, nonce: string): string {
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`)
  authUrl.searchParams.set('client_id', process.env.SHOPIFY_API_KEY!)
  authUrl.searchParams.set('scope', process.env.SHOPIFY_SCOPES!)
  authUrl.searchParams.set('redirect_uri', `${process.env.APP_URL}/api/auth/shopify/callback`)
  authUrl.searchParams.set('state', nonce)
  return authUrl.toString()
}

export async function validateWebhookHmac(body: string, hmac: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(process.env.SHOPIFY_API_SECRET!)
    const messageData = encoder.encode(body)
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, messageData)
    const calculatedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)))
    
    return calculatedHmac === hmac
  } catch (error) {
    return false
  }
}