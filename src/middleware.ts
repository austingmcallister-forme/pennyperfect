import { NextRequest, NextResponse } from 'next/server'
import { validateWebhookHmac } from '@/lib/shopify'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle webhook routes with HMAC validation
  if (pathname.startsWith('/api/webhooks/')) {
    return handleWebhook(request)
  }
  
  // Handle API routes that need shop parameter validation
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    return handleApiRoute(request)
  }
  
  // Handle dashboard routes with session validation
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/bands') || pathname.startsWith('/experiments')) {
    return handleDashboardRoute(request)
  }
  
  return NextResponse.next()
}

async function handleWebhook(request: NextRequest) {
  const hmac = request.headers.get('x-shopify-hmac-sha256')
  
  if (!hmac) {
    return NextResponse.json({ error: 'Missing HMAC header' }, { status: 401 })
  }
  
  // Clone the request to read the body
  const clonedRequest = request.clone()
  const body = await clonedRequest.text()
  
  if (!(await validateWebhookHmac(body, hmac))) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 })
  }
  
  // Create new request with body for the actual handler
  const newRequest = new NextRequest(request.url, {
    method: request.method,
    headers: request.headers,
    body,
  })
  
  return NextResponse.next()
}

function handleApiRoute(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  
  // Skip auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Skip cron routes (they have their own auth)
  if (request.nextUrl.pathname.startsWith('/api/cron/')) {
    return NextResponse.next()
  }
  
  // Require shop parameter for most API routes
  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
  }
  
  // Validate shop domain format
  if (!shop.includes('.myshopify.com')) {
    return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 })
  }
  
  return NextResponse.next()
}

function handleDashboardRoute(request: NextRequest) {
  // Temporarily disable redirect for testing
  // TODO: Re-enable after OAuth is working
  return NextResponse.next()
  
  // const { searchParams } = new URL(request.url)
  // const shop = searchParams.get('shop')
  
  // // For dashboard routes, redirect to install if no shop parameter
  // if (!shop) {
  //   const installUrl = new URL('/api/auth/shopify/install', request.url)
  //   installUrl.searchParams.set('shop', 'your-shop.myshopify.com') // This should be dynamic
  //   return NextResponse.redirect(installUrl)
  // }
  
  // return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/webhooks/:path*',
    '/api/:path*',
    '/dashboard/:path*',
    '/bands/:path*',
    '/experiments/:path*',
  ],
}