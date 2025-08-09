import { createContext, useContext, useState, useEffect } from 'react'

// Initial tour state
const initialTourState = {
  isActive: false,
  currentStep: 0,
  hasCompletedTour: false
}

// Create context
const TourContext = createContext()

// Custom hook to use tour context
export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

// Tour steps configuration
export const tourSteps = [
  {
    id: 'user-token',
    title: 'Your Unified API Token',
    description: 'This is your user API token that you can use across all applications. This is the unified token for all the API keys connected to your account.',
    target: '[data-tour="user-token"]',
    position: 'bottom-left',
    highlight: true
  },
  {
    id: 'add-key-button',
    title: 'Add API Keys',
    description: 'Click here to add new API keys from various providers like OpenAI, Google, Anthropic, etc. These keys will be managed securely and can be accessed through your unified token.',
    target: '[data-tour="add-key-button"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'playground-button',
    title: 'Test Your APIs',
    description: 'Use the Playground to test your API keys with different prompts and see real-time responses. Perfect for experimenting with different AI models.',
    target: '[data-tour="playground-button"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'api-keys-section',
    title: 'Manage Your Keys',
    description: 'Here you can view all your API keys, monitor their usage, set limits, and manage permissions. Each key shows real-time statistics and status.',
    target: '[data-tour="api-keys-section"]',
    position: 'top',
    highlight: true
  },
  {
    id: 'stats-overview',
    title: 'Usage Analytics',
    description: 'Monitor your API usage with detailed statistics including daily requests, token consumption, and performance metrics across all your connected APIs.',
    target: '[data-tour="stats-overview"]',
    position: 'top',
    highlight: true
  }
]

// Tour Provider component
export const TourProvider = ({ children }) => {
  const [tourState, setTourState] = useState(() => {
    // Check if user has completed the tour before
    const hasCompleted = localStorage.getItem('keypilot_tour_completed')
    const shouldShowTour = localStorage.getItem('keypilot_show_tour')
    
    return {
      ...initialTourState,
      hasCompletedTour: hasCompleted === 'true',
      isActive: shouldShowTour === 'true' && hasCompleted !== 'true'
    }
  })

  // Start tour (called when user first logs in)
  const startTour = () => {
    // console.log('startTour called')
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_show_tour', 'true')
    localStorage.removeItem('keypilot_tour_in_progress')
  }

  // Go to next step
  const nextStep = () => {
    setTourState(prev => {
      const nextStepIndex = prev.currentStep + 1
      
    //   console.log(`Tour: Moving from step ${prev.currentStep} to step ${nextStepIndex}`)
    //   console.log(`Total steps: ${tourSteps.length}`)
      
      if (nextStepIndex >= tourSteps.length) {
        // Tour completed
        // console.log('Tour: Completing tour')
        localStorage.setItem('keypilot_tour_completed', 'true')
        localStorage.removeItem('keypilot_show_tour')
        
        return {
          ...prev,
          isActive: false,
          hasCompletedTour: true,
          currentStep: 0
        }
      }
      
      // Normal step progression
      return {
        ...prev,
        currentStep: nextStepIndex
      }
    })
  }

  // Go to previous step
  const prevStep = () => {
    setTourState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }))
  }

  // Skip tour
  const skipTour = () => {
    // console.log('skipTour called')
    setTourState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedTour: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_tour_completed', 'true')
    localStorage.removeItem('keypilot_show_tour')
    localStorage.removeItem('keypilot_tour_in_progress')
  }

  // Complete tour
  const completeTour = () => {
    // console.log('completeTour called')
    setTourState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedTour: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_tour_completed', 'true')
    localStorage.removeItem('keypilot_show_tour')
    localStorage.removeItem('keypilot_tour_in_progress')
  }

  // Reset tour (for development/testing)
  const resetTour = () => {
    localStorage.removeItem('keypilot_tour_completed')
    localStorage.removeItem('keypilot_show_tour')
    setTourState(initialTourState)
  }

  // Check if user should see tour on first login
  const checkFirstLogin = () => {
    const hasCompletedTour = localStorage.getItem('keypilot_tour_completed')
    const tourInProgress = localStorage.getItem('keypilot_tour_in_progress')
    const userToken = localStorage.getItem('keypilot_token')
    
    // console.log('checkFirstLogin called:', { 
    //   hasCompletedTour, 
    //   tourInProgress, 
    //   isActive: tourState.isActive,
    //   hasToken: !!userToken 
    // })
    
    // Don't start tour if user is not properly authenticated
    if (!userToken) {
    //   console.log('No user token found, not starting tour')
      return
    }
    
    if (!hasCompletedTour && !tourInProgress && !tourState.isActive) {
    //   console.log('Starting tour for first time')
      localStorage.setItem('keypilot_tour_in_progress', 'true')
      
      // Wait a bit more to ensure all DOM elements are rendered
      setTimeout(() => {
        // Double-check user is still authenticated
        const currentToken = localStorage.getItem('keypilot_token')
        if (!currentToken) {
        //   console.log('User token lost during tour preparation, aborting')
          localStorage.removeItem('keypilot_tour_in_progress')
          return
        }
        
        // Check if the first tour target exists before starting
        const firstTarget = document.querySelector('[data-tour="user-token"]')
        if (firstTarget) {
        //   console.log('Found tour target, starting tour')
          startTour()
        } else {
        //   console.log('Tour target not found, delaying tour start')
          // Retry after another second if target not found
          setTimeout(() => {
            const retryTarget = document.querySelector('[data-tour="user-token"]')
            const retryToken = localStorage.getItem('keypilot_token')
            if (retryTarget && retryToken) {
            //   console.log('Found tour target on retry, starting tour')
              startTour()
            } else {
            //   console.log('Tour target still not found or user logged out, giving up')
              localStorage.removeItem('keypilot_tour_in_progress')
            }
          }, 2000) // Increased retry delay
        }
      }, 1000) // Increased initial delay
    } else {
    //   console.log('Tour not starting:', { hasCompletedTour, tourInProgress, isActive: tourState.isActive })
    }
  }

  // Clean up tour state when user logs out
  const cleanupTourOnLogout = () => {
    // console.log('Cleaning up tour on logout')
    localStorage.removeItem('keypilot_tour_in_progress')
    setTourState(prev => ({
      ...prev,
      isActive: false,
      currentStep: 0
    }))
  }

  const value = {
    // State
    isActive: tourState.isActive,
    currentStep: tourState.currentStep,
    hasCompletedTour: tourState.hasCompletedTour,
    currentStepData: tourState.currentStep < tourSteps.length ? tourSteps[tourState.currentStep] : null,
    totalSteps: tourSteps.length,
    
    // Actions
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    resetTour,
    checkFirstLogin,
    cleanupTourOnLogout
  }

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  )
}
