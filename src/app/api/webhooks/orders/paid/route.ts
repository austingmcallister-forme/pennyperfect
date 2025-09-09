import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateWebhookHmac } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    const body = await request.text()
    
    if (!hmac || !(await validateWebhookHmac(body, hmac))) {
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 })
    }
    
    const order = JSON.parse(body)
    
    // Extract shop domain from webhook headers
    const shopDomain = request.headers.get('x-shopify-shop-domain')
    if (!shopDomain) {
      return NextResponse.json({ error: 'Shop domain not found' }, { status: 400 })
    }
    
    const shop = await prisma.shop.findUnique({
      where: { domain: shopDomain },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    // Get active experiments for this shop
    const activeExperiments = await prisma.experiment.findMany({
      where: {
        shopId: shop.id,
        status: 'running',
      },
      include: {
        periods: {
          where: {
            endedAt: null,
          },
        },
      },
    })
    
    // Calculate order revenue in cents
    const revenueCents = Math.round(parseFloat(order.total_price) * 100)
    
    // Update order count and revenue for current active periods
    for (const experiment of activeExperiments) {
      for (const period of experiment.periods) {
        await prisma.experimentPeriod.update({
          where: { id: period.id },
          data: {
            orders: period.orders + 1,
            revenueCents: BigInt(Number(period.revenueCents) + revenueCents),
          },
        })
      }
    }
    
    return NextResponse.json({ message: 'Order processed' })
    
  } catch (error) {
    console.error('Error processing order webhook:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
