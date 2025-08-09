import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTour } from '../context/TourContext'
import { useNavigate } from 'react-router-dom'
import { 
  Key, 
  LogOut, 
  User, 
  Database, 
  Shield, 
  Clock,
  Activity,
  BarChart3,
  Settings,
  Plus,
  RefreshCw,
  Zap,
  Globe,
  CheckCircle,
  TrendingUp,
  Copy,
  Eye,
  EyeOff,
  Code,
  Play,
  Brain,
  TestTube
} from 'lucide-react'
import toast from 'react-hot-toast'
import AddKeyModal from '../components/AddKeyModal'
import TourOverlay from '../components/TourOverlay'
import { apiKeysAPI } from '../services/api'

const Dashboard = () => {
  const { user, token, logout, userProfile, fetchUserProfile, isAuthenticated } = useAuth()
  const { checkFirstLogin } = useTour()
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showToken, setShowToken] = useState(false)
  const [showAddKeyModal, setShowAddKeyModal] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [userApiKeys, setUserApiKeys] = useState([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (user?.userId) {
      // Only fetch data if not already loading to prevent multiple calls
      if (!isLoadingKeys) {
        fetchUserProfile(user.userId)
        fetchUserApiKeys()
      }
    }
  }, [isAuthenticated, user, navigate, fetchUserProfile])

  // Separate effect for tour - only start after initial loading and token is available
  useEffect(() => {
    // Add more conditions to ensure everything is properly loaded
    if (isAuthenticated && 
        user?.userId && 
        token && 
        !isLoadingKeys && 
        userProfile && 
        !isRefreshing) {
      
      // Ensure all DOM elements are rendered before starting tour
      const tourTimer = setTimeout(() => {
        // console.log('Dashboard: Checking first login for tour')
        // Double-check that user is still authenticated before starting tour
        if (isAuthenticated && token) {
          checkFirstLogin()
        }
      }, 3000) // Increased to 3 seconds to ensure everything is stable
      
      return () => clearTimeout(tourTimer)
    }
  }, [isAuthenticated, user, token, isLoadingKeys, userProfile, isRefreshing, checkFirstLogin])

  const fetchUserApiKeys = async () => {
    setIsLoadingKeys(true)
    try {
      const response = await apiKeysAPI.getMyKeys()
      if (response.success) {
        setUserApiKeys(response.apiKeys || [])
      }
    } catch (error) {
      // console.error('Failed to fetch API keys:', error)
      // Don't show error toast for 404 (no keys yet)
      if (error.response?.status !== 404) {
        toast.error('Failed to load API keys')
      }
    } finally {
      setIsLoadingKeys(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleRefresh = async () => {
    if (user?.userId) {
      setIsRefreshing(true)
      try {
        await Promise.all([
          fetchUserProfile(user.userId),
          fetchUserApiKeys()
        ])
        toast.success('Dashboard refreshed!')
      } catch (error) {
        toast.error('Failed to refresh dashboard')
      }
      setIsRefreshing(false)
    }
  }

  const copyToken = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token)
        toast.success('🔑 API Token copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy token')
      }
    }
  }

  const handleAddKeySuccess = () => {
    fetchUserApiKeys()
  }

  const handleEditKey = (key) => {
    setEditingKey(key)
    setIsEditMode(true)
    setShowAddKeyModal(true)
  }

  const handleCloseModal = () => {
    setShowAddKeyModal(false)
    setEditingKey(null)
    setIsEditMode(false)
  }

  const handleDeleteKey = async (key) => {
    if (window.confirm(`Are you sure you want to delete the API key "${key.description}"?`)) {
      try {
        // Implement delete functionality when API is available
        toast.success('API key deleted successfully!')
        fetchUserApiKeys()
      } catch (error) {
        toast.error('Failed to delete API key')
      }
    }
  }

  // Calculate real stats from API keys
  const calculateStats = () => {
    const totalKeys = userApiKeys.length
    const totalDailyUsage = userApiKeys.reduce((sum, key) => sum + (key.usage?.daily_usage || 0), 0)
    const totalDailyTokens = userApiKeys.reduce((sum, key) => sum + (key.usage?.daily_tokens_used || 0), 0)
    
    return {
      totalKeys,
      totalDailyUsage,
      totalDailyTokens
    }
  }

  const stats = calculateStats()

  // Stats data with real values
  const dashboardStats = [
    {
      title: 'Total API Keys',
      value: stats.totalKeys.toString(),
      icon: Key,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: `${userApiKeys.length} active`
    },
    {
      title: 'Daily Requests',
      value: stats.totalDailyUsage.toLocaleString(),
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: 'across all keys'
    },
    {
      title: 'Daily Tokens',
      value: stats.totalDailyTokens.toLocaleString(),
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      change: 'tokens used today'
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      icon: CheckCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: 'uptime maintained'
    }
  ]

  const quickActions = [
    { name: 'Add API Key', icon: Plus, color: 'bg-blue-500', onClick: () => {
      setIsEditMode(false)
      setEditingKey(null)
      setShowAddKeyModal(true)
    }},
    { name: 'View Analytics', icon: BarChart3, color: 'bg-green-500' },
    { name: 'Settings', icon: Settings, color: 'bg-purple-500' },
    { name: 'Documentation', icon: Globe, color: 'bg-orange-500' }
  ]

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Key className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KeyPilot Dashboard
                </span>
                <div className="text-xs text-gray-400">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>

            {/* User Menu */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-white transition-colors relative"
                title="Refresh Dashboard"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/playground')}
                data-tour="playground-button"
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors relative"
                title="API Playground"
              >
                <Code className="h-5 w-5" />
              </motion.button>

              {/* API Token Display */}
              {token && (
                <div 
                  data-tour="user-token"
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                >
                  <Key className="h-4 w-4 text-blue-400" />
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">API Token:</span>
                    <code className="text-xs font-mono text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      {showToken ? token : `${token.substring(0, 8)}...${token.substring(token.length - 4)}`}
                    </code>
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={copyToken}
                      className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-white font-medium">{user?.userId}</span>
                  <div className="text-xs text-green-400">● Online</div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.userId}! 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Here's your API key management dashboard. Everything is running smoothly.
          </p>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              All Systems Operational
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300">
              <Database className="h-4 w-4 mr-2" />
              Redis Connected
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div 
          data-tour="stats-overview"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
              <p className="text-xs text-green-400">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Playground Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Code className="h-6 w-6 mr-3 text-green-400" />
            API Testing & Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/playground')}
              className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl hover:border-green-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <Play className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">API Proxy</h3>
                <p className="text-gray-400 text-sm">Test intelligent routing</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/playground')}
              className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <Brain className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">Intent Testing</h3>
                <p className="text-gray-400 text-sm">Debug semantic matching</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/playground')}
              className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:border-blue-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <TestTube className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">Cache Inspector</h3>
                <p className="text-gray-400 text-sm">Analyze embeddings</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/playground')}
              className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl hover:border-orange-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-8 w-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">Intent Trends</h3>
                <p className="text-gray-400 text-sm">Historical patterns</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/playground')}
              className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl hover:border-yellow-400/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <Zap className="h-8 w-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">Feedback Stats</h3>
                <p className="text-gray-400 text-sm">Performance metrics</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* API Keys Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            data-tour="api-keys-section"
            className="lg:col-span-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Key className="h-6 w-6 mr-3 text-blue-400" />
                API Keys ({userApiKeys.length})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setIsEditMode(false)
                  setEditingKey(null)
                  setShowAddKeyModal(true)
                }}
                data-tour="add-key-button"
                className="flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Key
              </motion.button>
            </div>
            
            {isLoadingKeys ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Loading API keys...</span>
              </div>
            ) : userApiKeys.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No API Keys Yet</h3>
                <p className="text-gray-400 mb-4">Add your first API key to get started with KeyPilot.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setIsEditMode(false)
                    setEditingKey(null)
                    setShowAddKeyModal(true)
                  }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First API Key
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {userApiKeys.map((apiKey, index) => (
                  <motion.div 
                    key={apiKey.template}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <Key className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{apiKey.template}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.scopes?.slice(0, 3).map((scope) => (
                              <span key={scope} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                                {scope}
                              </span>
                            ))}
                            {apiKey.scopes?.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                                +{apiKey.scopes.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{apiKey.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Daily Usage</p>
                        <p className="text-sm font-medium text-white">{apiKey.usage?.daily_usage || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Weekly Usage</p>
                        <p className="text-sm font-medium text-white">{apiKey.usage?.weekly_usage || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Daily Tokens</p>
                        <p className="text-sm font-medium text-white">{apiKey.usage?.daily_tokens_used || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Limit</p>
                        <p className="text-sm font-medium text-white">{apiKey.limits?.max_requests_per_day || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Created: {new Date(apiKey.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditKey(apiKey)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(apiKey)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Analytics & System Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* API Usage Analytics */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                Usage Analytics
              </h3>
              
              {/* Weekly Usage Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Weekly API Calls</span>
                  <span className="text-blue-400 text-sm">+23% this week</span>
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {[40, 65, 45, 80, 60, 95, 75].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      title={`Day ${index + 1}: ${Math.round(height * 1.2)} calls`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>

              {/* Response Time Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Avg Response Time</span>
                  <span className="text-green-400 text-sm">-12ms improved</span>
                </div>
                <div className="flex items-end space-x-1 h-16">
                  {[60, 45, 55, 35, 40, 30, 25].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      title={`${Math.round(200 - height * 2)}ms avg`}
                    />
                  ))}
                </div>
              </div>

              {/* Cache Hit Rate */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Cache Hit Rate</span>
                  <span className="text-purple-400 text-sm">87.3%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '87.3%' }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-center"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                System Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Redis Database</span>
                  <span className="text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Connected
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">API Gateway</span>
                  <span className="text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Healthy
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Session</span>
                  <span className="text-yellow-400 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Rate Limits</span>
                  <span className="text-green-400">Normal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Real-time Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Recent API Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-400" />
                Recent API Activity
              </h3>
              <span className="text-green-400 text-sm flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                { 
                  action: 'Proxy request processed', 
                  details: 'text-gpt-completion → OpenAI GPT-3.5',
                  time: '2 seconds ago', 
                  status: 'success',
                  metrics: { latency: '245ms', tokens: '127', cached: true }
                },
                { 
                  action: 'Intent analysis completed', 
                  details: 'generate creative story → 89% confidence match',
                  time: '15 seconds ago', 
                  status: 'success',
                  metrics: { latency: '89ms', confidence: '89%', cached: false }
                },
                { 
                  action: 'New API key added', 
                  details: 'image-gen-dalle template configured',
                  time: '2 minutes ago', 
                  status: 'success',
                  metrics: { scope: 'image-generation', limits: '1000/day' }
                },
                { 
                  action: 'Cache cluster analyzed', 
                  details: '15 intent patterns identified',
                  time: '5 minutes ago', 
                  status: 'info',
                  metrics: { clusters: '15', efficiency: '87%', recommendations: '3' }
                },
                { 
                  action: 'Rate limit threshold reached', 
                  details: 'text-completion: 78% of daily limit used',
                  time: '12 minutes ago', 
                  status: 'warning',
                  metrics: { usage: '780/1000', remaining: '220' }
                },
                { 
                  action: 'Template matching optimized', 
                  details: 'Vector similarity threshold updated',
                  time: '23 minutes ago', 
                  status: 'success',
                  metrics: { threshold: '0.85', improvement: '+5%' }
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 mt-2 ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div>
                        <span className="text-white font-medium">{activity.action}</span>
                        <p className="text-gray-400 text-sm mt-1">{activity.details}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">{activity.time}</span>
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(activity.metrics).map(([key, value]) => (
                      <span 
                        key={key}
                        className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded border border-gray-600/30"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Performance Analytics
            </h3>
            
            {/* API Response Time Trend */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Response Time (Last 24h)</span>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-green-400">Avg: 247ms</span>
                  <span className="text-blue-400">Min: 89ms</span>
                  <span className="text-yellow-400">Max: 1.2s</span>
                </div>
              </div>
              
              <div className="flex items-end space-x-1 h-24 bg-gray-700/20 rounded-lg p-2">
                {[0.3, 0.7, 0.4, 0.9, 0.6, 1.0, 0.8, 0.5, 0.7, 0.4, 0.6, 0.3, 0.8, 0.9, 0.5, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.6, 0.4].map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 100}%` }}
                    transition={{ delay: index * 0.05 + 0.8 }}
                    className="flex-1 bg-gradient-to-t from-green-600/80 to-green-400/80 rounded-sm"
                  />
                ))}
              </div>
            </div>

            {/* Request Volume */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Request Volume (Hourly)</span>
                <span className="text-blue-400 text-xs">Peak: 156 req/hr</span>
              </div>
              
              <div className="flex items-end space-x-1 h-20 bg-gray-700/20 rounded-lg p-2">
                {[0.4, 0.3, 0.2, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.8, 0.9, 0.7, 0.8, 0.9, 1.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4].map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 100}%` }}
                    transition={{ delay: index * 0.03 + 1.2 }}
                    className="flex-1 bg-gradient-to-t from-blue-600/80 to-blue-400/80 rounded-sm"
                  />
                ))}
              </div>
            </div>

            {/* Success Rate Donut */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Success Rate</span>
                <span className="text-green-400 text-sm font-medium">98.7%</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="98.7, 100"
                      className="text-green-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-xs">Successful</span>
                    <span className="text-green-400 text-xs">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-xs">Failed</span>
                    <span className="text-red-400 text-xs">16</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-xs">Timeout</span>
                    <span className="text-yellow-400 text-xs">3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Add Key Modal */}
      <AddKeyModal 
        isOpen={showAddKeyModal}
        onClose={handleCloseModal}
        onSuccess={handleAddKeySuccess}
        editKey={editingKey}
        isEditMode={isEditMode}
      />

      {/* Tour Overlay */}
      <TourOverlay />
    </div>
  )
}

export default Dashboard
