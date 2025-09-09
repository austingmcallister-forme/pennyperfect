import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVariantPrice } from '@/lib/shopify'
import { decrypt } from '@/lib/crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: params.id },
      include: {
        shop: true,
        band: true,
        periods: {
          orderBy: { startedAt: 'desc' },
        },
      },
    })
    
    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 })
    }
    
    if (experiment.status !== 'running') {
      return NextResponse.json({ error: 'Experiment is not running' }, { status: 400 })
    }
    
    // Find the best performing ending based on RPV
    const bestPeriod = experiment.periods.reduce((best, current) => {
      const bestRPV = Number(best.revenueCents) / Math.max(best.sessions, 1)
      const currentRPV = Number(current.revenueCents) / Math.max(current.sessions, 1)
      return currentRPV > bestRPV ? current : best
    })
    
    // Get all variants in this price band
    const variants = await prisma.variant.findMany({
      where: {
        shopId: experiment.shopId,
        priceCents: {
          gte: experiment.band.minCents,
          lte: experiment.band.maxCents,
        },
      },
    })
    
    // Update all variants to the best performing ending
    for (const variant of variants) {
      const newPriceCents = Math.floor(variant.priceCents / 100) * 100 + bestPeriod.ending
      
      if (newPriceCents !== variant.priceCents) {
        // Update in Shopify
        await updateVariantPrice(
          experiment.shop.accessTokenEnc,
          experiment.shop.domain,
          variant.shopifyVariantId.toString(),
          (newPriceCents / 100).toFixed(2)
        )
        
        // Record price change
        await prisma.priceChange.create({
          data: {
            shopId: experiment.shopId,
            variantId: variant.id,
            experimentId: experiment.id,
            oldPriceCents: variant.priceCents,
            newPriceCents,
            reason: 'promote',
          },
        })
        
        // Update variant price
        await prisma.variant.update({
          where: { id: variant.id },
          data: { priceCents: newPriceCents },
        })
      }
    }
    
    // Mark experiment as promoted
    await prisma.experiment.update({
      where: { id: params.id },
      data: {
        status: 'promoted',
        endedAt: new Date(),
      },
    })
    
    return NextResponse.json({ message: 'Experiment promoted successfully' })
    
  } catch (error) {
    console.error('Error promoting experiment:', error)
    return NextResponse.json({ error: 'Failed to promote experiment' }, { status: 500 })
  }
}
