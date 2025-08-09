import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  ArrowRight, 
  Shield, 
  Key, 
  Users, 
  ExternalLink,
  BookOpen,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react'
import { useConsent } from '../context/ConsentContext'

const WelcomeScreen = ({ onProceed, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const { giveConsent, hideWelcomeScreen } = useConsent()

  const handleProceed = () => {
    if (!consentChecked) {
      return // Don't proceed without consent
    }
    
    giveConsent() // Store consent in global state
    if (onProceed) {
      onProceed()
    }
  }

  const handleClose = () => {
    hideWelcomeScreen()
    if (onClose) {
      onClose()
    }
  }

  const handleProceedToDemo = () => {
    onProceed()
    navigate('/login')
  }

  const demoSteps = [
    {
      title: "Login with Demo Credentials",
      description: "Use any of the provided demo user accounts to access the platform",
      image: "/demo-images/login-step.png", // You'll need to add these images
      code: `
// Demo Users Available:
- demo1 (password: demo123)
- demo2 (password: demo456)  
- demo3 (password: demo789)
      `
    },
    {
      title: "Add API Keys",
      description: "Click 'Use Demo Key' to auto-fill with a demo API key for testing",
      image: "/demo-images/add-key-step.png",
      code: `
// Demo API Key Format:
sk-demo1234567890abcdef1234567890abcdef1234567890abcdef
      `
    },
    {
      title: "Configure Templates",
      description: "Select from pre-configured templates for different AI providers",
      image: "/demo-images/template-step.png",
      code: `
// Available Templates:
- OpenAI GPT Models
- Claude Models  
- Gemini Models
- Custom Templates
      `
    },
    {
      title: "Test Your Setup",
      description: "Use the playground to test API calls and monitor usage",
      image: "/demo-images/playground-step.png",
      code: `
// Test Features:
- Intent Testing
- Proxy Testing
- Cache Inspector
- Real-time Analytics
      `
    }
  ]

  const features = [
    "🔐 Secure API Key Management",
    "📊 Real-time Usage Analytics", 
    "🎯 Intent-based Routing",
    "⚡ Caching & Performance",
    "🔍 Request Monitoring",
    "🛡️ Rate Limiting & Security"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-700 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex items-center space-x-3 mb-4"
            >
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Key className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">KeyPilot Demo</h1>
            </motion.div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-amber-400 font-semibold mb-1">Demo Platform Notice</h3>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    This is a demo application focused on showcasing features and implementation. 
                    Please don't misuse the demo users and demo API keys. Keep your intentions good, 
                    use the platform responsibly, and share your feedback on our{' '}
                    <a href="https://dev.to" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-100 underline">
                      Dev.to blog
                    </a> and provide comments about your experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-1 bg-gray-700/50 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'demo', label: 'Demo Guide', icon: Play },
                { id: 'features', label: 'Features', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Video Section */}
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Play className="h-6 w-6 mr-2 text-blue-400" />
                  Demo Walkthrough Video
                </h2>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Video Placeholder - Replace with actual video */}
                  <div className="text-center z-10">
                    <div className="bg-blue-500/20 rounded-full p-6 inline-block mb-4">
                      <Play className="h-16 w-16 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Demo Video Coming Soon</h3>
                    <p className="text-gray-300 mb-2">Complete walkthrough of KeyPilot features</p>
                    <p className="text-gray-500 text-sm">Duration: ~10 minutes</p>
                    <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Watch Tutorial
                    </button>
                  </div>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                      {Array.from({length: 32}).map((_, i) => (
                        <div key={i} className="border border-blue-500/20"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 
                  Replace this section with actual video embed when ready:
                  <iframe 
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                    title="KeyPilot Demo Walkthrough"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  */}
                </div>
              </div>

              {/* Quick Start */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">🚀 Quick Start</h3>
                  <ol className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      <span>Choose a demo user to login</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      <span>Add API keys using demo keys</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      <span>Explore the dashboard and features</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                      <span>Test API calls in the playground</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">⚠️ Important Notes</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Demo data resets periodically</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">All API keys are for demo purposes only</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">No real API calls are made to external services</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Feel free to experiment with all features</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'demo' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">📖 Complete Demo Guide</h2>
              
              {demoSteps.map((step, index) => (
                <div key={index} className="bg-gray-700/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      
                      {/* Placeholder for image */}
                      <div className="bg-gray-900 rounded-lg p-8 text-center">
                        <div className="text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-2" />
                          <p>Screenshot: {step.title}</p>
                          <p className="text-xs">Image coming soon</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Example Code/Config:</h4>
                      <pre className="bg-gray-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
                        <code>{step.code.trim()}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">💡 Pro Tips</h3>
                <ul className="space-y-2 text-blue-200">
                  <li>• Use the "Use Demo Key" button to quickly populate API key fields</li>
                  <li>• Check the Cache Inspector to see how caching improves performance</li>
                  <li>• Try different templates to see how they affect API routing</li>
                  <li>• Monitor the real-time stats dashboard during testing</li>
                  <li>• Experiment with rate limiting and security features</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">✨ Platform Features</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-4 text-center"
                  >
                    <p className="text-white font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>

              {/* Community Links */}
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Share Your Feedback & Resources
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href="https://dev.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h4 className="text-white font-medium">Dev.to Blog</h4>
                      <p className="text-gray-400 text-sm">Read our articles</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </a>
                  
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h4 className="text-white font-medium">GitHub Repo</h4>
                      <p className="text-gray-400 text-sm">Star & contribute</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </a>

                  <a
                    href="/DEMO_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h4 className="text-white font-medium">Demo Guide</h4>
                      <p className="text-gray-400 text-sm">Full documentation</p>
                    </div>
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-700">
          {/* Consent Checkbox */}
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Terms of Use & Consent
              </h3>
              
              <div className="space-y-3 text-sm text-gray-300 mb-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReadTerms}
                    onChange={(e) => setHasReadTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <span>
                    I have read and understood that this is a demo platform for showcase purposes only.
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    disabled={!hasReadTerms}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 bg-gray-700 disabled:opacity-50"
                  />
                  <span className={!hasReadTerms ? 'opacity-50' : ''}>
                    I agree to use this demo responsibly, not misuse demo credentials, and provide constructive feedback.
                  </span>
                </label>
              </div>
              
              {!consentChecked && (
                <p className="text-amber-400 text-xs flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Please provide your consent to continue with the demo
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.button
              whileHover={consentChecked ? { scale: 1.05 } : {}}
              whileTap={consentChecked ? { scale: 0.95 } : {}}
              onClick={handleProceed}
              disabled={!consentChecked}
              className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-medium transition-all ${
                consentChecked 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Login</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
          
          <p className="text-center text-gray-400 text-xs mt-4">
            Your consent will be stored for 24 hours. You can revoke it anytime.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
