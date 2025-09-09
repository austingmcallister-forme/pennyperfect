'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, TrendingUp, Clock, DollarSign, BarChart3 } from 'lucide-react'

interface ExperimentPeriod {
  id: string
  ending: number
  startedAt: string
  endedAt?: string
  sessions: number
  orders: number
  revenueCents: number
}

interface Experiment {
  id: string
  band: {
    name: string
    minCents: number
    maxCents: number
    allowedEndings: number[]
  }
  status: string
  cadenceHours: number
  revertThresholdRpv: number
  minSessions: number
  minCycles: number
  startedAt: string
  endedAt?: string
  periods: ExperimentPeriod[]
}

export default function ExperimentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiment()
  }, [params.id])

  const fetchExperiment = async () => {
    try {
      const response = await fetch(`/api/experiments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setExperiment(data)
      }
    } catch (error) {
      console.error('Error fetching experiment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async () => {
    setActionLoading('promote')
    try {
      const response = await fetch(`/api/experiments/${params.id}/promote`, {
        method: 'POST',
      })
      if (response.ok) {
        await fetchExperiment()
      }
    } catch (error) {
      console.error('Error promoting experiment:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRevert = async () => {
    setActionLoading('revert')
    try {
      const response = await fetch(`/api/experiments/${params.id}/revert`, {
        method: 'POST',
      })
      if (response.ok) {
        await fetchExperiment()
      }
    } catch (error) {
      console.error('Error reverting experiment:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusChange = async (status: string) => {
    setActionLoading('status')
    try {
      const response = await fetch(`/api/experiments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        await fetchExperiment()
      }
    } catch (error) {
      console.error('Error updating experiment status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'promoted':
        return 'bg-blue-100 text-blue-800'
      case 'reverted':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateRPV = (revenueCents: number | bigint, sessions: number) => {
    const revenue = typeof revenueCents === 'bigint' ? Number(revenueCents) : revenueCents
    return sessions > 0 ? (revenue / sessions).toFixed(2) : '0.00'
  }

  const calculateCVR = (orders: number, sessions: number) => {
    return sessions > 0 ? ((orders / sessions) * 100).toFixed(2) : '0.00'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiment...</p>
        </div>
      </div>
    )
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experiment Not Found</h1>
          <Link
            href="/experiments"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Experiments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/experiments"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Experiments
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{experiment.band.name}</h1>
              <p className="mt-2 text-gray-600">
                Started {new Date(experiment.startedAt).toLocaleDateString()}
                {experiment.endedAt && (
                  <span> • Ended {new Date(experiment.endedAt).toLocaleDateString()}</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  experiment.status
                )}`}
              >
                {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
              </span>
              {experiment.status === 'running' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange('paused')}
                    disabled={actionLoading === 'status'}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </button>
                  <button
                    onClick={handlePromote}
                    disabled={actionLoading === 'promote'}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Promote
                  </button>
                  <button
                    onClick={handleRevert}
                    disabled={actionLoading === 'revert'}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    Revert
                  </button>
                </div>
              )}
              {experiment.status === 'paused' && (
                <button
                  onClick={() => handleStatusChange('running')}
                  disabled={actionLoading === 'status'}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Experiment Configuration */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {experiment.cadenceHours}h cadence
                </p>
                <p className="text-xs text-gray-500">Switch interval</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {experiment.revertThresholdRpv * 100}% threshold
                </p>
                <p className="text-xs text-gray-500">RPV improvement</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {experiment.minSessions} min sessions
                </p>
                <p className="text-xs text-gray-500">Required data</p>
              </div>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {experiment.minCycles} min cycles
                </p>
                <p className="text-xs text-gray-500">Before decision</p>
              </div>
            </div>
          </div>
        </div>

        {/* Periods Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Period Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experiment.periods.map((period, index) => (
              <div
                key={period.id}
                className={`border rounded-lg p-4 ${
                  period.endedAt ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    .{period.ending} ending
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Period {index + 1}
                    </span>
                    {!period.endedAt && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sessions:</span>
                    <span className="font-medium">{period.sessions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-medium">{period.orders.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">
                      ${(Number(period.revenueCents) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CVR:</span>
                    <span className="font-medium">
                      {calculateCVR(period.orders, period.sessions)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">RPV:</span>
                    <span className="font-medium">
                      ${calculateRPV(Number(period.revenueCents), period.sessions)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(period.startedAt).toLocaleDateString()} -{' '}
                    {period.endedAt
                      ? new Date(period.endedAt).toLocaleDateString()
                      : 'Ongoing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
