import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Search, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function IntentTester() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('Find the nearest coffee shop')
  const [sessionId, setSessionId] = useState('user-session-123')
  const [context, setContext] = useState('{"location": "New York"}')
  const [results, setResults] = useState(null)

  const presetQueries = [
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

    setLoading(true)
    try {
      // Parse context JSON if provided
      let parsedContext = {}
      if (context.trim()) {
        try {
          parsedContext = JSON.parse(context)
        } catch (err) {
          toast.error('Invalid JSON format in context field')
          setLoading(false)
          return
        }
      }

      const requestBody = {
        query: query,
        sessionId: sessionId,
        context: parsedContext
      }

      const response = await fetch('https://keypilot.onrender.com/api/intent/test', {
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
        toast.error('Intent test failed - check response details')
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
    let parsedContext = {}
    if (context.trim()) {
      try {
        parsedContext = JSON.parse(context)
      } catch (err) {
        parsedContext = { error: 'Invalid JSON' }
      }
    }

    const requestBody = {
      query: query,
      sessionId: sessionId,
      context: parsedContext
    }

    return `curl -X POST "https://keypilot.onrender.com/api/intent/test" \\
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
              Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your query or intent to test..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="user-session-123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Context (Optional JSON)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
              rows={3}
              placeholder='{"location": "New York", "user_preferences": {}}'
            />
            <p className="text-xs text-gray-400 mt-1">Enter valid JSON object for additional context</p>
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

      {/* Preset Queries */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Test Queries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetQueries.map((presetQuery, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setQuery(presetQuery)}
              className={`p-3 rounded-lg border text-left transition-all ${
                query === presetQuery
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                  : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <p className="text-sm">{presetQuery}</p>
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
          {/* Response Summary */}
          {results.data.success && results.data.data && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Intent Test Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Test Status</span>
                  </div>
                  <p className="text-green-400 font-medium">
                    {results.data.success ? 'Success' : 'Failed'}
                  </p>
                  <p className="text-gray-400 text-sm">{results.data.message}</p>
                </div>

                {results.data.data.match && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Best Match</span>
                    </div>
                    <p className="text-white font-medium">{results.data.data.match}</p>
                    {results.data.data.score && (
                      <p className={`text-sm ${getConfidenceColor(results.data.data.score)}`}>
                        Score: {(results.data.data.score * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Response Data */}
              {results.data.data && Object.keys(results.data.data).length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3">Response Details</h4>
                  <div className="bg-gray-700/20 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(results.data.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {(!results.data.success || results.status === 'error') && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Error Response</h3>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">
                  Status: {results.status} - {results.data.message || 'Unknown error'}
                </p>
                {results.data.error && (
                  <p className="text-red-300 text-sm">{results.data.error}</p>
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
