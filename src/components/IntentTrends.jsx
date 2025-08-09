import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Activity, 
  RefreshCw, 
  BarChart3,
  PieChart,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BASE_URL = 'https://keypilot.onrender.com'

function IntentTrends() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [params, setParams] = useState({
    days: 30,
    detailed: true,
    models: ''
  })

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  const fetchCostAnalytics = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    if (!user?.userId) {
      toast.error('User ID not available')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        days: params.days.toString(),
        detailed: params.detailed.toString()
      })

      if (params.models) {
        queryParams.append('models', params.models)
      }

      const response = await fetch(`${BASE_URL}/api/analytics/costs/${user.userId}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      
      if (response.ok) {
        setAnalyticsData(result)
        toast.success('Cost analytics loaded successfully! �')
      } else {
        toast.error(`Analysis failed: ${result.error || 'Unknown error'}`)
        setAnalyticsData({ error: result })
      }
    } catch (error) {
      console.error('Cost analytics error:', error)
      toast.error('Failed to connect to analytics endpoint')
      setAnalyticsData({ error: { message: error.message } })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCostAnalytics()
  }, [])

  const generateMockTrendData = () => {
    if (!analyticsData || analyticsData.error) return []
    
    const days = []
    const totalDays = params.days
    const avgDailyCost = analyticsData.averages?.dailyCost || 0
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Generate realistic cost variations
      const variation = (Math.random() - 0.5) * 0.4 + 1 // ±40% variation
      const cost = avgDailyCost * variation
      const tokens = analyticsData.averages?.dailyTokens * variation || 0
      
      days.push({
        date: date.toISOString().split('T')[0],
        cost: Math.max(0, cost),
        tokens: Math.max(0, Math.round(tokens)),
        requests: Math.round(Math.random() * 100 + 20)
      })
    }
    
    return days
  }

  const getModelBreakdownData = () => {
    if (!analyticsData?.modelBreakdown) return []
    
    return Object.entries(analyticsData.modelBreakdown).map(([model, data]) => ({
      name: model,
      cost: data.cost,
      tokens: data.tokens,
      avgCostPerToken: data.averageCostPerToken
    }))
  }

  const generateCurl = () => {
    const queryParams = new URLSearchParams({
      days: params.days.toString(),
      detailed: params.detailed.toString()
    })

    if (params.models) {
      queryParams.append('models', params.models)
    }

    return `curl -X GET "${BASE_URL}/api/analytics/costs/${user?.userId || 'USER_ID'}?${queryParams}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}"`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Cost Analytics & Trends</h2>
        </div>
        <p className="text-gray-400">
          Comprehensive cost analysis with usage patterns, model breakdowns, and optimization recommendations
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Analysis Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Analysis Period
            </label>
            <select
              value={params.days}
              onChange={(e) => setParams({ ...params, days: parseInt(e.target.value) })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Model Filter
            </label>
            <input
              type="text"
              placeholder="e.g., gpt-4,claude-3"
              value={params.models}
              onChange={(e) => setParams({ ...params, models: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={params.detailed}
                onChange={(e) => setParams({ ...params, detailed: e.target.checked })}
                className="rounded border-gray-600 bg-gray-900/50 text-blue-500 focus:ring-blue-500"
              />
              <span>Detailed breakdown</span>
            </label>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchCostAnalytics}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Analyze Costs</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* cURL Command */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">API Request</h3>
        <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
          {generateCurl()}
        </pre>
      </div>

      {/* Results */}
      {analyticsData && !analyticsData.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-blue-300">Total Cost</span>
              </div>
              <p className="text-2xl font-bold text-white">${analyticsData.totalCost?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {analyticsData.period?.start && new Date(analyticsData.period.start).toLocaleDateString()} - 
                {analyticsData.period?.end && new Date(analyticsData.period.end).toLocaleDateString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-green-400" />
                <span className="text-sm text-green-300">Total Tokens</span>
              </div>
              <p className="text-2xl font-bold text-white">{analyticsData.totalTokens?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400 mt-1">
                Avg: {analyticsData.averages?.dailyTokens?.toLocaleString() || '0'}/day
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-purple-300">Daily Average</span>
              </div>
              <p className="text-2xl font-bold text-white">${analyticsData.averages?.dailyCost?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-400 mt-1">
                ${analyticsData.averages?.costPerToken?.toFixed(6) || '0.000000'}/token
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-orange-400" />
                <span className="text-sm text-orange-300">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold text-white">${analyticsData.projectedSavings?.amount?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {analyticsData.projectedSavings?.percentage?.toFixed(1) || '0.0'}% reduction
              </p>
            </motion.div>
          </div>

          {/* Cost Trend Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Cost Trends Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateMockTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Daily Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Breakdown Charts */}
          {getModelBreakdownData().length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost by Model - Bar Chart */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Cost by Model</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getModelBreakdownData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="cost" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Token Distribution - Pie Chart */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Token Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={getModelBreakdownData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="tokens"
                        nameKey="name"
                      >
                        {getModelBreakdownData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Usage Insights */}
          {analyticsData.trends && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Usage Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {analyticsData.trends.peakHours && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Peak Hours</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.trends.peakHours.map((hour, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {hour}:00
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analyticsData.trends.peakDays && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">Peak Days</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.trends.peakDays.map((day, index) => (
                        <span key={index} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analyticsData.trends.mostUsedModel && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <PieChart className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300">Most Used Model</span>
                    </div>
                    <p className="text-white font-medium">{analyticsData.trends.mostUsedModel}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analyticsData.recommendations && analyticsData.recommendations.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Cost Optimization Recommendations</h3>
              </div>
              
              <div className="space-y-3">
                {analyticsData.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4"
                  >
                    <TrendingUp className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Model Performance Comparison */}
          {getModelBreakdownData().length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Model Performance Comparison</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-300">Model</th>
                      <th className="text-right py-3 px-4 text-gray-300">Total Cost</th>
                      <th className="text-right py-3 px-4 text-gray-300">Total Tokens</th>
                      <th className="text-right py-3 px-4 text-gray-300">Cost/Token</th>
                      <th className="text-right py-3 px-4 text-gray-300">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getModelBreakdownData().map((model, index) => (
                      <tr key={model.name} className="border-b border-gray-700/50">
                        <td className="py-3 px-4 text-white font-medium">{model.name}</td>
                        <td className="text-right py-3 px-4 text-white">${model.cost.toFixed(2)}</td>
                        <td className="text-right py-3 px-4 text-gray-300">{model.tokens.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-gray-300">${model.avgCostPerToken.toFixed(6)}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            model.avgCostPerToken < 0.0001 ? 'bg-green-500/20 text-green-400' :
                            model.avgCostPerToken < 0.0002 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {model.avgCostPerToken < 0.0001 ? 'High' :
                             model.avgCostPerToken < 0.0002 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Display */}
      {analyticsData && analyticsData.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-4">Error Loading Analytics</h3>
          <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(analyticsData.error, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Raw Data */}
      {analyticsData && !analyticsData.error && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Raw Analytics Data</h3>
          <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
            {JSON.stringify(analyticsData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default IntentTrends
