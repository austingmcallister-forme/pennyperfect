import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Temporary in-memory storage for testing
let testBands: any[] = []
let testShopId = 'test-shop-id'

const updateBandSchema = z.object({
  name: z.string().min(1),
  minCents: z.number().min(0),
  maxCents: z.number().min(0),
  allowedEndings: z.array(z.number()),
  floorCents: z.number().optional(),
  excludeCollections: z.array(z.string()).default([]),
  excludeSkus: z.array(z.string()).default([]),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: any
  try {
    body = await request.json()
    console.log('Received update data:', JSON.stringify(body, null, 2))
    
    const validatedData = updateBandSchema.parse(body)
    const bandId = params.id
    
    // Find the band to update
    const bandIndex = testBands.findIndex(band => band.id === bandId)
    if (bandIndex === -1) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }
    
    // Update the band
    testBands[bandIndex] = {
      ...testBands[bandIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }
    
    console.log('Updated band:', testBands[bandIndex])
    return NextResponse.json(testBands[bandIndex])
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json({
        error: 'Invalid data',
        details: error.errors,
        receivedData: body
      }, { status: 400 })
    }
    console.error('Error updating band:', error)
    return NextResponse.json({ 
      error: 'Failed to update band', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bandId = params.id
  const band = testBands.find(band => band.id === bandId)
  
  if (!band) {
    return NextResponse.json({ error: 'Band not found' }, { status: 404 })
  }
  
  return NextResponse.json(band)
}