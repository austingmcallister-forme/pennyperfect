/**
 * Pricing utilities for PennyPerfect
 * Handles price rounding down to target endings (99, 95, 90)
 */

export interface PriceBand {
  minCents: number
  maxCents: number
  allowedEndings: number[]
  floorCents?: number
}

export function roundDownToEnding(priceCents: number, targetEnding: number): number {
  // Convert to dollars for easier calculation
  const priceDollars = priceCents / 100
  
  // Round down to nearest dollar, then add target ending
  const baseDollars = Math.floor(priceDollars)
  const newPriceDollars = baseDollars + (targetEnding / 100)
  
  // Convert back to cents
  return Math.round(newPriceDollars * 100)
}

export function getNextEnding(
  currentEnding: number,
  allowedEndings: number[]
): number {
  const currentIndex = allowedEndings.indexOf(currentEnding)
  const nextIndex = (currentIndex + 1) % allowedEndings.length
  return allowedEndings[nextIndex]
}

export function isPriceInBand(priceCents: number, band: PriceBand): boolean {
  if (priceCents < band.minCents || priceCents > band.maxCents) {
    return false
  }
  
  if (band.floorCents && priceCents < band.floorCents) {
    return false
  }
  
  return true
}

export function calculateRPV(
  revenueCents: number | bigint,
  sessions: number
): number {
  if (sessions === 0) return 0
  const revenue = typeof revenueCents === 'bigint' ? Number(revenueCents) : revenueCents
  return revenue / sessions
}

export function calculateCVR(orders: number, sessions: number): number {
  if (sessions === 0) return 0
  return orders / sessions
}

export function calculateAOV(revenueCents: number | bigint, orders: number): number {
  if (orders === 0) return 0
  const revenue = typeof revenueCents === 'bigint' ? Number(revenueCents) : revenueCents
  return revenue / orders
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function parsePrice(priceString: string): number {
  // Remove $ and parse to cents
  const cleanPrice = priceString.replace(/[$,]/g, '')
  return Math.round(parseFloat(cleanPrice) * 100)
}