import { NextRequest, NextResponse } from 'next/server'
import { encrypt } from '@/lib/crypto'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  // Get nonce from cookie
  const nonce = request.cookies.get('shopify-nonce')?.value
  
  if (!shop || !code || !state || !nonce) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }
  
  try {
    // Simple OAuth token exchange
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code: code,
      }),
    })
    
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'OAuth token exchange failed' }, { status: 400 })
    }
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token received' }, { status: 400 })
    }
    
    // Get shop info to determine currency
    const shopResponse = await fetch(`https://${shop}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })
    
    const shopData = await shopResponse.json()
    const currency = shopData.shop?.currency || 'USD'
    
    // Store shop in database
    await prisma.shop.upsert({
      where: { domain: shop },
      update: {
        accessTokenEnc: encrypt(accessToken),
        currency,
      },
      create: {
        domain: shop,
        accessTokenEnc: encrypt(accessToken),
        currency,
      },
    })
    
    // Clear the nonce cookie
    const response = NextResponse.redirect(`${process.env.APP_URL}/dashboard`)
    response.cookies.delete('shopify-nonce')
    
    return response
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 })
  }
}