import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, Target, Clock, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function FeedbackStats() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const fetchFeedbackStats = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        token: token
      })

      const response = await fetch(`https://keypilot.onrender.com/api/feedback-stats?${queryParams}`, {
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
    const queryParams = new URLSearchParams({
      token: token || 'YOUR_TOKEN'
    })

    return `curl -X GET "https://keypilot.onrender.com/api/feedback-stats?${queryParams}" \\
  -H "Content-Type: application/json"`
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
          {/* Overall Stats */}
          {data.data.overall_stats && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Overall Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Average Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className={`text-2xl font-bold ${getScoreColor(data.data.overall_stats.average_rating || 0)}`}>
                      {(data.data.overall_stats.average_rating || 0).toFixed(1)}
                    </p>
                    <div className="flex space-x-1">
                      {renderStars(data.data.overall_stats.average_rating || 0)}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Positive Feedback</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {data.data.overall_stats.positive_feedback || 0}
                  </p>
                  <p className="text-sm text-gray-400">
                    {data.data.overall_stats.positive_percentage || 0}% positive
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Match Quality</span>
                  </div>
                  <p className={`text-2xl font-bold ${getScoreColor(data.data.overall_stats.match_quality || 0)}`}>
                    {((data.data.overall_stats.match_quality || 0) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Avg Response Time</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {data.data.overall_stats.average_response_time || 0}ms
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rating Distribution */}
          {data.data.rating_distribution && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = data.data.rating_distribution[rating] || 0
                  const total = Object.values(data.data.rating_distribution).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  
                  return (
                    <div key={rating} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 w-20">
                        <span className="text-white font-medium">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-600 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(rating)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-white font-medium">{count}</span>
                        <span className="text-gray-400 text-sm ml-1">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Feedback */}
          {data.data.recent_feedback && data.data.recent_feedback.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Feedback</h3>
              
              <div className="space-y-4">
                {data.data.recent_feedback.map((feedback, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {renderStars(feedback.rating || 0)}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(feedback.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {feedback.match_quality && (
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {(feedback.match_quality * 100).toFixed(1)}% match
                          </span>
                        )}
                        {feedback.response_time && (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                            {feedback.response_time}ms
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {feedback.intent && (
                      <div className="mb-2">
                        <p className="text-gray-400 text-sm">Intent:</p>
                        <p className="text-white">{feedback.intent}</p>
                      </div>
                    )}
                    
                    {feedback.comment && (
                      <div className="bg-gray-800/50 rounded p-3">
                        <p className="text-gray-300 text-sm">{feedback.comment}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {data.data.performance_metrics && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(data.data.performance_metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm capitalize mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Raw Feedback Data</h3>
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {data && data.data && Object.keys(data.data).length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Feedback Data</h3>
          <p className="text-gray-400">
            Start using the API proxy to generate feedback and performance metrics
          </p>
        </div>
      )}
    </div>
  )
}

export default FeedbackStats
