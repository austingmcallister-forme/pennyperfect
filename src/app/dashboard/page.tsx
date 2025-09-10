import { Suspense } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Settings, 
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PennyPerfect</h1>
              <p className="mt-1 text-sm text-gray-600">
                Optimize your pricing with data-driven experiments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Test Mode</span>
              </div>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to PennyPerfect!</h2>
                <p className="text-blue-100 mb-4">
                  Ready to boost your revenue? Let's set up your first price experiment.
                </p>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/bands/new"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Price Band
                  </Link>
                  <Link
                    href="/experiments/new"
                    className="inline-flex items-center px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Start Experiment
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Experiments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-1">Running tests</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Bands</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-1">Configured ranges</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">+0%</p>
                <p className="text-xs text-gray-500 mt-1">vs baseline</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Tracked</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-1">In experiments</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Price Bands</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Define price ranges and allowed endings (.99, .95, .90) for your experiments
              </p>
              <div className="space-y-3">
                <Link
                  href="/bands"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">View All Bands</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
                <Link
                  href="/bands/new"
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-200 rounded-lg mr-3">
                      <Plus className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="font-medium text-blue-900">Create New Band</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Experiments</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Run switchback tests to automatically find the best price endings
              </p>
              <div className="space-y-3">
                <Link
                  href="/experiments"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">View All Experiments</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
                <Link
                  href="/experiments/new"
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-200 rounded-lg mr-3">
                      <Plus className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium text-green-900">Start New Experiment</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-400 group-hover:text-green-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Price Bands</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Define price ranges and allowed endings for different product categories
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Start Experiments</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Launch switchback tests that automatically cycle through price endings
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Optimize Automatically</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Watch as the system promotes winning prices and reverts underperformers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
