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
                  // console.log('Next button clicked:', { currentStep, isLastStep, totalSteps })
                  if (isLastStep) {
                    // console.log('Completing tour')
                    setShowCelebration(true)
                    setTimeout(() => {
                      completeTour()
                      setShowCelebration(false)
                    }, 4000) // Show celebration for 4 seconds
                  } else {
                    // console.log('Moving to next step')
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
          >
            {/* Minimalistic floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  y: '100vh', 
                  x: Math.random() * window.innerWidth,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: '-100vh',
                  opacity: [0, 0.6, 0.6, 0],
                  scale: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 4,
                  delay: Math.random() * 1,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}

            {/* Main celebration content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-12 max-w-2xl mx-auto text-center shadow-2xl"
            >
              {/* Checkmark icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              {/* Main text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-white mb-4">
                  Tour Completed! 🎉
                </h1>
                
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Now test out our demo app!
                </h2>
                
                <p className="text-gray-300 text-lg">
                  You're all set to explore KeyPilot's powerful features
                </p>
              </motion.div>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg">
                  Please give your comments and feedback! �
                </div>
              </motion.div>

              {/* Thank you message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-400 text-sm"
              >
                <p className="flex items-center justify-center gap-2">
                  ❤️ Thank you <span className="font-medium text-blue-400">Redis</span> for powering our backend!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default TourOverlay
