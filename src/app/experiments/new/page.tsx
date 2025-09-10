'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

interface PriceBand {
  id: string
  name: string
  minCents: number
  maxCents: number
  allowedEndings: number[]
  floorCents?: number
}

export default function NewExperimentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    bandId: '',
    cadenceHours: 24,
    revertThresholdRpv: 0.01,
    minSessions: 500,
    minCycles: 3,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bands, setBands] = useState<PriceBand[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch bands from API
  useEffect(() => {
    const fetchBands = async () => {
      try {
        const response = await fetch('/api/bands')
        if (response.ok) {
          const bandsData = await response.json()
          console.log('Fetched bands for experiment creator:', bandsData)
          setBands(bandsData)
        } else {
          console.error('Failed to fetch bands:', response.status)
        }
      } catch (error) {
        console.error('Error fetching bands:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBands()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const experiment = await response.json()
        router.push(`/experiments/${experiment.id}`)
      } else {
        console.error('Failed to create experiment')
      }
    } catch (error) {
      console.error('Error creating experiment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Rpv') ? parseFloat(value) : parseInt(value) || value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/experiments"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Experiments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">New Experiment</h1>
          <p className="mt-2 text-gray-600">
            Create a switchback test to find optimal price endings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiment Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="bandId" className="block text-sm font-medium text-gray-700">
                  Price Band
                </label>
                <select
                  id="bandId"
                  name="bandId"
                  value={formData.bandId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                >
                  <option value="">
                    {loading ? 'Loading bands...' : 'Select a price band'}
                  </option>
                  {bands.map((band) => (
                    <option key={band.id} value={band.id}>
                      {band.name} (${(band.minCents / 100).toFixed(2)} - ${(band.maxCents / 100).toFixed(2)})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Choose which price range to test
                </p>
                {!loading && bands.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    No price bands available. <Link href="/bands/new" className="text-blue-600 hover:text-blue-800 underline">Create one first</Link>.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cadenceHours" className="block text-sm font-medium text-gray-700">
                  Switch Cadence (hours)
                </label>
                <input
                  type="number"
                  id="cadenceHours"
                  name="cadenceHours"
                  value={formData.cadenceHours}
                  onChange={handleChange}
                  min="1"
                  max="168"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How often to switch between price endings (1-168 hours)
                </p>
              </div>

              <div>
                <label htmlFor="revertThresholdRpv" className="block text-sm font-medium text-gray-700">
                  RPV Improvement Threshold
                </label>
                <input
                  type="number"
                  id="revertThresholdRpv"
                  name="revertThresholdRpv"
                  value={formData.revertThresholdRpv}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  step="0.01"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum RPV improvement to promote (0.01 = 1% improvement)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minSessions" className="block text-sm font-medium text-gray-700">
                    Minimum Sessions
                  </label>
                  <input
                    type="number"
                    id="minSessions"
                    name="minSessions"
                    value={formData.minSessions}
                    onChange={handleChange}
                    min="100"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum sessions per period
                  </p>
                </div>

                <div>
                  <label htmlFor="minCycles" className="block text-sm font-medium text-gray-700">
                    Minimum Cycles
                  </label>
                  <input
                    type="number"
                    id="minCycles"
                    name="minCycles"
                    value={formData.minCycles}
                    onChange={handleChange}
                    min="2"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum cycles before decision
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/experiments"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.bandId}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Experiment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
