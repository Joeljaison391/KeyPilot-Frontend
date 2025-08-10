import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Key, Menu, X, Github } from 'lucide-react'
import toast from 'react-hot-toast'
import { useConsent } from '../context/ConsentContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { canAccessLogin } = useConsent()

  const handleTryDemo = () => {
    // Always show welcome screen for demo flow unless consent already given
    if (canAccessLogin(true)) {
      toast.success('Redirecting to demo login... 🚀')
      navigate('/login')
    } else {
      navigate('/welcome')
    }
  }

  const handleLogin = () => {
    // For login from navbar, also require consent (same as demo flow)
    if (canAccessLogin(true)) {
      toast.success('Redirecting to login... 🔐')
      navigate('/login')
    } else {
      navigate('/welcome')
    }
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Key className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              KeyPilot
            </span>
          </motion.div>

          {/* Desktop Navigation */}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a
              href="https://github.com/Joeljaison391/KeyPilot-Frontend"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 py-4 border-t border-gray-700"
          >
            <nav className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 pt-4">
                <a
                  href="https://github.com/Joeljaison391/KeyPilot-Frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-center"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
