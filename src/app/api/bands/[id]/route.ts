import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateBandSchema = z.object({
  name: z.string().min(1).optional(),
  minCents: z.number().min(0).optional(),
  maxCents: z.number().min(0).optional(),
  allowedEndings: z.array(z.number()).min(1).optional(),
  floorCents: z.number().optional(),
  excludeCollections: z.array(z.string()).optional(),
  excludeSkus: z.array(z.string()).optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const band = await prisma.priceBand.findUnique({
      where: { id: params.id },
      include: {
        experiments: {
          include: {
            periods: {
              orderBy: { startedAt: 'desc' },
            },
          },
        },
      },
    })
    
    if (!band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 })
    }
    
    return NextResponse.json(band)
    
  } catch (error) {
    console.error('Error fetching band:', error)
    return NextResponse.json({ error: 'Failed to fetch band' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateBandSchema.parse(body)
    
    const band = await prisma.priceBand.update({
      where: { id: params.id },
      data: validatedData,
    })
    
    return NextResponse.json(band)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error updating band:', error)
    return NextResponse.json({ error: 'Failed to update band' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.priceBand.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: 'Band deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting band:', error)
    return NextResponse.json({ error: 'Failed to delete band' }, { status: 500 })
  }
}
