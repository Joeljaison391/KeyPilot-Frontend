import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, Target, Clock, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://keypilot.onrender.com'

function FeedbackStats() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    userId: ''
  })

  const feedbackTypes = [
    { value: '', label: 'All Types' },
    { value: 'bug-report', label: 'Bug Reports' },
    { value: 'feature-request', label: 'Feature Requests' },
    { value: 'general', label: 'General Feedback' },
    { value: 'rating', label: 'Ratings' }
  ]

  const fetchFeedbackStats = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      // Build request body with filters
      const requestBody = {
        token: token // Add token to request body
      }
      
      if (filters.startDate) requestBody.startDate = filters.startDate
      if (filters.endDate) requestBody.endDate = filters.endDate
      if (filters.type) requestBody.type = filters.type
      if (filters.userId) requestBody.userId = filters.userId

      const response = await fetch(`${BASE_URL}/api/feedback-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      setData({
        status: response.status,
        data: result,
        timestamp: new Date().toISOString()
      })

      if (response.ok) {
        toast.success('Feedback stats loaded! 📊')
      } else {
        toast.error('Failed to load stats - check response details')
      }
    } catch (error) {
      console.error('Feedback stats error:', error)
      setData({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to feedback stats endpoint')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbackStats()
  }, [])

  const generateCurl = () => {
    const requestBody = {
      token: token || 'YOUR_TOKEN' // Include token in request body
    }
    
    if (filters.startDate) requestBody.startDate = filters.startDate
    if (filters.endDate) requestBody.endDate = filters.endDate
    if (filters.type) requestBody.type = filters.type
    if (filters.userId) requestBody.userId = filters.userId

    return `curl -X POST "${BASE_URL}/api/feedback-stats" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`
  }

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-400'
    if (score >= 3.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score) => {
    if (score >= 4.5) return 'from-green-600 to-green-400'
    if (score >= 3.5) return 'from-yellow-600 to-yellow-400'
    return 'from-red-600 to-red-400'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-600'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Feedback Analytics</h3>
          <p className="text-gray-400">User feedback and system performance metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchFeedbackStats}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Filter Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feedback Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {feedbackTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User ID (Optional)
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              placeholder="user-123"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setFilters({ startDate: '', endDate: '', type: '', userId: '' })}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Clear Filters
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchFeedbackStats}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Filtering...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Apply Filters</span>
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
          {/* Feedback Overview */}
          {data.data.success && data.data.data && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Feedback Statistics Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Total Feedback */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Total Feedback</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {data.data.data.totalFeedback || 0}
                  </p>
                </div>

                {/* Message Status */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Status</span>
                  </div>
                  <p className="text-green-400 font-medium">
                    {data.data.success ? 'Success' : 'Failed'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {data.data.message}
                  </p>
                </div>

                {/* Applied Filters */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Filters Applied</span>
                  </div>
                  <p className="text-white text-sm">
                    {filters.startDate || filters.endDate || filters.type || filters.userId 
                      ? 'Yes' 
                      : 'None'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback by Type */}
          {data.data.success && data.data.data?.feedbackByType && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Feedback by Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(data.data.data.feedbackByType).map(([type, count]) => (
                  <div key={type} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        type === 'bug-report' ? 'bg-red-400' :
                        type === 'feature-request' ? 'bg-blue-400' :
                        type === 'general' ? 'bg-green-400' :
                        'bg-yellow-400'
                      }`}></div>
                      <span className="text-sm text-gray-300 capitalize">
                        {type.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-sm text-gray-400">
                      {data.data.data.totalFeedback > 0 
                        ? `${((count / data.data.data.totalFeedback) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {data.data.success && data.data.data?.sentimentAnalysis && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Sentiment Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(data.data.data.sentimentAnalysis).map(([sentiment, count]) => {
                  const total = Object.values(data.data.data.sentimentAnalysis).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  
                  return (
                    <div key={sentiment} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          sentiment === 'positive' ? 'bg-green-400' :
                          sentiment === 'neutral' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                        <span className="text-sm text-gray-300 capitalize">{sentiment}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="text-2xl font-bold text-white">{count}</p>
                        <div className="flex-1">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                sentiment === 'positive' ? 'bg-green-400' :
                                sentiment === 'neutral' ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Error Display */}
          {(!data.data.success || data.status === 'error') && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Error Response</h3>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">
                  Status: {data.status} - {data.data.message || 'Failed to retrieve feedback stats'}
                </p>
                {data.data.error && (
                  <p className="text-red-300 text-sm">{data.data.error}</p>
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
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Feedback Data</h3>
          <p className="text-gray-400">
            Configure filters and click "Apply Filters" to retrieve feedback statistics
          </p>
        </div>
      )}
    </div>
  )
}

export default FeedbackStats
