import { motion } from 'framer-motion'
import { 
  Code, 
  Smartphone, 
  Globe, 
  Brain, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const UseCases = () => {
  const useCases = [
    {
      icon: Brain,
      title: "AI Development Teams",
      description: "Manage multiple AI API keys (OpenAI, Anthropic, Cohere) with semantic routing based on task requirements.",
      benefits: [
        "Automatic model selection",
        "Cost optimization",
        "Fallback handling",
        "Usage analytics"
      ],
      color: "from-blue-500 to-cyan-500",
      example: "\"Use GPT-4 for code generation\" → Automatically routes to OpenAI API"
    },
    {
      icon: Smartphone,
      title: "Mobile App Developers",
      description: "Centralize all your mobile app API keys with secure token management and rate limiting.",
      benefits: [
        "Cross-platform support",
        "Token refresh automation",
        "Rate limit management",
        "Security compliance"
      ],
      color: "from-purple-500 to-pink-500",
      example: "\"Send push notification\" → Routes to Firebase or APNs based on platform"
    },
    {
      icon: Globe,
      title: "SaaS Platforms",
      description: "Manage customer API keys with multi-tenant isolation and comprehensive usage tracking.",
      benefits: [
        "Multi-tenant isolation",
        "Billing integration",
        "Usage quotas",
        "Customer analytics"
      ],
      color: "from-green-500 to-emerald-500",
      example: "\"Generate invoice\" → Routes to Stripe or PayPal based on customer preference"
    },
    {
      icon: Code,
      title: "Development Teams",
      description: "Streamline API development with environment-specific key management and testing tools.",
      benefits: [
        "Environment separation",
        "Team collaboration",
        "Testing utilities",
        "Version control"
      ],
      color: "from-orange-500 to-red-500",
      example: "\"Deploy to staging\" → Automatically uses staging environment keys"
    }
  ]

  const handleGetStarted = (useCase) => {
    toast.success(`🚀 Starting setup for ${useCase}...`)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Built for Every Team
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI startups to enterprise SaaS platforms, KeyPilot adapts to your workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${useCase.color} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {useCase.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6">
                {useCase.description}
              </p>

              {/* Example */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-400 font-semibold">Example</span>
                </div>
                <p className="text-gray-300 text-sm font-mono">
                  {useCase.example}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {useCase.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGetStarted(useCase.title)}
                className={`w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r ${useCase.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group`}
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Quick Integration card removed as requested */}
      </div>
    </section>
  )
}

export default UseCases
