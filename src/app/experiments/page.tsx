import Link from 'next/link'
import { Plus, Play, Pause, TrendingUp, Clock, DollarSign } from 'lucide-react'

export default function ExperimentsPage() {
  // This would be populated with real data from API
  const experiments = [
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
  ]

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
            <p className="mt-2 text-gray-600">
              Monitor your switchback price ending tests
            </p>
          </div>
          <Link
            href="/experiments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Experiment
          </Link>
        </div>

        <div className="space-y-6">
          {experiments.map((experiment) => (
            <div key={experiment.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {experiment.bandName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Started {new Date(experiment.startedAt).toLocaleDateString()}
                      {experiment.endedAt && (
                        <span> • Ended {new Date(experiment.endedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        experiment.status
                      )}`}
                    >
                      {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                    </span>
                    <div className="flex space-x-2">
                      {experiment.status === 'running' ? (
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                    <div className="h-5 w-5 bg-gray-400 rounded mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {experiment.minCycles} min cycles
                      </p>
                      <p className="text-xs text-gray-500">Before decision</p>
                    </div>
                  </div>
                </div>

                {/* Periods Performance */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Period Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {experiment.periods.map((period, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            .{period.ending} ending
                          </span>
                          <span className="text-xs text-gray-500">
                            Period {index + 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Sessions:</span>
                            <span className="font-medium">{period.sessions}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Orders:</span>
                            <span className="font-medium">{period.orders}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium">
                              ${(period.revenueCents / 100).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">RPV:</span>
                            <span className="font-medium">
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

        {experiments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No experiments created yet</div>
            <Link
              href="/experiments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Experiment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
