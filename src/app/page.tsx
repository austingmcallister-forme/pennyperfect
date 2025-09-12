import Link from 'next/link'
import { ShoppingBag, TrendingUp, Target, Zap } from 'lucide-react'

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-red-500 mb-4">
            🔥 Penny<span className="italic">P</span>erfect 🔥
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Auto-test price endings with switchback experiments to maximize revenue
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="h-6 w-6 mr-2" />
              Test App (Skip OAuth)
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Testing</h3>
            <p className="text-gray-600">
              Automatically test .99, .95, and .90 price endings to find what works best
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Boost</h3>
            <p className="text-gray-600">
              Increase revenue per visitor and conversion rates with data-driven pricing
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Decision</h3>
            <p className="text-gray-600">
              Automatically promote winning prices or revert based on performance thresholds
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <ShoppingBag className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Setup</h3>
            <p className="text-gray-600">
              Get started in minutes with simple price band configuration
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Price Bands</h3>
              <p className="text-gray-600">
                Define price ranges and allowed endings for different product categories
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Experiments</h3>
              <p className="text-gray-600">
                Launch switchback tests that automatically cycle through price endings
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimize Automatically</h3>
              <p className="text-gray-600">
                Watch as the system promotes winning prices and reverts underperformers
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Boost Your Revenue?
          </h2>
          <p className="text-gray-600 mb-8">
            Join stores already using PennyPerfect to optimize their pricing strategy
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag className="h-6 w-6 mr-2" />
            Test PennyPerfect Now
          </Link>
        </div>
      </div>
    </div>
  )
}
