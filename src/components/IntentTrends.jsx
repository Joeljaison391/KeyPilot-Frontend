import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  RefreshCw, 
  BarChart3,
  PieChart,
  Zap,
  Target,
  Lightbulb,
  Brain,
  Users,
  Timer
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
  Legend,
  ScatterChart,
  Scatter
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://keypilot.onrender.com'

function IntentTrends() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [trendsData, setTrendsData] = useState(null)
  const [params, setParams] = useState({
    hours_back: 24,
    min_cluster_size: 3,
    similarity_threshold: 0.8
  })

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  const fetchIntentTrends = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        token: token,
        hours_back: params.hours_back.toString(),
        min_cluster_size: params.min_cluster_size.toString(),
        similarity_threshold: params.similarity_threshold.toString()
      })

      const response = await fetch(`${BASE_URL}/api/intent-trends?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      
      if (response.ok) {
        setTrendsData(result)
        toast.success('Intent trends loaded successfully! 🧠')
      } else {
        toast.error(`Analysis failed: ${result.error || result.message || 'Unknown error'}`)
        setTrendsData({ error: result })
      }
    } catch (error) {
      console.error('Intent trends error:', error)
      toast.error('Failed to connect to intent trends endpoint')
      setTrendsData({ error: { message: error.message } })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntentTrends()
  }, [])

  const generateTrendChartData = () => {
    if (!trendsData || trendsData.error || !trendsData.trend_analysis?.clusters) return []
    
    return trendsData.trend_analysis.clusters.map((cluster, index) => ({
      name: cluster.representative_intent,
      popularity: cluster.popularity_score,
      growth: cluster.growth_rate * 100,
      timeSpan: cluster.time_span_hours,
      intents: cluster.intents.length
    }))
  }

  const getClusterData = () => {
    if (!trendsData?.trend_analysis?.clusters) return []
    
    return trendsData.trend_analysis.clusters.map((cluster, index) => ({
      id: cluster.id,
      representative: cluster.representative_intent,
      size: cluster.intents.length,
      growth: cluster.growth_rate,
      popularity: cluster.popularity_score,
      timeSpan: cluster.time_span_hours
    }))
  }

  const generateCurl = () => {
    const queryParams = new URLSearchParams({
      token: token || 'YOUR_TOKEN',
      hours_back: params.hours_back.toString(),
      min_cluster_size: params.min_cluster_size.toString(),
      similarity_threshold: params.similarity_threshold.toString()
    })

    return `curl -X GET "${BASE_URL}/api/intent-trends?${queryParams}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}"`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Intent Trends & Analysis</h2>
        </div>
        <p className="text-gray-400">
          Comprehensive intent clustering and trend analysis with behavioral insights and recommendations
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Analysis Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Period (Hours)
            </label>
            <select
              value={params.hours_back}
              onChange={(e) => setParams({ ...params, hours_back: parseInt(e.target.value) })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>7 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Cluster Size
            </label>
            <input
              type="number"
              min="2"
              max="50"
              value={params.min_cluster_size}
              onChange={(e) => setParams({ ...params, min_cluster_size: parseInt(e.target.value) })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Similarity Threshold
            </label>
            <input
              type="number"
              min="0.5"
              max="0.99"
              step="0.01"
              value={params.similarity_threshold}
              onChange={(e) => setParams({ ...params, similarity_threshold: parseFloat(e.target.value) })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchIntentTrends}
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
                  <span>Analyze Trends</span>
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
      {trendsData && !trendsData.error && (
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
                <Brain className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-blue-300">Total Intents</span>
              </div>
              <p className="text-2xl font-bold text-white">{trendsData.trend_analysis?.total_intents || '0'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {trendsData.analysis_params?.hours_back}h analysis period
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-green-400" />
                <span className="text-sm text-green-300">Clusters Found</span>
              </div>
              <p className="text-2xl font-bold text-white">{trendsData.trend_analysis?.clusters?.length || '0'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {trendsData.data_quality?.clustering_efficiency || '0'}% efficiency
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Timer className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-purple-300">Processing Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{trendsData.processing_time_ms || '0'}ms</p>
              <p className="text-xs text-gray-400 mt-1">
                Analysis completed
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-orange-400" />
                <span className="text-sm text-orange-300">Intent Velocity</span>
              </div>
              <p className="text-2xl font-bold text-white">{trendsData.trend_analysis?.temporal_insights?.intent_velocity?.toFixed(1) || '0.0'}</p>
              <p className="text-xs text-gray-400 mt-1">
                intents/hour
              </p>
            </motion.div>
          </div>

          {/* Trending Patterns */}
          {trendsData.trend_analysis?.trending_patterns && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Patterns</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Rising Trends */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Rising ({trendsData.trend_analysis.trending_patterns.rising?.length || 0})</span>
                  </div>
                  <div className="space-y-2">
                    {trendsData.trend_analysis.trending_patterns.rising?.map((intent, index) => (
                      <div key={index} className="text-sm text-gray-300 bg-gray-700/30 rounded px-2 py-1">
                        {intent}
                      </div>
                    )) || <span className="text-sm text-gray-500">No rising trends</span>}
                  </div>
                </div>

                {/* Stable Trends */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Stable ({trendsData.trend_analysis.trending_patterns.stable?.length || 0})</span>
                  </div>
                  <div className="space-y-2">
                    {trendsData.trend_analysis.trending_patterns.stable?.map((intent, index) => (
                      <div key={index} className="text-sm text-gray-300 bg-gray-700/30 rounded px-2 py-1">
                        {intent}
                      </div>
                    )) || <span className="text-sm text-gray-500">No stable trends</span>}
                  </div>
                </div>

                {/* Declining Trends */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">Declining ({trendsData.trend_analysis.trending_patterns.declining?.length || 0})</span>
                  </div>
                  <div className="space-y-2">
                    {trendsData.trend_analysis.trending_patterns.declining?.map((intent, index) => (
                      <div key={index} className="text-sm text-gray-300 bg-gray-700/30 rounded px-2 py-1">
                        {intent}
                      </div>
                    )) || <span className="text-sm text-gray-500">No declining trends</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cluster Analysis Charts */}
          {getClusterData().length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cluster Popularity - Bar Chart */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Cluster Popularity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateTrendChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} angle={-45} textAnchor="end" height={60} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="popularity" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Growth Rate vs Popularity - Scatter Plot */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Growth vs Popularity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={generateTrendChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="popularity" stroke="#9CA3AF" fontSize={12} name="Popularity" />
                      <YAxis dataKey="growth" stroke="#9CA3AF" fontSize={12} name="Growth %" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Scatter dataKey="growth" fill="#10B981" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Temporal Insights */}
          {trendsData.trend_analysis?.temporal_insights && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Temporal Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {trendsData.trend_analysis.temporal_insights.peak_hours && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Peak Hours</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trendsData.trend_analysis.temporal_insights.peak_hours.map((hour, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {hour}:00
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {trendsData.trend_analysis.temporal_insights.activity_distribution && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">Activity Distribution</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Object.entries(trendsData.trend_analysis.temporal_insights.activity_distribution).slice(0, 3).map(([hour, count], index) => (
                        <div key={index} className="flex justify-between">
                          <span>{hour}:00</span>
                          <span>{count} intents</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trendsData.trend_analysis.temporal_insights.intent_velocity && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300">Intent Velocity</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{trendsData.trend_analysis.temporal_insights.intent_velocity.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">intents per hour</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cluster Details Table */}
          {getClusterData().length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cluster Analysis Details</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-300">Cluster ID</th>
                      <th className="text-left py-3 px-4 text-gray-300">Representative Intent</th>
                      <th className="text-right py-3 px-4 text-gray-300">Size</th>
                      <th className="text-right py-3 px-4 text-gray-300">Growth Rate</th>
                      <th className="text-right py-3 px-4 text-gray-300">Popularity</th>
                      <th className="text-right py-3 px-4 text-gray-300">Time Span (h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getClusterData().map((cluster, index) => (
                      <tr key={cluster.id} className="border-b border-gray-700/50">
                        <td className="py-3 px-4 text-white font-mono text-xs">{cluster.id}</td>
                        <td className="py-3 px-4 text-white font-medium max-w-xs truncate">{cluster.representative}</td>
                        <td className="text-right py-3 px-4 text-gray-300">{cluster.size}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`${
                            cluster.growth > 0 ? 'text-green-400' : 
                            cluster.growth < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {cluster.growth > 0 ? '+' : ''}{(cluster.growth * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-300">{cluster.popularity}</td>
                        <td className="text-right py-3 px-4 text-gray-300">{cluster.timeSpan}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {trendsData.trend_analysis?.recommendations && trendsData.trend_analysis.recommendations.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Intent Optimization Recommendations</h3>
              </div>
              
              <div className="space-y-3">
                {trendsData.trend_analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4"
                  >
                    <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Data Quality Metrics */}
          {trendsData.data_quality && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Data Quality Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Total Records</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trendsData.data_quality.total_records}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Clustered Records</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trendsData.data_quality.clustered_records}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Unclustered Records</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trendsData.data_quality.unclustered_records}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Clustering Efficiency</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trendsData.data_quality.clustering_efficiency}%</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Display */}
      {trendsData && trendsData.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-4">Error Loading Intent Trends</h3>
          <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(trendsData.error, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Raw Data */}
      {trendsData && !trendsData.error && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Raw Intent Trends Data</h3>
          <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
            {JSON.stringify(trendsData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default IntentTrends
