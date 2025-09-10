import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we don't have Shopify integration yet
    // In production, this would fetch from Shopify API using the shop's access token
    
    const mockProducts = [
      { id: '1', title: 'Wireless Headphones', sku: 'WH-001', handle: 'wireless-headphones' },
      { id: '2', title: 'Smart Watch', sku: 'SW-002', handle: 'smart-watch' },
      { id: '3', title: 'Bluetooth Speaker', sku: 'BS-003', handle: 'bluetooth-speaker' },
      { id: '4', title: 'Phone Case', sku: 'PC-004', handle: 'phone-case' },
      { id: '5', title: 'Laptop Stand', sku: 'LS-005', handle: 'laptop-stand' },
      { id: '6', title: 'USB Cable', sku: 'UC-006', handle: 'usb-cable' },
      { id: '7', title: 'Power Bank', sku: 'PB-007', handle: 'power-bank' },
      { id: '8', title: 'Screen Protector', sku: 'SP-008', handle: 'screen-protector' },
      { id: '9', title: 'Car Mount', sku: 'CM-009', handle: 'car-mount' },
      { id: '10', title: 'Wireless Charger', sku: 'WC-010', handle: 'wireless-charger' },
    ]

    return NextResponse.json(mockProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
