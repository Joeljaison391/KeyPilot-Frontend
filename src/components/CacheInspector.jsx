import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Activity, TrendingUp, AlertCircle, RefreshCw, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://keypilot.onrender.com'

function CacheInspector() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [includeEmbeddings, setIncludeEmbeddings] = useState(false)
  const [clusterAnalysis, setClusterAnalysis] = useState(false)
  const [limit, setLimit] = useState(50)

  const fetchCacheInspection = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      console.log('CacheInspector - BASE_URL:', BASE_URL)
      console.log('CacheInspector - token:', token)
      console.log('CacheInspector - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        token: token,
        include_embeddings: includeEmbeddings.toString(),
        cluster_analysis: clusterAnalysis.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`${BASE_URL}/api/cache-inspector?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      setData({
        status: response.status,
        data: result,
        timestamp: new Date().toISOString()
      })

      if (response.ok) {
        toast.success('Cache inspection complete! 🔍')
      } else {
        toast.error('Cache inspection failed - check response details')
      }
    } catch (error) {
      console.error('Cache inspector error:', error)
      setData({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to cache inspector endpoint')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCacheInspection()
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'from-green-600 to-green-400'
    if (confidence >= 60) return 'from-yellow-600 to-yellow-400'
    return 'from-red-600 to-red-400'
  }

  const generateCurl = () => {
    const queryParams = new URLSearchParams({
      token: token || 'YOUR_TOKEN',
      include_embeddings: includeEmbeddings.toString(),
      cluster_analysis: clusterAnalysis.toString(),
      limit: limit.toString()
    })

    return `curl -X GET "${BASE_URL}/api/cache-inspector?${queryParams}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}"`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Cache Inspector Configuration</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Entries
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 50)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Limit: 1-100 entries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeEmbeddings"
                checked={includeEmbeddings}
                onChange={(e) => setIncludeEmbeddings(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="includeEmbeddings" className="text-sm font-medium text-gray-300">
                Include Embeddings
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="clusterAnalysis"
                checked={clusterAnalysis}
                onChange={(e) => setClusterAnalysis(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="clusterAnalysis" className="text-sm font-medium text-gray-300">
                Cluster Analysis
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchCacheInspection}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Inspecting...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Inspect Cache</span>
              </>
            )}
          </motion.button>
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
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cache Information Summary */}
          {data.data.success && data.data.cache_info && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cache Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Total Entries</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {data.data.cache_info.total_entries}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">User ID</span>
                  </div>
                  <p className="text-green-400 font-medium font-mono">
                    {data.data.cache_info.user_id}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Cache Key</span>
                  </div>
                  <p className="text-purple-400 font-medium font-mono text-sm">
                    {data.data.cache_info.cache_key}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cache Entries */}
          {data.data.success && data.data.entries && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">
                Cache Entries ({data.data.entries.length})
              </h3>
              
              <div className="space-y-4">
                {data.data.entries.map((entry, index) => (
                  <div key={entry.id || index} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Intent</span>
                        <p className="text-white font-medium">{entry.intent}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Template</span>
                        <p className="text-blue-400 font-mono text-sm">{entry.matched_template}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Confidence</span>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${getConfidenceColor(entry.confidence * 100)}`}></div>
                          <span className="text-white text-sm">{(entry.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Age</span>
                        <p className="text-gray-300">{entry.cache_age_hours.toFixed(1)} hours</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Timestamp</span>
                        <p className="text-gray-300 font-mono text-sm">{entry.timestamp}</p>
                      </div>
                    </div>

                    {entry.payload_summary && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Payload Summary</span>
                        <p className="text-gray-300 text-sm mt-1">{entry.payload_summary}</p>
                      </div>
                    )}

                    {includeEmbeddings && entry.embedding_preview && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Embedding Preview</span>
                        <div className="bg-gray-800/50 rounded p-2 mt-1">
                          <p className="text-gray-300 font-mono text-xs">
                            [{entry.embedding_preview.slice(0, 5).map(n => n.toFixed(4)).join(', ')}...]
                          </p>
                        </div>
                      </div>
                    )}

                    {clusterAnalysis && entry.similarity_cluster && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Cluster</span>
                        <p className="text-yellow-400 text-sm mt-1">{entry.similarity_cluster}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cluster Analysis */}
          {clusterAnalysis && data.data.success && data.data.analysis && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cluster Analysis</h3>
              <div className="bg-gray-700/20 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {typeof data.data.analysis === 'object' 
                    ? JSON.stringify(data.data.analysis, null, 2)
                    : data.data.analysis
                  }
                </pre>
              </div>
            </div>
          )}

          {/* Error Display */}
          {(!data.data.success || data.status === 'error') && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Cache Inspection Error</h3>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">
                  Status: {data.status} - {
                    typeof data.data.message === 'string' 
                      ? data.data.message 
                      : typeof data.data.message === 'object'
                        ? JSON.stringify(data.data.message)
                        : 'Cache inspection failed'
                  }
                </p>
                {data.data.error && (
                  <p className="text-red-300 text-sm">
                    {typeof data.data.error === 'string' 
                      ? data.data.error 
                      : JSON.stringify(data.data.error)
                    }
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Raw Response Data */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Raw Response</h3>
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!data && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
          <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Cache Data</h3>
          <p className="text-gray-400">
            Enter a cache key and click "Inspect Cache" to view Redis cache entries
          </p>
        </div>
      )}
    </div>
  )
}

export default CacheInspector
