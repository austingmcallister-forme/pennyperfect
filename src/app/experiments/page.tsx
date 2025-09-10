'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Play, Pause, TrendingUp, Clock, DollarSign, Home, BarChart3, Target, Zap } from 'lucide-react'

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, use mock data. Later this will fetch from API
    setExperiments([
    {
      id: '1',
      bandName: 'Mid-Range Products',
      status: 'running',
      cadenceHours: 24,
      revertThresholdRpv: 0.01,
      minSessions: 500,
      minCycles: 3,
      startedAt: '2024-01-15T10:00:00Z',
      periods: [
        { ending: 99, sessions: 150, orders: 12, revenueCents: 2400 },
        { ending: 95, sessions: 180, orders: 18, revenueCents: 3600 },
        { ending: 90, sessions: 120, orders: 8, revenueCents: 1600 },
      ],
    },
    {
      id: '2',
      bandName: 'Premium Products',
      status: 'promoted',
      cadenceHours: 48,
      revertThresholdRpv: 0.02,
      minSessions: 1000,
      minCycles: 5,
      startedAt: '2024-01-10T10:00:00Z',
      endedAt: '2024-01-20T10:00:00Z',
      periods: [
        { ending: 99, sessions: 300, orders: 25, revenueCents: 7500 },
        { ending: 95, sessions: 280, orders: 30, revenueCents: 9000 },
      ],
    },
  ])
    setLoading(false)
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Experiments
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Monitor your switchback price ending tests
              </p>
            </div>
            <Link
              href="/experiments/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Experiment
            </Link>
          </div>
        </div>


        {experiments.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiments yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first experiment to start testing different price endings and optimize your conversions.
            </p>
            <Link
              href="/experiments/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Experiment
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {experiments.map((experiment) => (
              <div key={experiment.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {experiment.bandName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Started {new Date(experiment.startedAt).toLocaleDateString()}
                          {experiment.endedAt && (
                            <span> • Ended {new Date(experiment.endedAt).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          experiment.status
                        )}`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          experiment.status === 'running' ? 'bg-green-500' :
                          experiment.status === 'promoted' ? 'bg-blue-500' :
                          experiment.status === 'reverted' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                      </span>
                      <div className="flex space-x-2">
                        {experiment.status === 'running' ? (
                          <button className="inline-flex items-center px-3 py-2 border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {experiment.cadenceHours}h cadence
                        </p>
                        <p className="text-xs text-gray-600">Switch interval</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {experiment.revertThresholdRpv * 100}% threshold
                        </p>
                        <p className="text-xs text-gray-600">RPV improvement</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {experiment.minSessions} min sessions
                        </p>
                        <p className="text-xs text-gray-600">Required data</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {experiment.minCycles} min cycles
                        </p>
                        <p className="text-xs text-gray-600">Before decision</p>
                      </div>
                    </div>
                  </div>

                  {/* Periods Performance */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
                      Period Performance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {experiment.periods.map((period, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-900">
                              .{period.ending} ending
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Period {index + 1}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Sessions:</span>
                              <span className="font-semibold text-gray-900">{period.sessions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Orders:</span>
                              <span className="font-semibold text-gray-900">{period.orders}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Revenue:</span>
                              <span className="font-semibold text-gray-900">
                                ${(period.revenueCents / 100).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">RPV:</span>
                              <span className="font-semibold text-green-600">
                                ${calculateRPV(period.revenueCents, period.sessions)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
