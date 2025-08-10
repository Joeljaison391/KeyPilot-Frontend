import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Key, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft, 
  Shield, 
  User,
  Lock,
  Sparkles,
  Database,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Zap,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, demoUsers, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [backendStatus, setBackendStatus] = useState(null)
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false)
  const [showCredentialsInfo, setShowCredentialsInfo] = useState(false)
  
  // Check if this is a demo login flow
  const isDemoFlow = new URLSearchParams(location.search).get('demo') === 'true'
  
  // Demo credentials mapping
  const demoCredentials = {
    demo1: { userId: 'demo1', password: 'pass1' },
    demo2: { userId: 'demo2', password: 'pass2' },
    demo3: { userId: 'demo3', password: 'pass3' }
  }

  const checkBackendConnection = async () => {
    const isConnected = await api.testConnection()
    setBackendStatus(isConnected)
  }

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection()
  }, [])

  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setSelectedDemo(null)
  }

  const handleDemoSelect = (demoUser) => {
    const credentials = demoCredentials[demoUser.userId]
    setFormData({
      userId: credentials.userId,
      password: credentials.password
    })
    setSelectedDemo(demoUser.userId)
    toast.success(`🎯 Demo user ${demoUser.userId} selected!`)
  }

  const showDemoCredentialsInfo = () => {
    toast.success(
      '🎲 Demo Credentials Pattern:\n\n' +
      '• Username: demo001 to demo999\n' +
      '• Password: pass001 to pass999\n\n' +
      'Example: demo123 / pass123',
      {
        duration: 6000,
        style: {
          background: '#1f2937',
          color: '#d1d5db',
          border: '1px solid #374151',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
        }
      }
    )
  }

  const generateRandomDemoCredentials = () => {
    setIsGeneratingDemo(true)
    
    // Generate a random number between 1 and 999
    const randomNum = Math.floor(Math.random() * 999) + 1
    const paddedNum = randomNum.toString().padStart(3, '0')
    
    const demoUserId = `demo${paddedNum}`
    const demoPassword = `pass${paddedNum}`
    
    setFormData({
      userId: demoUserId,
      password: demoPassword
    })
    
    setSelectedDemo(null)
    
    toast.success(`🎲 Generated demo credentials: ${demoUserId}`)
    
    performLogin(demoUserId, demoPassword)
    
    setIsGeneratingDemo(false)
  }

  const performLogin = async (userId, password) => {
    if (!userId || !password) {
      toast.error('📝 Please fill in all fields')
      return
    }

    const result = await login(userId, password)
    
    if (result.success) {
      toast.success('🚀 Redirecting to dashboard...')
      navigate('/dashboard')
    } else {
      // Error is already handled in AuthContext with beautiful messages
      // No need to show additional toast here
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await performLogin(formData.userId, formData.password)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Key className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KeyPilot
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to the Demo
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience Redis-powered API key management with semantic routing and enterprise security.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start text-gray-300">
                <Database className="h-5 w-5 text-red-400 mr-3" />
                <span>Redis-powered performance</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-300">
                <Shield className="h-5 w-5 text-green-400 mr-3" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-300">
                <Sparkles className="h-5 w-5 text-purple-400 mr-3" />
                <span>Semantic API routing</span>
              </div>
            </motion.div>

            {/* Backend Status */}
            <motion.div variants={itemVariants} className="mt-8">
              <div className={`inline-flex items-center px-4 py-2 border rounded-full transition-all duration-200 ${
                backendStatus === null 
                  ? 'bg-yellow-500/20 border-yellow-500/30' 
                  : backendStatus 
                    ? 'bg-green-500/20 border-green-500/30' 
                    : 'bg-red-500/20 border-red-500/30'
              }`}>
                {backendStatus === null ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                    <span className="text-yellow-400 text-sm">Checking Backend...</span>
                  </>
                ) : backendStatus ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-green-400 text-sm">✨ Backend Ready</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-400 mr-2" />
                    <span className="text-red-400 text-sm">⚠️ Backend Offline</span>
                  </>
                )}
              </div>
              
              {backendStatus === false && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-300">
                      <p className="font-medium mb-1">Backend server is not running</p>
                      <p className="text-xs opacity-90">
                        Make sure your Redis backend is running before attempting to login.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
              
                             {/* Form Header */}
               <motion.div variants={itemVariants} className="text-center mb-8">
                 {(
                   <>
                     <h2 className="text-2xl font-bold text-white mb-2">Login to KeyPilot</h2>
                     <p className="text-gray-400">Access your API management dashboard</p>
                   </>
                 )}
               </motion.div>

              {/* Demo Users */}
              {demoUsers.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Demo Access:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {demoUsers.map((demoUser) => (
                      <motion.button
                        key={demoUser.userId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDemoSelect(demoUser)}
                        className={`p-3 border rounded-lg transition-all duration-200 ${
                          selectedDemo === demoUser.userId
                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <User className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-xs font-semibold">{demoUser.userId}</div>
                        <div className="text-xs opacity-75">{demoUser.passwordHint}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

                                            {/* Login Form */}
               <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                
                                 {/* User ID Field */}
                 <div>
                   <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-medium text-gray-300">
                       User ID
                     </label>
                     {isDemoFlow && (
                       <button
                         type="button"
                         onClick={showDemoCredentialsInfo}
                         className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                       >
                         <Info className="h-3 w-3 mr-1" />
                         Demo Pattern
                       </button>
                     )}
                   </div>
                   <div className="relative">
                     <input
                       type="text"
                       name="userId"
                       value={formData.userId}
                       onChange={handleInputChange}
                       placeholder="Enter user ID (e.g., demo1)"
                       className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                       required
                     />
                     <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                   </div>
                 </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                                 {/* Submit Button */}
                 <motion.button
                   type="submit"
                   disabled={isLoading}
                   whileHover={{ scale: isLoading ? 1 : 1.02 }}
                   whileTap={{ scale: isLoading ? 1 : 0.98 }}
                   className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                 >
                   {isLoading ? (
                     <>
                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                       Signing In...
                     </>
                   ) : (
                     <>
                       <LogIn className="h-5 w-5 mr-2" />
                       Sign In to Dashboard
                     </>
                   )}
                 </motion.button>
               </motion.form>

               {/* OR Separator and Generate Demo Button */}
               {isDemoFlow && (
                 <>
                   <div className="flex items-center my-4">
                     <div className="flex-1 border-t border-gray-600"></div>
                     <span className="px-4 text-sm text-gray-400">OR</span>
                     <div className="flex-1 border-t border-gray-600"></div>
                   </div>
                   
                   <motion.div variants={itemVariants}>
                     <motion.button
                       onClick={generateRandomDemoCredentials}
                       disabled={isGeneratingDemo || isLoading}
                       whileHover={{ scale: isGeneratingDemo || isLoading ? 1 : 1.02 }}
                       whileTap={{ scale: isGeneratingDemo || isLoading ? 1 : 0.98 }}
                       className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                     >
                       {isGeneratingDemo ? (
                         <>
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                           Generating...
                         </>
                       ) : (
                         <>
                           <Sparkles className="h-5 w-5 mr-2" />
                           Generate Demo Credentials & Login
                         </>
                       )}
                     </motion.button>
                   </motion.div>
                 </>
               )}

              {/* Additional Info */}
              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Demo session valid for 30 minutes
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
