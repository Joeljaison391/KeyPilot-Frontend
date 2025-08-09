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
  const [cacheKey, setCacheKey] = useState('user-session-123')
  const [inspectionMode, setInspectionMode] = useState('specific') // 'specific' or 'overview'

  const presetCacheKeys = [
    'user-session-123',
    'api-keys:*',
    'embeddings:*',
    'session-data:*',
    'user:profile:*',
    'cache:semantic:*'
  ]

  const fetchCacheInspection = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    if (!cacheKey.trim()) {
      toast.error('Please enter a cache key to inspect')
      return
    }

    setLoading(true)
    try {
      console.log('CacheInspector - BASE_URL:', BASE_URL)
      console.log('CacheInspector - token:', token)
      console.log('CacheInspector - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
      
      let response
      
      if (inspectionMode === 'specific') {
        // Inspect specific cache entry
        response = await fetch(`${BASE_URL}/api/cache-inspector`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: token, // Add token to request body
            cacheKey: cacheKey
          })
        })
      } else {
        // Get cache overview/list
        response = await fetch(`${BASE_URL}/api/cache-inspector`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }

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

  const generateCurl = () => {
    if (inspectionMode === 'specific') {
      const requestBody = {
        token: token || 'YOUR_TOKEN', // Include token in request body
        cacheKey: cacheKey
      }

      return `curl -X POST "${BASE_URL}/api/cache-inspector" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`
    } else {
      return `curl -X GET "${BASE_URL}/api/cache-inspector" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}"`
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Cache Inspector Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Inspection Mode
            </label>
            <select
              value={inspectionMode}
              onChange={(e) => setInspectionMode(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="specific">Inspect Specific Cache Key</option>
              <option value="overview">Cache Overview</option>
            </select>
          </div>

          {inspectionMode === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cache Key to Inspect
              </label>
              <input
                type="text"
                value={cacheKey}
                onChange={(e) => setCacheKey(e.target.value)}
                placeholder="user-session-123"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Enter the exact cache key or use wildcards (*)</p>
            </div>
          )}

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

      {/* Preset Cache Keys */}
      {inspectionMode === 'specific' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Common Cache Keys</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetCacheKeys.map((presetKey, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCacheKey(presetKey)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cacheKey === presetKey
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                <p className="text-sm font-mono">{presetKey}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
          {/* Cache Entry Details */}
          {data.data.success && data.data.data && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cache Entry Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Cache Key</span>
                  </div>
                  <p className="text-white font-mono text-sm break-all">
                    {data.data.data.cacheKey || cacheKey}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Status</span>
                  </div>
                  <p className="text-green-400 font-medium">
                    {data.data.success ? 'Found' : 'Not Found'}
                  </p>
                </div>
              </div>

              {/* Cache Value Display */}
              {data.data.data.value && (
                <div>
                  <h4 className="text-white font-medium mb-3">Cache Value</h4>
                  <div className="bg-gray-700/20 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {typeof data.data.data.value === 'object' 
                        ? JSON.stringify(data.data.data.value, null, 2)
                        : data.data.data.value
                      }
                    </pre>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {data.data.data.metadata && (
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-3">Metadata</h4>
                  <div className="bg-gray-700/20 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(data.data.data.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
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
                        : 'Cache entry not found'
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
                {!data.data.success && inspectionMode === 'specific' && (
                  <p className="text-red-300 text-sm mt-2">
                    The cache key "{cacheKey}" was not found in Redis cache.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cache Overview for overview mode */}
          {inspectionMode === 'overview' && data.data.success && data.data.data && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Cache Overview</h3>
              
              {data.data.data.keys && (
                <div>
                  <h4 className="text-white font-medium mb-3">Available Cache Keys</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {data.data.data.keys.map((key, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-700/30 rounded-lg p-3 cursor-pointer hover:bg-gray-700/50"
                        onClick={() => {
                          setCacheKey(key)
                          setInspectionMode('specific')
                        }}
                      >
                        <p className="text-gray-300 font-mono text-sm">{key}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
