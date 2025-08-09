import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Search, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://keypilot.onrender.com'

function IntentTester() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [intent, setIntent] = useState('Find the nearest coffee shop')
  const [results, setResults] = useState(null)

  // Get userID from logged-in user
  const userID = user?.userId || 'guest-user'

  const presetIntents = [
    'Find the nearest coffee shop',
    'Generate a creative story about AI',
    'Translate this text to Spanish',
    'Analyze sentiment of user feedback',
    'Convert speech to text',
    'Summarize long documents',
    'Generate code snippets',
    'Create music compositions'
  ]

    const handleTest = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    if (!intent.trim()) {
      toast.error('Please enter an intent to test')
      return
    }

    if (!userID.trim()) {
      toast.error('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      console.log('IntentTester - API call details:')
      console.log('- BASE_URL:', BASE_URL)
      console.log('- token:', token)
      console.log('- userID:', userID)
      console.log('- intent:', intent)

      const requestBody = {
        token: token,
        userID: userID,
        intent: intent
      }

      console.log('IntentTester - requestBody:', requestBody)

      const response = await fetch(`${BASE_URL}/api/intent/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      setResults({
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      })

      if (response.ok) {
        toast.success('Intent test complete! 🧠')
      } else {
        const errorMessage = typeof data.error === 'string' 
          ? data.error 
          : typeof data.message === 'string'
            ? data.message
            : 'Intent test failed'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Intent test error:', error)
      setResults({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to intent test endpoint')
    } finally {
      setLoading(false)
    }
  }

  const generateCurl = () => {
    const requestBody = {
      token: token || 'YOUR_SESSION_TOKEN',
      userID: userID,
      intent: intent
    }

    return `curl -X POST "${BASE_URL}/api/intent/test" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || 'YOUR_SESSION_TOKEN'}" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return CheckCircle
    if (confidence >= 0.6) return AlertTriangle
    return AlertTriangle
  }

  return (
    <div className="space-y-6">
      {/* Intent Input */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Intent Testing Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Intent *
            </label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your intent to test (e.g., 'Find the nearest coffee shop')..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User ID (Logged-in User)
            </label>
            <div className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 font-mono text-sm">
              {userID}
            </div>
            <p className="text-xs text-gray-400 mt-1">Automatically populated from your login session</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing Intent...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Test Intent</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Preset Intents */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Test Intents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetIntents.map((presetIntent, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIntent(presetIntent)}
              className={`p-3 rounded-lg border text-left transition-all ${
                intent === presetIntent
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                  : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <p className="text-sm">{presetIntent}</p>
            </motion.button>
          ))}
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
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Enhanced Response Summary */}
          {results.data.success && results.data.data && (
            <div className="space-y-6">
              {/* Success Header */}
              <div className="flex items-center gap-3 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-300">Semantic Match Found!</h3>
                  <p className="text-green-200 text-sm">Processing time: {results.data.data.inference_ms || 'N/A'}ms</p>
                </div>
              </div>

              {/* Semantic Similarity Score */}
              {results.data.data.selected && (
                <div className="p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Semantic Vector Analysis
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Similarity Score Gauge */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgb(75, 85, 99)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${results.data.data.selected.similarity * 251.2} 251.2`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {(results.data.data.selected.similarity * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Similarity</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">Cosine Similarity Score</p>
                    </div>

                    {/* Selected Template */}
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">Best Match</h5>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-400 font-mono text-sm">{results.data.data.selected.template}</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Selected</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">Reason: {results.data.data.selected.reason?.replace(/_/g, ' ') || 'Best match'}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-xs text-gray-400">Vector similarity: {results.data.data.selected.similarity?.toFixed(4) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Profile Insights */}
              {results.data.data.user_profile && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Session Info */}
                  <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                    <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Session Status
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">User ID:</span>
                        <span className="text-white font-mono">{results.data.data.user_profile.userId}</span>
                      </div>
                      {results.data.data.user_profile.session_info && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="text-green-300 capitalize">{results.data.data.user_profile.session_info.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{results.data.data.user_profile.session_info.session_duration_minutes} min</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* API Keys Summary */}
                  <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                    <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A6 6 0 0119 9z" />
                      </svg>
                      API Keys
                    </h5>
                    <div className="space-y-2 text-sm">
                      {results.data.data.user_profile.api_keys && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Keys:</span>
                          <span className="text-white">{results.data.data.user_profile.api_keys.total_keys}</span>
                        </div>
                      )}
                      {results.data.data.user_profile.summary && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Daily Usage:</span>
                            <span className="text-white">{results.data.data.user_profile.summary.total_daily_usage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tokens Used:</span>
                            <span className="text-white">{results.data.data.user_profile.summary.total_tokens_used_today}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Redis Health & Development Insights */}
              {results.data.data.development_insights && (
                <div className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg">
                  <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    Redis Vector Database
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {results.data.data.development_insights.redis_health && (
                      <>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-lg font-bold text-green-400">
                            {results.data.data.development_insights.redis_health.connection_status ? '✓' : '✗'}
                          </div>
                          <div className="text-xs text-gray-400">Connection</div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-lg font-bold text-blue-400">
                            {results.data.data.development_insights.redis_health.total_database_keys}
                          </div>
                          <div className="text-xs text-gray-400">Total Keys</div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-lg font-bold text-purple-400">
                            {results.data.data.development_insights.redis_health.user_data_percentage}%
                          </div>
                          <div className="text-xs text-gray-400">User Data</div>
                        </div>
                      </>
                    )}
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="text-lg font-bold text-orange-400">
                        {results.data.data.inference_ms || 'N/A'}ms
                      </div>
                      <div className="text-xs text-gray-400">Query Time</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON (Collapsible) */}
              <details className="p-4 bg-gray-900/30 border border-gray-700 rounded-lg">
                <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
                  View Raw Response Data
                </summary>
                <pre className="mt-3 text-xs text-gray-300 whitespace-pre-wrap overflow-auto max-h-64 bg-gray-800/50 p-3 rounded">
                  {JSON.stringify(results.data.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Error Display */}
          {(!results.data.success || results.status === 'error') && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Error Response</h3>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">
                  Status: {results.status} - {
                    typeof results.data.message === 'string' 
                      ? results.data.message 
                      : typeof results.data.message === 'object'
                        ? JSON.stringify(results.data.message)
                        : 'Unknown error'
                  }
                </p>
                {results.data.error && (
                  <p className="text-red-300 text-sm">
                    {typeof results.data.error === 'string' 
                      ? results.data.error 
                      : JSON.stringify(results.data.error)
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
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default IntentTester
