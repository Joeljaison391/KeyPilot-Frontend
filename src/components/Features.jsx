import { motion } from 'framer-motion'
import { 
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
  TrendingUp
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Database,
      title: "Redis-Powered Engine",
      description: "Built on Redis for lightning-fast performance with vector search capabilities and semantic matching.",
      color: "from-red-500 to-orange-500",
      highlights: ["Vector Search", "Sub-ms Latency", "High Availability"]
    },
    {
      icon: Search,
      title: "Semantic API Routing",
      description: "Describe your intent and let AI automatically select the right API key based on semantic matching.",
      color: "from-blue-500 to-cyan-500",
      highlights: ["Intent-Based", "Auto-Selection", "Smart Routing"]
    },
    {
      icon: Key,
      title: "Unified Key Management",
      description: "Manage multiple API keys under one interface with metadata tracking and automated rotation.",
      color: "from-purple-500 to-violet-500",
      highlights: ["Centralized Control", "Auto Rotation", "Metadata Tracking"]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Real-time monitoring of API usage, response times, rate limits, and performance metrics.",
      color: "from-yellow-500 to-orange-500",
      highlights: ["Real-time Metrics", "Usage Analytics", "Performance Insights"]
    },
    {
      icon: Zap,
      title: "Intelligent Caching",
      description: "Redis-powered caching system for frequently used API responses with smart invalidation.",
      color: "from-pink-500 to-rose-500",
      highlights: ["Smart Caching", "Auto-Invalidation", "Response Optimization"]
    },
    {
      icon: TrendingUp,
      title: "Real-time Monitoring",
      description: "Comprehensive monitoring of API performance, usage patterns, and system health with detailed insights.",
      color: "from-emerald-500 to-teal-500",
      highlights: ["Performance Tracking", "Usage Analytics", "Health Monitoring"]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to manage API keys efficiently with Redis-powered performance and enterprise-grade security.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    {highlight}
                  </div>
                ))}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-300 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            Ready in under 5 minutes
          </div>
          <p className="text-gray-400 text-lg">
            Start managing your API keys with enterprise-grade security and Redis performance.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
