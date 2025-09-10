import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we don't have Shopify integration yet
    // In production, this would fetch from Shopify API using the shop's access token
    
    const mockCollections = [
      { id: '1', title: 'Electronics', handle: 'electronics' },
      { id: '2', title: 'Clothing', handle: 'clothing' },
      { id: '3', title: 'Home & Garden', handle: 'home-garden' },
      { id: '4', title: 'Sports & Outdoors', handle: 'sports-outdoors' },
      { id: '5', title: 'Books', handle: 'books' },
      { id: '6', title: 'Toys & Games', handle: 'toys-games' },
      { id: '7', title: 'Beauty & Health', handle: 'beauty-health' },
      { id: '8', title: 'Automotive', handle: 'automotive' },
    ]

    return NextResponse.json(mockCollections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}
