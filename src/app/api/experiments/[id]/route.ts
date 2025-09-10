import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage for testing
let testExperiments: any[] = [
  {
    id: 'exp-test-1',
    shopId: 'test-shop-id',
    bandId: 'band-test-1',
    status: 'running',
    cadenceHours: 24,
    revertThresholdRpv: 0.01,
    minSessions: 500,
    minCycles: 3,
    startedAt: new Date().toISOString(),
    periods: [
      { ending: 99, sessions: 150, orders: 12, revenueCents: 2400 },
      { ending: 95, sessions: 140, orders: 15, revenueCents: 2850 },
      { ending: 90, sessions: 160, orders: 18, revenueCents: 3240 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    console.log(`PUT /api/experiments/${id} called with status:`, status)

    // Find the experiment
    const experimentIndex = testExperiments.findIndex(exp => exp.id === id)
    if (experimentIndex === -1) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 })
    }

    // Update the experiment status
    testExperiments[experimentIndex] = {
      ...testExperiments[experimentIndex],
      status,
      updatedAt: new Date().toISOString()
    }

    console.log('Updated experiment:', testExperiments[experimentIndex])

    return NextResponse.json(testExperiments[experimentIndex])
  } catch (error) {
    console.error('Error updating experiment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update experiment',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}