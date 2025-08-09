import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Shield, 
  Zap, 
  Database, 
  Key, 
  Lock, 
  Cpu, 
  BarChart3,
  Search,
  Settings,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Github,
  Twitter,
  Globe
} from 'lucide-react'
import Header from './Header'
import Hero from './Hero'
import Features from './Features'
import Stats from './Stats'
// UseCases removed from landing page
import Footer from './Footer'

const LandingPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Hero />
      <Features />
      <Stats />
      {/* UseCases removed */}
      <Footer />
    </div>
  )
}

export default LandingPage
