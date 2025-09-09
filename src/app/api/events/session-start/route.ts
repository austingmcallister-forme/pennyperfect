import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopDomain = searchParams.get('shop')
    
    if (!shopDomain) {
      return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
    }
    
    const shop = await prisma.shop.findUnique({
      where: { domain: shopDomain },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    // Get current active experiments for this shop
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
    
    // Increment session count for current active periods
    for (const experiment of activeExperiments) {
      for (const period of experiment.periods) {
        await prisma.experimentPeriod.update({
          where: { id: period.id },
          data: {
            sessions: period.sessions + 1,
          },
        })
      }
    }
    
    return NextResponse.json({ message: 'Session tracked' })
    
  } catch (error) {
    console.error('Error tracking session:', error)
    return NextResponse.json({ error: 'Failed to track session' }, { status: 500 })
  }
}
