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
    
    // Revert all variants to their original prices (before experiment)
    const priceChanges = await prisma.priceChange.findMany({
      where: {
        experimentId: experiment.id,
        reason: 'switchback',
      },
      orderBy: { createdAt: 'asc' },
    })
    
    // Group by variant to get original prices
    const originalPrices = new Map<string, number>()
    for (const change of priceChanges) {
      if (!originalPrices.has(change.variantId)) {
        originalPrices.set(change.variantId, change.oldPriceCents)
      }
    }
    
    // Revert variants to original prices
    for (const variant of variants) {
      const originalPrice = originalPrices.get(variant.id)
      
      if (originalPrice && originalPrice !== variant.priceCents) {
        // Update in Shopify
        await updateVariantPrice(
          experiment.shop.accessTokenEnc,
          experiment.shop.domain,
          variant.shopifyVariantId.toString(),
          (originalPrice / 100).toFixed(2)
        )
        
        // Record price change
        await prisma.priceChange.create({
          data: {
            shopId: experiment.shopId,
            variantId: variant.id,
            experimentId: experiment.id,
            oldPriceCents: variant.priceCents,
            newPriceCents: originalPrice,
            reason: 'revert',
          },
        })
        
        // Update variant price
        await prisma.variant.update({
          where: { id: variant.id },
          data: { priceCents: originalPrice },
        })
      }
    }
    
    // Mark experiment as reverted
    await prisma.experiment.update({
      where: { id: params.id },
      data: {
        status: 'reverted',
        endedAt: new Date(),
      },
    })
    
    return NextResponse.json({ message: 'Experiment reverted successfully' })
    
  } catch (error) {
    console.error('Error reverting experiment:', error)
    return NextResponse.json({ error: 'Failed to revert experiment' }, { status: 500 })
  }
}
