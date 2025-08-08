import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Search, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function IntentTester() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [intent, setIntent] = useState('create artistic image with AI')
  const [debugLevel, setDebugLevel] = useState('detailed')
  const [results, setResults] = useState(null)

  const presetIntents = [
    'create artistic image with AI',
    'generate text using machine learning',
    'translate text to Spanish',
    'analyze sentiment of user feedback',
    'convert speech to text',
    'summarize long documents',
    'generate code snippets',
    'create music compositions'
  ]

  const handleTest = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        intent: intent,
        debug_level: debugLevel
      }

      const response = await fetch('https://keypilot.onrender.com/api/proxy/test', {
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
        toast.success('Intent analysis complete! 🧠')
      } else {
        toast.error('Analysis failed - check response details')
      }
    } catch (error) {
      console.error('Intent test error:', error)
      setResults({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to test endpoint')
    } finally {
      setLoading(false)
    }
  }

  const generateCurl = () => {
    const requestBody = {
      intent: intent,
      debug_level: debugLevel
    }

    return `curl -X POST "https://keypilot.onrender.com/api/proxy/test" \\
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
              Intent to Analyze
            </label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what you want to test..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Debug Level
            </label>
            <select
              value={debugLevel}
              onChange={(e) => setDebugLevel(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="detailed">Detailed</option>
              <option value="verbose">Verbose</option>
            </select>
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
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Analyze Intent</span>
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
          {/* Analysis Summary */}
          {results.data.semantic_analysis && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Semantic Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Intent Processing</span>
                  </div>
                  <p className="text-white font-medium">{results.data.semantic_analysis.processed_intent}</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Best Match</span>
                  </div>
                  <p className="text-white font-medium">{results.data.semantic_analysis.best_match?.template}</p>
                  {results.data.semantic_analysis.best_match?.confidence && (
                    <p className={`text-sm ${getConfidenceColor(results.data.semantic_analysis.best_match.confidence)}`}>
                      {(results.data.semantic_analysis.best_match.confidence * 100).toFixed(1)}% confidence
                    </p>
                  )}
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Processing Time</span>
                  </div>
                  <p className="text-white font-medium">{results.data.processing_time_ms}ms</p>
                </div>
              </div>

              {/* Vector Similarities */}
              {results.data.semantic_analysis.vector_similarities && (
                <div>
                  <h4 className="text-white font-medium mb-3">Template Similarities</h4>
                  <div className="space-y-2">
                    {results.data.semantic_analysis.vector_similarities.map((similarity, index) => {
                      const ConfidenceIcon = getConfidenceIcon(similarity.confidence)
                      return (
                        <div key={index} className="flex items-center justify-between bg-gray-700/20 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <ConfidenceIcon className={`w-4 h-4 ${getConfidenceColor(similarity.confidence)}`} />
                            <div>
                              <p className="text-white font-medium">{similarity.template}</p>
                              <p className="text-gray-400 text-sm">{similarity.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${getConfidenceColor(similarity.confidence)}`}>
                              {(similarity.confidence * 100).toFixed(1)}%
                            </p>
                            <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  similarity.confidence >= 0.8 ? 'bg-green-400' :
                                  similarity.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${similarity.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw Debug Data */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Debug Information</h3>
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
