import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Temporary in-memory storage for testing
let testExperiments: any[] = []
let testShopId = 'test-shop-id'

const createExperimentSchema = z.object({
  bandId: z.string(),
  cadenceHours: z.number().min(1),
  revertThresholdRpv: z.number().min(0),
  minSessions: z.number().min(1).default(500),
  minCycles: z.number().min(1).default(3),
})

export async function GET(request: NextRequest) {
  // For testing, just return the in-memory experiments
  return NextResponse.json(testExperiments)
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    console.log('Received experiment data:', JSON.stringify(body, null, 2))
    
    const validatedData = createExperimentSchema.parse(body)
    
    // Create a new experiment with a unique ID
    const newExperiment = {
      id: `exp-${Date.now()}`,
      shopId: testShopId,
      bandId: validatedData.bandId,
      cadenceHours: validatedData.cadenceHours,
      revertThresholdRpv: validatedData.revertThresholdRpv,
      minSessions: validatedData.minSessions,
      minCycles: validatedData.minCycles,
      status: 'running',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      periods: [],
    }
    
    // Add to in-memory storage
    testExperiments.push(newExperiment)
    
    return NextResponse.json(newExperiment)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: error.errors,
        receivedData: body 
      }, { status: 400 })
    }
    
    console.error('Error creating experiment:', error)
    return NextResponse.json({ error: 'Failed to create experiment', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
