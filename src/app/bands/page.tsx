'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Play, Pause, Home, ArrowLeft, Calendar, DollarSign, Target } from 'lucide-react'

interface PriceBand {
  id: string
  name: string
  minCents: number
  maxCents: number
  allowedEndings: number[]
  floorCents?: number
  excludeCollections: string[]
  excludeSkus: string[]
  createdAt: string
  updatedAt: string
}

export default function BandsPage() {
  const [bands, setBands] = useState<PriceBand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const response = await fetch('/api/bands')
        if (response.ok) {
          const data = await response.json()
          setBands(data)
        } else {
          setError('Failed to fetch bands')
        }
      } catch (err) {
        setError('Error loading bands')
      } finally {
        setLoading(false)
      }
    }

    fetchBands()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading price bands...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Bands</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Price Bands
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Define price ranges and allowed endings for your experiments
              </p>
            </div>
            <Link
              href="/bands/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Band
            </Link>
          </div>
        </div>

        {bands.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Target className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No price bands yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first price band to start testing different price endings and optimize your conversions.
            </p>
            <Link
              href="/bands/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Band
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Price Bands</h2>
              <p className="text-sm text-gray-600 mt-1">{bands.length} band{bands.length !== 1 ? 's' : ''} configured</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Price Range
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Allowed Endings
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bands.map((band, index) => (
                    <tr key={band.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{band.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{band.name}</div>
                            <div className="text-sm text-gray-500">ID: {band.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${(band.minCents / 100).toFixed(2)} - ${(band.maxCents / 100).toFixed(2)}
                        </div>
                        {band.floorCents && (
                          <div className="text-xs text-blue-600 mt-1">
                            Floor: ${(band.floorCents / 100).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {band.allowedEndings.map((ending) => (
                            <span
                              key={ending}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                            >
                              .{ending}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                          Inactive
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">
                        {new Date(band.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/bands/${band.id}`}
                            className="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" 
                            title="Delete Band"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
