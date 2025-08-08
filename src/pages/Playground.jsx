import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Code, TestTube, BarChart3, Brain, Zap, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProxyTester from '../components/ProxyTester'
import IntentTester from '../components/IntentTester'
import CacheInspector from '../components/CacheInspector'
import IntentTrends from '../components/IntentTrends'
import FeedbackStats from '../components/FeedbackStats'

function Playground() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('proxy')

  const tabs = [
    {
      id: 'proxy',
      name: 'API Proxy',
      icon: Play,
      description: 'Test intelligent API routing and semantic caching',
      component: ProxyTester
    },
    {
      id: 'intent',
      name: 'Intent Testing',
      icon: Brain,
      description: 'Debug semantic matching and intent processing',
      component: IntentTester
    },
    {
      id: 'cache',
      name: 'Cache Inspector',
      icon: TestTube,
      description: 'Analyze cached embeddings and vector clustering',
      component: CacheInspector
    },
    {
      id: 'trends',
      name: 'Intent Trends',
      icon: BarChart3,
      description: 'Historical patterns and predictive insights',
      component: IntentTrends
    },
    {
      id: 'feedback',
      name: 'Feedback Stats',
      icon: Zap,
      description: 'User feedback and system performance metrics',
      component: FeedbackStats
    }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">API Playground</h1>
            </div>
            <div className="text-gray-300">
              Testing with: <span className="text-blue-400 font-mono">{user?.userId}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">API Testing Playground</h2>
          <p className="text-gray-400">
            Test and explore KeyPilot's intelligent proxy system, semantic caching, and analytics features
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              )
            })}
          </div>
          
          {/* Tab Description */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
          >
            <p className="text-gray-300">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </motion.div>
        </div>

        {/* Active Component */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </div>
    </div>
  )
}

export default Playground
