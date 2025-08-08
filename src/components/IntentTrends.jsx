import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock, Activity, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function IntentTrends() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [params, setParams] = useState({
    hours_back: 24,
    min_cluster_size: 3,
    similarity_threshold: 0.8
  })

  const fetchTrends = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        token: token,
        hours_back: params.hours_back,
        min_cluster_size: params.min_cluster_size,
        similarity_threshold: params.similarity_threshold
      })

      const response = await fetch(`http://localhost:3000/api/intent-trends?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      setData({
        status: response.status,
        data: result,
        timestamp: new Date().toISOString()
      })

      if (response.ok) {
        toast.success('Trend analysis complete! 📈')
      } else {
        toast.error('Analysis failed - check response details')
      }
    } catch (error) {
      console.error('Intent trends error:', error)
      setData({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to trends endpoint')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrends()
  }, [])

  const getTrendIcon = (type) => {
    switch (type) {
      case 'rising':
        return TrendingUp
      case 'declining':
        return TrendingDown
      default:
        return Minus
    }
  }

  const getTrendColor = (type) => {
    switch (type) {
      case 'rising':
        return 'text-green-400'
      case 'declining':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
    }
  }

  const getTrendBg = (type) => {
    switch (type) {
      case 'rising':
        return 'bg-green-500/20 border-green-500/30'
      case 'declining':
        return 'bg-red-500/20 border-red-500/30'
      default:
        return 'bg-yellow-500/20 border-yellow-500/30'
    }
  }

  const generateCurl = () => {
    const queryParams = new URLSearchParams({
      token: token || 'YOUR_TOKEN',
      hours_back: params.hours_back,
      min_cluster_size: params.min_cluster_size
    })

    return `curl -X GET "http://localhost:3000/api/intent-trends?${queryParams}" \\
  -H "Content-Type: application/json"`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Trend Analysis Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hours Back
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
              <option value={168}>1 week</option>
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
              onClick={fetchTrends}
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
        <h3 className="text-lg font-semibold text-white mb-4">cURL Command</h3>
        <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
          {generateCurl()}
        </pre>
      </div>

      {/* Results */}
      {data && data.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Stats */}
          {data.data.trend_analysis && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trend Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Total Intents</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{data.data.trend_analysis.total_intents}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-purple-400 rounded"></div>
                    <span className="text-sm text-gray-300">Clusters Found</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{data.data.trend_analysis.clusters?.length || 0}</p>
                </div>

                {data.data.trend_analysis.temporal_insights && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">Intent Velocity</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {data.data.trend_analysis.temporal_insights.intent_velocity?.toFixed(2) || 0}
                    </p>
                  </div>
                )}
              </div>

              {/* Peak Hours */}
              {data.data.trend_analysis.temporal_insights?.peak_hours && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">Peak Hours</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.data.trend_analysis.temporal_insights.peak_hours.map((hour, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                        {hour}:00
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trending Patterns */}
          {data.data.trend_analysis?.trending_patterns && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Patterns</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(data.data.trend_analysis.trending_patterns).map(([type, patterns]) => {
                  const TrendIcon = getTrendIcon(type)
                  return (
                    <div key={type} className={`rounded-lg p-4 border ${getTrendBg(type)}`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendIcon className={`w-5 h-5 ${getTrendColor(type)}`} />
                        <h4 className="text-white font-medium capitalize">{type}</h4>
                      </div>
                      
                      <div className="space-y-2">
                        {patterns.map((pattern, index) => (
                          <div key={index} className="bg-gray-800/30 rounded p-2">
                            <p className="text-gray-300 text-sm">{pattern}</p>
                          </div>
                        ))}
                        {patterns.length === 0 && (
                          <p className="text-gray-400 text-sm italic">No {type} patterns detected</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Intent Clusters */}
          {data.data.trend_analysis?.clusters && data.data.trend_analysis.clusters.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Intent Clusters</h3>
              <p className="text-gray-400 text-sm mb-4">
                Popular intent patterns from the analyzed time period
              </p>
              
              <div className="space-y-4">
                {data.data.trend_analysis.clusters.map((cluster, index) => (
                  <motion.div
                    key={cluster.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                          index % 4 === 0 ? 'from-blue-400 to-purple-400' :
                          index % 4 === 1 ? 'from-green-400 to-blue-400' :
                          index % 4 === 2 ? 'from-yellow-400 to-orange-400' :
                          'from-pink-400 to-red-400'
                        }`}></div>
                        <h4 className="text-white font-medium">Cluster {cluster.id}</h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{cluster.growth_rate?.toFixed(1) || 0}x growth</span>
                        </span>
                        <span>Score: {cluster.popularity_score || 0}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-gray-300 text-sm font-medium mb-1">Representative Intent:</p>
                      <p className="text-white">{cluster.representative_intent}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.data.recommendations && data.data.recommendations.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trend Recommendations</h3>
              
              <div className="space-y-3">
                {data.data.recommendations.map((recommendation, index) => (
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

          {/* Raw Data */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Raw Trend Data</h3>
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default IntentTrends
