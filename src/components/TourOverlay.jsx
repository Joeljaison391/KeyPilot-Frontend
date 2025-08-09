import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, SkipForward, CheckCircle, Star, Sparkles, Heart } from 'lucide-react'
import { useTour } from '../context/TourContext'

const TourOverlay = () => {
  const { 
    isActive, 
    currentStepData, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep, 
    skipTour, 
    completeTour 
  } = useTour()
  
  const [targetElement, setTargetElement] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [showCelebration, setShowCelebration] = useState(false)
  const tooltipRef = useRef(null)

  // Debug logging
  useEffect(() => {
    console.log('TourOverlay render:', { 
      isActive, 
      currentStep, 
      totalSteps, 
      currentStepData: currentStepData?.id 
    })
  }, [isActive, currentStep, totalSteps, currentStepData])

  // Find and highlight target element
  useEffect(() => {
    if (isActive && currentStepData) {
      const element = document.querySelector(currentStepData.target)
      if (element) {
        setTargetElement(element)
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect()
        const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 320, height: 200 }
        
        let top = rect.top
        let left = rect.left
        
        // Position based on step configuration
        switch (currentStepData.position) {
          case 'bottom':
            top = rect.bottom + 10
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
            break
          case 'bottom-left':
            top = rect.bottom + 10
            left = rect.left
            break
          case 'bottom-right':
            top = rect.bottom + 10
            left = rect.right - tooltipRect.width
            break
          case 'top':
            top = rect.top - tooltipRect.height - 10
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
            break
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
            left = rect.left - tooltipRect.width - 10
            break
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2)
            left = rect.right + 10
            break
          default:
            top = rect.bottom + 10
            left = rect.left
        }
        
        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        if (left < 10) left = 10
        if (left + tooltipRect.width > viewportWidth - 10) left = viewportWidth - tooltipRect.width - 10
        if (top < 10) top = 10
        if (top + tooltipRect.height > viewportHeight - 10) top = viewportHeight - tooltipRect.height - 10
        
        setTooltipPosition({ top, left })
        
        // Scroll element into view if needed
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        })
      }
    }
  }, [isActive, currentStepData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove any highlights when component unmounts
      document.querySelectorAll('[data-tour-highlight]').forEach(el => {
        el.removeAttribute('data-tour-highlight')
      })
    }
  }, [])

  if (!isActive || !currentStepData) {
    return null
  }

  const isLastStep = currentStep === totalSteps - 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Backdrop with spotlight effect */}
        <div className="absolute inset-0 bg-black/20">
          {targetElement && currentStepData.highlight && (
            <div
              className="absolute border-2 border-blue-400 rounded-lg bg-blue-400/10 animate-pulse"
              style={{
                top: targetElement.getBoundingClientRect().top - 4,
                left: targetElement.getBoundingClientRect().left - 4,
                width: targetElement.getBoundingClientRect().width + 8,
                height: targetElement.getBoundingClientRect().height + 8,
              }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bg-gray-800 border border-gray-600 rounded-xl shadow-2xl pointer-events-auto max-w-sm"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Arrow pointer */}
          {currentStepData.position?.includes('bottom') && (
            <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-800 border-l border-t border-gray-600 rotate-45"></div>
          )}
          {currentStepData.position?.includes('top') && (
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-800 border-r border-b border-gray-600 rotate-45"></div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{currentStep + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
              </div>
              <button
                onClick={skipTour}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </button>
                )}
                <button
                  onClick={skipTour}
                  className="flex items-center px-3 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip Tour
                </button>
              </div>
              
              <button
                onClick={() => {
                  console.log('Next button clicked:', { currentStep, isLastStep, totalSteps })
                  if (isLastStep) {
                    console.log('Completing tour')
                    setShowCelebration(true)
                    setTimeout(() => {
                      completeTour()
                      setShowCelebration(false)
                    }, 4000) // Show celebration for 4 seconds
                  } else {
                    console.log('Moving to next step')
                    nextStep()
                  }
                }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Tour
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Celebration Popup */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: '100vh', 
                  x: Math.random() * window.innerWidth,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: '-100vh',
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                {i % 3 === 0 ? (
                  <Star className="h-6 w-6 text-yellow-400" />
                ) : i % 3 === 1 ? (
                  <Sparkles className="h-5 w-5 text-blue-400" />
                ) : (
                  <Heart className="h-5 w-5 text-pink-400" />
                )}
              </motion.div>
            ))}

            {/* Main celebration content */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="text-center max-w-2xl mx-auto px-8"
            >
              {/* Main celebration text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <motion.h1 
                  className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  🎉 Congratulations! 🎉
                </motion.h1>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Now test out our demo app!!!
                </motion.h2>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-300 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  You're all set to explore KeyPilot's powerful features
                </motion.p>
              </motion.div>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-8"
              >
                <motion.div 
                  className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold text-lg shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 10px 30px rgba(34, 197, 94, 0.3)",
                      "0 20px 40px rgba(34, 197, 94, 0.5)",
                      "0 10px 30px rgba(34, 197, 94, 0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  🚀 Please give your comments and feedback! 🚀
                </motion.div>
              </motion.div>

              {/* Thank you message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <motion.p 
                  className="text-lg text-gray-400 flex items-center justify-center gap-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Heart className="h-5 w-5 text-red-400" />
                  Thank you 
                  <span className="font-bold text-red-500">Redis</span> 
                  for powering our backend!
                  <Heart className="h-5 w-5 text-red-400" />
                </motion.p>
              </motion.div>

              {/* Confetti burst effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ 
                  duration: 1,
                  delay: 0.5,
                  times: [0, 0.6, 1]
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 1,
                        scale: 1
                      }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 800,
                        y: (Math.random() - 0.5) * 600,
                        opacity: 0,
                        scale: 0
                      }}
                      transition={{ 
                        duration: 2,
                        delay: 0.5 + Math.random() * 0.5,
                        ease: "easeOut"
                      }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#fbbf24', '#f59e0b', '#ef4444', '#ec4899',
                          '#8b5cf6', '#3b82f6', '#10b981', '#06b6d4'
                        ][i % 8]
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default TourOverlay
