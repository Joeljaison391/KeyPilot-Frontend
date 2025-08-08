import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
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
  Bell,
  Search,
  Plus,
  RefreshCw,
  Zap,
  Globe,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout, userProfile, fetchUserProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

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
      fetchUserProfile(user.userId)
    }
  }, [isAuthenticated, user, navigate, fetchUserProfile])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleRefresh = async () => {
    if (user?.userId) {
      setIsRefreshing(true)
      try {
        await fetchUserProfile(user.userId)
        toast.success('Profile refreshed!')
      } catch (error) {
        toast.error('Failed to refresh profile')
      }
      setIsRefreshing(false)
    }
  }

  // Sample data for demo
  const sampleStats = [
    {
      title: 'Total API Keys',
      value: userProfile?.api_keys?.total_keys || '3',
      icon: Key,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+2 this week'
    },
    {
      title: 'Daily Requests',
      value: userProfile?.summary?.total_daily_usage || '1,247',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: '+23% today'
    },
    {
      title: 'Response Time',
      value: '0.4ms',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      change: '-15% improved'
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      icon: CheckCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: '+0.1% this month'
    }
  ]

  const sampleApiKeys = [
    {
      id: 1,
      name: 'OpenAI GPT-4',
      description: 'Text generation and completion',
      usage: '245 requests today',
      status: 'active',
      scope: 'text-generation'
    },
    {
      id: 2,
      name: 'Claude Anthropic',
      description: 'Advanced reasoning and analysis', 
      usage: '156 requests today',
      status: 'active',
      scope: 'reasoning'
    },
    {
      id: 3,
      name: 'Stability AI',
      description: 'Image generation and editing',
      usage: '89 requests today', 
      status: 'active',
      scope: 'image-generation'
    }
  ]

  const quickActions = [
    { name: 'Add API Key', icon: Plus, color: 'bg-blue-500' },
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
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sampleStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* API Keys Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Key className="h-6 w-6 mr-3 text-blue-400" />
                API Keys
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Key
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {sampleApiKeys.map((apiKey, index) => (
                <motion.div 
                  key={apiKey.id}
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
                        <h3 className="font-semibold text-white">{apiKey.name}</h3>
                        <p className="text-gray-400 text-sm">{apiKey.scope}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{apiKey.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{apiKey.usage}</span>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      View Details →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & System Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">API Gateway</span>
                  <span className="text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Healthy
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Session</span>
                  <span className="text-yellow-400 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    28m left
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-400" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {[
              { action: 'API key "OpenAI GPT-4" accessed', time: '2 minutes ago', status: 'success' },
              { action: 'New session started', time: '5 minutes ago', status: 'info' },
              { action: 'Rate limit threshold reached for Claude API', time: '12 minutes ago', status: 'warning' },
              { action: 'API key "Stability AI" refreshed', time: '1 hour ago', status: 'success' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-gray-300">{activity.action}</span>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard
