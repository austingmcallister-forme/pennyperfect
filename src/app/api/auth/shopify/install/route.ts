import { NextRequest, NextResponse } from 'next/server'
import { createOAuthUrl } from '@/lib/shopify'
import { generateNonce } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  
  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
  }
  
  // Validate shop domain format
  if (!shop.includes('.myshopify.com')) {
    return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 })
  }
  
  const nonce = generateNonce()
  const authUrl = createOAuthUrl(shop, nonce)
  
  // Store nonce in session/cookie for validation in callback
  const response = NextResponse.redirect(authUrl)
  response.cookies.set('shopify-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })
  
  return response
}