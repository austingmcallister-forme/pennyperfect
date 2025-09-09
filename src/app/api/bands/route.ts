import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBandSchema = z.object({
  name: z.string().min(1),
  minCents: z.number().min(0),
  maxCents: z.number().min(0),
  allowedEndings: z.array(z.number()).min(1),
  floorCents: z.number().optional(),
  excludeCollections: z.array(z.string()).optional(),
  excludeSkus: z.array(z.string()).optional(),
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
        bands: {
          include: {
            experiments: {
              where: { status: 'running' },
            },
          },
        },
      },
    })
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    return NextResponse.json(shop.bands)
    
  } catch (error) {
    console.error('Error fetching bands:', error)
    return NextResponse.json({ error: 'Failed to fetch bands' }, { status: 500 })
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
    const validatedData = createBandSchema.parse(body)
    
    const band = await prisma.priceBand.create({
      data: {
        shopId: shop.id,
        ...validatedData,
      },
    })
    
    return NextResponse.json(band)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating band:', error)
    return NextResponse.json({ error: 'Failed to create band' }, { status: 500 })
  }
}