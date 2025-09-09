import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: params.id },
      include: {
        band: true,
        periods: {
          orderBy: { startedAt: 'desc' },
        },
      },
    })
    
    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 })
    }
    
    return NextResponse.json(experiment)
    
  } catch (error) {
    console.error('Error fetching experiment:', error)
    return NextResponse.json({ error: 'Failed to fetch experiment' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const experiment = await prisma.experiment.update({
      where: { id: params.id },
      data: {
        status: body.status,
        endedAt: body.status === 'running' ? null : new Date(),
      },
      include: {
        band: true,
      },
    })
    
    return NextResponse.json(experiment)
    
  } catch (error) {
    console.error('Error updating experiment:', error)
    return NextResponse.json({ error: 'Failed to update experiment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.experiment.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: 'Experiment deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting experiment:', error)
    return NextResponse.json({ error: 'Failed to delete experiment' }, { status: 500 })
  }
}
