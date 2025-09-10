'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
imenboarimport { ArrowLeft, Edit, Trash2, Play, Pause, BarChart3, Home, Zap, CheckCircle, AlertCircle } from 'lucide-react'

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

export default function BandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [band, setBand] = useState<PriceBand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingExperiment, setIsCreatingExperiment] = useState(false)
  const [experimentSuccess, setExperimentSuccess] = useState<string | null>(null)
  const [experimentError, setExperimentError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBand = async () => {
      try {
        const response = await fetch('/api/bands')
        if (response.ok) {
          const bands = await response.json()
          const foundBand = bands.find((b: PriceBand) => b.id === params.id)
          if (foundBand) {
            setBand(foundBand)
          } else {
            setError('Band not found')
          }
        } else {
          setError('Failed to fetch band')
        }
      } catch (err) {
        setError('Error loading band')
      } finally {
        setLoading(false)
      }
    }

    fetchBand()
  }, [params.id])

  const handleStartExperiment = async () => {
    if (!band) return
    
    setIsCreatingExperiment(true)
    setExperimentError(null)
    setExperimentSuccess(null)
    
    try {
      const experimentData = {
        bandId: band.id,
        cadenceHours: 24, // Default 24-hour cadence
        revertThresholdRpv: 0.01, // Default 1% improvement threshold
        minSessions: 500, // Default minimum sessions
        minCycles: 3, // Default minimum cycles
      }
      
      console.log('Creating experiment with data:', experimentData)
      
      const response = await fetch('/api/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experimentData),
      })
      
      if (response.ok) {
        const experiment = await response.json()
        setExperimentSuccess(`Experiment "${experiment.id}" started successfully!`)
        // Redirect to experiments page after a short delay
        setTimeout(() => {
          router.push('/experiments')
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Failed to create experiment:', errorData)
        setExperimentError(`Failed to create experiment: ${JSON.stringify(errorData, null, 2)}`)
      }
    } catch (error) {
      console.error('Error creating experiment:', error)
      setExperimentError('Error creating experiment. Please try again.')
    } finally {
      setIsCreatingExperiment(false)
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatEndings = (endings: number[]) => {
    return endings.map(ending => `.${ending}`).join(', ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading band details...</p>
        </div>
      </div>
    )
  }

  if (error || !band) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Band Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested band could not be found.'}</p>
          <Link
            href="/bands"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Price Bands
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 text-sm">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/bands"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Price Bands
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{band.name}</span>
          </div>
        </div>

        {/* Success/Error Messages */}
        {experimentSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{experimentSuccess}</p>
          </div>
        )}
        
        {experimentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{experimentError}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{band.name}</h1>
              <p className="mt-2 text-gray-600">
                Created {new Date(band.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button 
                onClick={handleStartExperiment}
                disabled={isCreatingExperiment}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isCreatingExperiment 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isCreatingExperiment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Experiment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Range */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Price</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(band.minCents)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maximum Price</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(band.maxCents)}</p>
                </div>
              </div>
              {band.floorCents && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700">Floor Price</label>
                  <p className="mt-1 text-lg font-semibold text-blue-600">{formatPrice(band.floorCents)}</p>
                  <p className="text-sm text-gray-500">Prices will never go below this amount</p>
                </div>
              )}
            </div>

            {/* Allowed Endings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Allowed Price Endings</h2>
              <div className="flex flex-wrap gap-2">
                {band.allowedEndings.map((ending) => (
                  <span
                    key={ending}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    .{ending}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                PennyPerfect will cycle through these endings to find which converts best.
              </p>
            </div>

            {/* Exclusions */}
            {(band.excludeCollections.length > 0 || band.excludeSkus.length > 0) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Exclusions</h2>
                
                {band.excludeCollections.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded Collections</h3>
                    <div className="space-y-1">
                      {band.excludeCollections.map((collection, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded mr-2 mb-1"
                        >
                          {collection}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {band.excludeSkus.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Excluded SKUs</h3>
                    <div className="space-y-1">
                      {band.excludeSkus.map((sku, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded mr-2 mb-1"
                        >
                          {sku}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Inactive</p>
                  <p className="text-sm text-gray-500">No experiments running</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleStartExperiment}
                  disabled={isCreatingExperiment}
                  className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    isCreatingExperiment 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isCreatingExperiment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Experiment
                    </>
                  )}
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Band
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Band
                </button>
              </div>
            </div>

            {/* Band Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Band Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Band ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{band.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(band.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(band.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
