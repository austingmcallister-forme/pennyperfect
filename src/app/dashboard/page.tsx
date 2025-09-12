'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

interface DashboardStats {
  activeExperiments: number
  priceBands: number
  revenueImpact: number
  productsTracked: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeExperiments: 0,
    priceBands: 0,
    revenueImpact: 0,
    productsTracked: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch bands and experiments data
        const [bandsResponse, experimentsResponse] = await Promise.all([
          fetch('/api/bands'),
          fetch('/api/experiments')
        ])
        
        let bandsCount = 0
        let experimentsCount = 0
        
        if (bandsResponse.ok) {
          const bandsData = await bandsResponse.json()
          console.log('Dashboard: Fetched bands for dashboard:', bandsData)
          console.log('Dashboard: Bands count:', bandsData.length)
          bandsCount = bandsData.length
        } else {
          console.error('Dashboard: Failed to fetch bands:', bandsResponse.status, await bandsResponse.text())
        }
        
        if (experimentsResponse.ok) {
          const experimentsData = await experimentsResponse.json()
          experimentsCount = experimentsData.filter((exp: any) => exp.status === 'running').length
        }
        
        setStats({
          activeExperiments: experimentsCount,
          priceBands: bandsCount,
          revenueImpact: 0, // TODO: Calculate from experiment results
          productsTracked: 0 // TODO: Calculate from bands and experiments
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center">
                <Image 
                  src="/PENNY PERFECT LOGO.png" 
                  alt="PennyPerfect Logo" 
                  width={48}
                  height={48}
                  className="mr-3"
                />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Penny<span className="italic">P</span>erfect
                </h1>
              </div>
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
        {/* Getting Started Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-500/20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Set up your first price experiment and start optimizing revenue with AI-powered pricing
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Price Bands</h3>
                <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                  Define price ranges and allowed endings (.99, .95, .90) for different product categories
                </p>
                <Link
                  href="/bands/new"
                  className="inline-flex items-center px-5 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Band
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Start Experiments</h3>
                <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                  Launch switchback tests that automatically cycle through price endings
                </p>
                <Link
                  href="/experiments/new"
                  className="inline-flex items-center px-5 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Test
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Optimize Automatically</h3>
                <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                  Watch as the system promotes winning prices and reverts underperformers
                </p>
                <Link
                  href="/experiments"
                  className="inline-flex items-center px-5 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Auto-Optimize
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Active Experiments</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-gradient-to-r from-blue-200 to-purple-200 h-8 w-8 rounded"></div>
                  ) : (
                    stats.activeExperiments
                  )}
                </p>
                <p className="text-xs text-blue-600 mt-1">Running tests</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-sm border border-green-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Price Bands</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-gradient-to-r from-green-200 to-teal-200 h-8 w-8 rounded"></div>
                  ) : (
                    stats.priceBands
                  )}
                </p>
                <p className="text-xs text-green-600 mt-1">Configured ranges</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Revenue Impact</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-gradient-to-r from-emerald-200 to-lime-200 h-8 w-12 rounded"></div>
                  ) : (
                    `+${stats.revenueImpact}%`
                  )}
                </p>
                <p className="text-xs text-emerald-600 mt-1">vs baseline</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-lime-600 rounded-lg shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Products Tracked</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-gradient-to-r from-purple-200 to-indigo-200 h-8 w-8 rounded"></div>
                  ) : (
                    stats.productsTracked
                  )}
                </p>
                <p className="text-xs text-purple-600 mt-1">In experiments</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
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

      </div>
    </div>
  )
}
