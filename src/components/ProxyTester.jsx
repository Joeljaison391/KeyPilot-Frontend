import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Download, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function ProxyTester() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState({
    intent: 'generate a creative story about AI learning to paint',
    payload: {
      prompt: 'Write a creative story about an AI learning to paint',
      max_tokens: 500,
      temperature: 0.7
    },
    origin: 'https://myapp.com'
  })
  const [response, setResponse] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('gemini')

  const templates = {
    gemini: {
      name: 'Gemini Text Generation',
      intent: 'generate text using Google Gemini',
      payload: {
        prompt: 'Explain quantum computing in simple terms',
        maxOutputTokens: 300,
        temperature: 0.7
      }
    },
    openai: {
      name: 'OpenAI GPT Text Generation',
      intent: 'generate text using OpenAI GPT',
      payload: {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'What is the future of AI?' }
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 200
      }
    },
    custom: {
      name: 'Custom Request',
      intent: 'generate a creative story about AI learning to paint',
      payload: {
        prompt: 'Write a creative story about an AI learning to paint',
        max_tokens: 500,
        temperature: 0.7
      }
    }
  }

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId)
    const template = templates[templateId]
    setRequest({
      ...request,
      intent: template.intent,
      payload: template.payload
    })
  }

  const handleTest = async () => {
    if (!token) {
      toast.error('No authentication token available')
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        token: token,
        intent: request.intent,
        payload: request.payload,
        origin: request.origin
      }

      const response = await fetch('http://localhost:3000/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      setResponse({
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      })

      if (response.ok) {
        toast.success('Request successful! 🎉')
      } else {
        toast.error('Request failed - check response details')
      }
    } catch (error) {
      console.error('Proxy test error:', error)
      setResponse({
        status: 'error',
        data: { error: error.message },
        timestamp: new Date().toISOString()
      })
      toast.error('Failed to connect to proxy endpoint')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard! 📋')
  }

  const downloadResponse = () => {
    if (!response) return
    
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proxy-response-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateCurl = () => {
    const requestBody = {
      token: token || 'YOUR_SESSION_TOKEN',
      intent: request.intent,
      payload: request.payload,
      origin: request.origin
    }

    return `curl -X POST "http://localhost:3000/api/proxy" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(templates).map(([id, template]) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTemplateChange(id)}
              className={`p-4 rounded-lg border transition-all ${
                selectedTemplate === id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <h4 className="font-medium mb-1">{template.name}</h4>
              <p className="text-sm opacity-75">{template.intent}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Request Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Request Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intent
              </label>
              <textarea
                value={request.intent}
                onChange={(e) => setRequest({ ...request, intent: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={2}
                placeholder="Describe what you want the API to do..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payload
              </label>
              <textarea
                value={JSON.stringify(request.payload, null, 2)}
                onChange={(e) => {
                  try {
                    const payload = JSON.parse(e.target.value)
                    setRequest({ ...request, payload })
                  } catch (error) {
                    // Invalid JSON, keep the text as is
                  }
                }}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                rows={8}
                placeholder="JSON payload for the API..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Origin
              </label>
              <input
                type="text"
                value={request.origin}
                onChange={(e) => setRequest({ ...request, origin: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="https://myapp.com"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTest}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Test API Proxy</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* cURL Command */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">cURL Command</h3>
          <div className="relative">
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
              {generateCurl()}
            </pre>
            <button
              onClick={() => copyToClipboard(generateCurl())}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
              title="Copy cURL command"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Response */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Response</h3>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                response.status === 200 || response.status === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {response.status === 200 || response.status === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>Status: {response.status}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
              </div>
              <button
                onClick={downloadResponse}
                className="text-gray-400 hover:text-white transition-colors"
                title="Download response"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Response Metrics */}
          {response.data.latency_ms && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Latency</span>
                </div>
                <p className="text-lg font-semibold text-white">{response.data.latency_ms}ms</p>
              </div>
              
              {response.data.tokens_used && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span className="text-sm text-gray-300">Tokens</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{response.data.tokens_used}</p>
                </div>
              )}

              {response.data.confidence && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span className="text-sm text-gray-300">Confidence</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{(response.data.confidence * 100).toFixed(1)}%</p>
                </div>
              )}

              {response.data.cached !== undefined && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${response.data.cached ? 'bg-purple-400' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-300">Cache</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{response.data.cached ? 'Hit' : 'Miss'}</p>
                </div>
              )}
            </div>
          )}

          {/* Notices */}
          {response.data.notices && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Notices</h4>
              <div className="space-y-1">
                {response.data.notices.map((notice, index) => (
                  <div key={index} className="text-sm text-gray-400 bg-gray-700/20 rounded px-2 py-1">
                    {notice}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Response */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Raw Response</h4>
            <pre className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProxyTester
