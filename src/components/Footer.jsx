import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Key, Github, Twitter, Globe, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const Footer = () => {
  const navigate = useNavigate()


  const handleTryDemo = () => {
    toast.success('🚀 Redirecting to demo login...')
    navigate('/login')
  }


  return (
    <footer className="relative bg-gray-900 border-t border-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KeyPilot
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                Semantic API gateway with Redis-powered key management. 
                Built for developers who need intelligent API routing and enterprise-grade security.
              </p>

              {/* Hackathon Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Redis Hackathon 2024 Project
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://keypilot.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
                >
                  <Globe className="h-5 w-5" />
                </motion.a>
              </div>

              {/* Combined bottom row (copyright + CTA) */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>© 2024 KeyPilot. Made with</span>
                    <Heart className="h-4 w-4 text-red-400 mx-1 animate-pulse" />
                    <span>for the Redis Hackathon</span>
                  </div>
                  <motion.button
                    onClick={handleTryDemo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Try Demo Now
                    <Key className="h-4 w-4 ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
