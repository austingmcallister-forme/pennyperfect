'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

export default function NewBandPage() {
  const router = useRouter()
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
  const [newCollection, setNewCollection] = useState('')
  const [newSku, setNewSku] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          floorCents: formData.floorCents && formData.floorCents !== '' ? parseInt(formData.floorCents) : undefined,
        }),
      })

      if (response.ok) {
        const band = await response.json()
        router.push(`/bands/${band.id}`)
      } else {
        console.error('Failed to create band')
      }
    } catch (error) {
      console.error('Error creating band:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Cents') ? parseInt(value) || 0 : value,
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

  const addCollection = () => {
    if (newCollection.trim()) {
      setFormData(prev => ({
        ...prev,
        excludeCollections: [...prev.excludeCollections, newCollection.trim()],
      }))
      setNewCollection('')
    }
  }

  const removeCollection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludeCollections: prev.excludeCollections.filter((_, i) => i !== index),
    }))
  }

  const addSku = () => {
    if (newSku.trim()) {
      setFormData(prev => ({
        ...prev,
        excludeSkus: [...prev.excludeSkus, newSku.trim()],
      }))
      setNewSku('')
    }
  }

  const removeSku = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludeSkus: prev.excludeSkus.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/bands"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Price Bands
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Price Band</h1>
          <p className="mt-2 text-gray-600">
            Define a price range and allowed endings for your experiments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Configuration</h2>
            
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="2000"
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
                    placeholder="5000"
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
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCollection}
                    onChange={(e) => setNewCollection(e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Collection handle"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCollection())}
                  />
                  <button
                    type="button"
                    onClick={addCollection}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.excludeCollections.map((collection, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {collection}
                      <button
                        type="button"
                        onClick={() => removeCollection(index)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exclude SKUs
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="SKU"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSku())}
                  />
                  <button
                    type="button"
                    onClick={addSku}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.excludeSkus.map((sku, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {sku}
                      <button
                        type="button"
                        onClick={() => removeSku(index)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/bands"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || formData.allowedEndings.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Band'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
