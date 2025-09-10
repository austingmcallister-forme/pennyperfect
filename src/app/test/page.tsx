'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...')
        
        const [collectionsResponse, productsResponse] = await Promise.all([
          fetch('/api/shopify/collections'),
          fetch('/api/shopify/products')
        ])
        
        console.log('Collections response:', collectionsResponse.status)
        console.log('Products response:', productsResponse.status)
        
        if (collectionsResponse.ok) {
          const collectionsData = await collectionsResponse.json()
          console.log('Collections data:', collectionsData)
          setCollections(collectionsData)
        } else {
          console.error('Collections failed:', await collectionsResponse.text())
        }
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          console.log('Products data:', productsData)
          setProducts(productsData)
        } else {
          console.error('Products failed:', await productsResponse.text())
        }
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Collections ({collections.length})</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(collections, null, 2)}</pre>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products ({products.length})</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(products, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
