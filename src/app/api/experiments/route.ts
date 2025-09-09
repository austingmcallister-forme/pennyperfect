import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createExperimentSchema = z.object({
  bandId: z.string(),
  cadenceHours: z.number().min(1),
  revertThresholdRpv: z.number().min(0),
  minSessions: z.number().min(1).default(500),
  minCycles: z.number().min(1).default(3),
})

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
        experiments: {
          include: {
            band: true,
            periods: {
              orderBy: { startedAt: 'desc' },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
      },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    return NextResponse.json(shop.experiments)
    
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 })
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
    
    const body = await request.json()
    const validatedData = createExperimentSchema.parse(body)
    
    // Verify band belongs to shop
    const band = await prisma.priceBand.findFirst({
      where: {
        id: validatedData.bandId,
        shopId: shop.id,
      },
    })
    
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }
    
    const experiment = await prisma.experiment.create({
      data: {
        shopId: shop.id,
        ...validatedData,
      },
      include: {
        band: true,
      },
    })
    
    return NextResponse.json(experiment)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating experiment:', error)
    return NextResponse.json({ error: 'Failed to create experiment' }, { status: 500 })
  }
}
