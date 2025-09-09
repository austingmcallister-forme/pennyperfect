import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVariantPrice } from '@/lib/shopify'
import { decrypt } from '@/lib/crypto'
import { getNextEnding, roundDownToEnding, calculateRPV } from '@/lib/pricing'

export async function GET(request: NextRequest) {
  // Verify this is a cron request (you might want to add additional security)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Get all running experiments
    const runningExperiments = await prisma.experiment.findMany({
      where: { status: 'running' },
      include: {
        shop: true,
        band: true,
        periods: {
          where: { endedAt: null },
          orderBy: { startedAt: 'desc' },
        },
      },
    })
    
    for (const experiment of runningExperiments) {
      const currentPeriod = experiment.periods[0]
      
      if (!currentPeriod) {
        // No active period, start a new one
        const nextEnding = experiment.band.allowedEndings[0]
        await startNewPeriod(experiment, nextEnding)
        continue
      }
      
      // Check if it's time to switch to the next ending
      const periodDuration = Date.now() - currentPeriod.startedAt.getTime()
      const cadenceMs = experiment.cadenceHours * 60 * 60 * 1000
      
      if (periodDuration >= cadenceMs) {
        // End current period
        await prisma.experimentPeriod.update({
          where: { id: currentPeriod.id },
          data: { endedAt: new Date() },
        })
        
        // Get next ending
        const nextEnding = getNextEnding(currentPeriod.ending, experiment.band.allowedEndings)
        
        // Start new period
        await startNewPeriod(experiment, nextEnding)
        
        // Check if we should promote or revert based on performance
        await checkExperimentPerformance(experiment)
      }
    }
    
    return NextResponse.json({ message: 'Switchback cron completed' })
    
  } catch (error) {
    console.error('Error in switchback cron:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}

async function startNewPeriod(experiment: any, ending: number) {
  // Create new period
  const newPeriod = await prisma.experimentPeriod.create({
    data: {
      experimentId: experiment.id,
      ending,
      startedAt: new Date(),
    },
  })
  
  // Get variants in this price band
  const variants = await prisma.variant.findMany({
    where: {
      shopId: experiment.shopId,
      priceCents: {
        gte: experiment.band.minCents,
        lte: experiment.band.maxCents,
      },
    },
  })
  
  // Update variant prices to new ending
  for (const variant of variants) {
    const newPriceCents = roundDownToEnding(variant.priceCents, ending)
    
    if (newPriceCents !== variant.priceCents) {
      // Record original price change
      await prisma.priceChange.create({
        data: {
          shopId: experiment.shopId,
          variantId: variant.id,
          experimentId: experiment.id,
          oldPriceCents: variant.priceCents,
          newPriceCents,
          reason: 'switchback',
        },
      })
      
      // Update in Shopify
      await updateVariantPrice(
        experiment.shop.accessTokenEnc,
        experiment.shop.domain,
        variant.shopifyVariantId.toString(),
        (newPriceCents / 100).toFixed(2)
      )
      
      // Update variant price in database
      await prisma.variant.update({
        where: { id: variant.id },
        data: { priceCents: newPriceCents },
      })
    }
  }
}

async function checkExperimentPerformance(experiment: any) {
  // Get all completed periods for this experiment
  const periods = await prisma.experimentPeriod.findMany({
    where: {
      experimentId: experiment.id,
      endedAt: { not: null },
    },
    orderBy: { startedAt: 'asc' },
  })
  
  // Need minimum cycles to make a decision
  if (periods.length < experiment.minCycles) {
    return
  }
  
  // Calculate RPV for each ending
  const endingPerformance = new Map<number, { rpv: number; sessions: number }>()
  
  for (const period of periods) {
    const rpv = calculateRPV(Number(period.revenueCents), period.sessions)
    const existing = endingPerformance.get(period.ending) || { rpv: 0, sessions: 0 }
    
    endingPerformance.set(period.ending, {
      rpv: existing.rpv + rpv,
      sessions: existing.sessions + period.sessions,
    })
  }
  
  // Find best performing ending
  let bestEnding = -1
  let bestRPV = -1
  
  for (const [ending, data] of endingPerformance) {
    const avgRPV = data.rpv / Math.max(data.sessions, 1)
    if (avgRPV > bestRPV) {
      bestRPV = avgRPV
      bestEnding = ending
    }
  }
  
  // Check if best ending meets threshold
  const baselineRPV = Math.min(...Array.from(endingPerformance.values()).map(d => d.rpv / Math.max(d.sessions, 1)))
  const improvement = (bestRPV - baselineRPV) / baselineRPV
  
  if (improvement >= experiment.revertThresholdRpv) {
    // Promote the best ending
    await prisma.experiment.update({
      where: { id: experiment.id },
      data: {
        status: 'promoted',
        endedAt: new Date(),
      },
    })
    
    // Update all variants to best ending
    const variants = await prisma.variant.findMany({
      where: {
        shopId: experiment.shopId,
        priceCents: {
          gte: experiment.band.minCents,
          lte: experiment.band.maxCents,
        },
      },
    })
    
    for (const variant of variants) {
      const newPriceCents = roundDownToEnding(variant.priceCents, bestEnding)
      
      if (newPriceCents !== variant.priceCents) {
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
        
        await updateVariantPrice(
          experiment.shop.accessTokenEnc,
          experiment.shop.domain,
          variant.shopifyVariantId.toString(),
          (newPriceCents / 100).toFixed(2)
        )
        
        await prisma.variant.update({
          where: { id: variant.id },
          data: { priceCents: newPriceCents },
        })
      }
    }
  } else if (improvement < -experiment.revertThresholdRpv) {
    // Revert to original prices
    await prisma.experiment.update({
      where: { id: experiment.id },
      data: {
        status: 'reverted',
        endedAt: new Date(),
      },
    })
    
    // Revert logic would go here (similar to promote but using original prices)
  }
}
