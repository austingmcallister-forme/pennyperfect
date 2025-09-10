'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, Home, Search, Check } from 'lucide-react'

export default function EditBandPage() {
  const router = useRouter()
  const params = useParams()
  const bandId = params.id as string
  
  const [formData, setFormData] = useState({
    name: '',
    minCents: 0,
    maxCents: 0,
    allowedEndings: [99] as number[],
    floorCents: '',
    excludeCollections: [] as string[],
    excludeSkus: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for collections and products data
  const [collections, setCollections] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loadingCollections, setLoadingCollections] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false)
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [collectionSearch, setCollectionSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  // Fetch band data and collections/products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch band data
        const bandResponse = await fetch(`/api/bands/${bandId}`)
        if (bandResponse.ok) {
          const bandData = await bandResponse.json()
          setFormData({
            name: bandData.name || '',
            minCents: bandData.minCents || 0,
            maxCents: bandData.maxCents || 0,
            allowedEndings: bandData.allowedEndings || [99],
            floorCents: bandData.floorCents ? String(bandData.floorCents) : '',
            excludeCollections: bandData.excludeCollections || [],
            excludeSkus: bandData.excludeSkus || [],
          })
        }
        
        // Fetch collections and products
        setLoadingCollections(true)
        setLoadingProducts(true)
        
        const [collectionsResponse, productsResponse] = await Promise.all([
          fetch('/api/shopify/collections'),
          fetch('/api/shopify/products')
        ])
        
        if (collectionsResponse.ok) {
          const collectionsData = await collectionsResponse.json()
          console.log('Fetched collections:', collectionsData)
          setCollections(collectionsData)
        }
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          console.log('Fetched products:', productsData)
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load band data')
      } finally {
        setLoading(false)
        setLoadingCollections(false)
        setLoadingProducts(false)
      }
    }
    
    fetchData()
  }, [bandId])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowCollectionDropdown(false)
        setShowProductDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const requestData = {
        ...formData,
        floorCents: formData.floorCents && formData.floorCents !== '' ? parseInt(formData.floorCents) : undefined,
      }
      
      console.log('Sending data:', JSON.stringify(requestData, null, 2))
      
      const response = await fetch(`/api/bands/${bandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        router.push(`/bands/${bandId}`)
      } else {
        const errorData = await response.json()
        console.error('Failed to update band:', errorData)
        alert(`Failed to update band: ${JSON.stringify(errorData, null, 2)}`)
      }
    } catch (error) {
      console.error('Error updating band:', error)
      alert('Error updating band. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleEnding = (ending: number) => {
    setFormData(prev => ({
      ...prev,
      allowedEndings: prev.allowedEndings.includes(ending)
        ? prev.allowedEndings.filter(e => e !== ending)
        : [...prev.allowedEndings, ending],
    }))
  }

  const addCollection = (collectionHandle: string) => {
    console.log('Adding collection:', collectionHandle)
    if (collectionHandle && !formData.excludeCollections.includes(collectionHandle)) {
      setFormData(prev => ({
        ...prev,
        excludeCollections: [...prev.excludeCollections, collectionHandle],
      }))
    }
    setShowCollectionDropdown(false)
    setCollectionSearch('')
  }

  const removeCollection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludeCollections: prev.excludeCollections.filter((_, i) => i !== index),
    }))
  }

  const addSku = (sku: string) => {
    console.log('Adding SKU:', sku)
    if (sku && !formData.excludeSkus.includes(sku)) {
      setFormData(prev => ({
        ...prev,
        excludeSkus: [...prev.excludeSkus, sku],
      }))
    }
    setShowProductDropdown(false)
    setProductSearch('')
  }

  const removeSku = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludeSkus: prev.excludeSkus.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading band data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/bands" className="text-blue-600 hover:text-blue-800">
            ← Back to Price Bands
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/bands" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Price Bands
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Edit Band</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Price Band</h1>
          <p className="mt-2 text-gray-600">Update your price band configuration</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Band Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Mid-Range Products"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="minCents" className="block text-sm font-medium text-gray-700">
                    Minimum Price (cents)
                  </label>
                  <input
                    type="number"
                    id="minCents"
                    name="minCents"
                    value={formData.minCents}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="20000"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    ${(formData.minCents / 100).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label htmlFor="maxCents" className="block text-sm font-medium text-gray-700">
                    Maximum Price (cents)
                  </label>
                  <input
                    type="number"
                    id="maxCents"
                    name="maxCents"
                    value={formData.maxCents}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="50000"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    ${(formData.maxCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Price Endings
                </label>
                <div className="flex space-x-2">
                  {[99, 95, 90, 85, 80].map((ending) => (
                    <button
                      key={ending}
                      type="button"
                      onClick={() => toggleEnding(ending)}
                      className={`px-3 py-2 text-sm font-medium rounded-md border ${
                        formData.allowedEndings.includes(ending)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      .{ending}
                    </button>
                  ))}
                </div>
                <div className="mt-2 p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800 font-medium mb-1">🎯 What This Tests</p>
                  <p className="text-sm text-green-700">
                    PennyPerfect will automatically cycle through these endings (e.g., $19.99 → $19.95 → $19.90) 
                    to find which converts best for your customers.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="floorCents" className="block text-sm font-medium text-gray-700">
                  Floor Price (cents) - Optional
                </label>
                <input
                  type="number"
                  id="floorCents"
                  name="floorCents"
                  value={formData.floorCents}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1500"
                />
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800 font-medium mb-1">🛡️ Price Protection</p>
                  <p className="text-sm text-blue-700">
                    Prevents prices from going below ${(parseInt(formData.floorCents) / 100).toFixed(2) || 'your minimum'}.
                    Perfect for protecting profit margins or respecting MAP policies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusions Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Exclusions</h2>
            <div className="mb-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800 font-medium mb-1">⚠️ Skip These Products</p>
              <p className="text-sm text-yellow-700">
                Add collections or SKUs that should never be included in price experiments (e.g., clearance items, loss leaders).
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exclude Collections
                </label>
                <div className="relative dropdown-container">
                  <div className="flex space-x-2 mb-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={collectionSearch}
                        onChange={(e) => {
                          setCollectionSearch(e.target.value)
                          setShowCollectionDropdown(true)
                        }}
                        onFocus={() => setShowCollectionDropdown(true)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search collections..."
                      />
                      {showCollectionDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {loadingCollections ? (
                            <div className="px-3 py-2 text-gray-500">Loading collections...</div>
                          ) : (
                            collections
                              .filter(collection => 
                                collectionSearch === '' || 
                                collection.title.toLowerCase().includes(collectionSearch.toLowerCase()) ||
                                collection.handle.toLowerCase().includes(collectionSearch.toLowerCase())
                              )
                              .filter(collection => !formData.excludeCollections.includes(collection.handle))
                              .map((collection) => (
                                <div
                                  key={collection.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                  onClick={() => addCollection(collection.handle)}
                                >
                                  <div className="flex items-center">
                                    <span className="font-normal block truncate">
                                      {collection.title}
                                    </span>
                                    <span className="ml-2 text-gray-500 text-sm">
                                      ({collection.handle})
                                    </span>
                                  </div>
                                </div>
                              ))
                          )}
                          {collections.filter(collection => 
                            collectionSearch === '' || 
                            collection.title.toLowerCase().includes(collectionSearch.toLowerCase()) ||
                            collection.handle.toLowerCase().includes(collectionSearch.toLowerCase())
                          ).filter(collection => !formData.excludeCollections.includes(collection.handle)).length === 0 && !loadingCollections && (
                            <div className="px-3 py-2 text-gray-500">No collections found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excludeCollections.map((collectionHandle, index) => {
                      const collection = collections.find(c => c.handle === collectionHandle)
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {collection ? collection.title : collectionHandle}
                          <button
                            type="button"
                            onClick={() => removeCollection(index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exclude SKUs
                </label>
                <div className="relative dropdown-container">
                  <div className="flex space-x-2 mb-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value)
                          setShowProductDropdown(true)
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search products by name or SKU..."
                      />
                      {showProductDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {loadingProducts ? (
                            <div className="px-3 py-2 text-gray-500">Loading products...</div>
                          ) : (
                            products
                              .filter(product => 
                                productSearch === '' ||
                                product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                                product.sku.toLowerCase().includes(productSearch.toLowerCase())
                              )
                              .filter(product => !formData.excludeSkus.includes(product.sku))
                              .map((product) => (
                                <div
                                  key={product.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                  onClick={() => addSku(product.sku)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="font-normal block truncate">
                                        {product.title}
                                      </span>
                                      <span className="text-gray-500 text-sm">
                                        SKU: {product.sku}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                          {products.filter(product => 
                            productSearch === '' ||
                            product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                            product.sku.toLowerCase().includes(productSearch.toLowerCase())
                          ).filter(product => !formData.excludeSkus.includes(product.sku)).length === 0 && !loadingProducts && (
                            <div className="px-3 py-2 text-gray-500">No products found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excludeSkus.map((sku, index) => {
                      const product = products.find(p => p.sku === sku)
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {product ? `${product.title} (${sku})` : sku}
                          <button
                            type="button"
                            onClick={() => removeSku(index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href={`/bands/${bandId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Band
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
