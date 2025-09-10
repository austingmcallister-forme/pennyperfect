import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Temporary in-memory storage for testing
let testBands: any[] = []
let testShopId = 'test-shop-id'

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
  // For testing, just return the in-memory bands
  return NextResponse.json(testBands)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2))
    
    const validatedData = createBandSchema.parse(body)
    
    // Create a new band with a unique ID
    const newBand = {
      id: `band-${Date.now()}`,
      shopId: testShopId,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Add to in-memory storage
    testBands.push(newBand)
    
    return NextResponse.json(newBand)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating band:', error)
    return NextResponse.json({ error: 'Failed to create band' }, { status: 500 })
  }
}