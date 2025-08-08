import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Activity, TrendingUp, AlertCircle, RefreshCw, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function CacheInspector() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [params, setParams] = useState({
    similarity_threshold: 0.8,
    min_cluster_size: 3
  })

  const fetchCacheAnalysis = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        token: token,
        similarity_threshold: params.similarity_threshold,
        min_cluster_size: params.min_cluster_size
      })

      const response = await fetch(`http://localhost:3000/api/cache-inspector?${queryParams}`, {
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
        toast.success('Cache analysis complete! 🔍')
      } else {
        toast.error('Analysis failed - check response details')
      }
    } catch (error) {
      console.error('Cache inspector error:', error)
      setData({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to cache inspector')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCacheAnalysis()
  }, [])

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHealthGradient = (score) => {
    if (score >= 80) return 'from-green-600 to-green-400'
    if (score >= 60) return 'from-yellow-600 to-yellow-400'
    return 'from-red-600 to-red-400'
  }

  const generateCurl = () => {
    const queryParams = new URLSearchParams({
      token: token || 'YOUR_TOKEN',
      similarity_threshold: params.similarity_threshold,
      min_cluster_size: params.min_cluster_size
    })

    return `curl -X GET "http://localhost:3000/api/cache-inspector?${queryParams}" \\
  -H "Content-Type: application/json"`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Analysis Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Similarity Threshold
            </label>
            <input
              type="number"
              min="0.1"
              max="0.99"
              step="0.01"
              value={params.similarity_threshold}
              onChange={(e) => setParams({ ...params, similarity_threshold: parseFloat(e.target.value) })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
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

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchCacheAnalysis}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Analyze Cache</span>
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
          {/* Cache Health Overview */}
          {data.data.cache_health && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cache Health Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Overall Score</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className={`text-2xl font-bold ${getHealthColor(data.data.cache_health.overall_score)}`}>
                      {data.data.cache_health.overall_score}
                    </p>
                    <div className="flex-1">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getHealthGradient(data.data.cache_health.overall_score)}`}
                          style={{ width: `${data.data.cache_health.overall_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Total Entries</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{data.data.cache_health.total_entries}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Storage Efficiency</span>
                  </div>
                  <p className={`text-2xl font-bold ${getHealthColor(data.data.cache_health.storage_efficiency)}`}>
                    {data.data.cache_health.storage_efficiency}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Clusters */}
          {data.data.clusters && data.data.clusters.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Intent Clusters</h3>
              <p className="text-gray-400 text-sm mb-4">
                Groups of similar cached intents based on vector similarity
              </p>
              
              <div className="space-y-4">
                {data.data.clusters.map((cluster, index) => (
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
                        <span>{cluster.size} intents</span>
                        <span>{(cluster.coherence_score * 100).toFixed(1)}% coherence</span>
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
              <h3 className="text-lg font-semibold text-white mb-4">Optimization Recommendations</h3>
              
              <div className="space-y-3">
                {data.data.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                  >
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Raw Analysis Data</h3>
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CacheInspector
