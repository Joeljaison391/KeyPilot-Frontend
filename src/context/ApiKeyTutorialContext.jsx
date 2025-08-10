import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Initial tutorial state
const initialTutorialState = {
  isActive: false,
  currentStep: 0,
  hasCompletedTutorial: false,
  isFirstTime: true
}

// Create context
const ApiKeyTutorialContext = createContext()

// Custom hook to use API key tutorial context
export const useApiKeyTutorial = () => {
  const context = useContext(ApiKeyTutorialContext)
  if (!context) {
    throw new Error('useApiKeyTutorial must be used within an ApiKeyTutorialProvider')
  }
  return context
}

// Tutorial steps configuration for API key addition
export const apiKeyTutorialSteps = [
  {
    id: 'template-selection',
    title: 'Choose Your Template',
    description: 'You can either select a pre-configured template or create your own custom template. Templates help you get started quickly with common API configurations.',
    target: '[data-tutorial="template-selection"]',
    position: 'bottom',
    highlight: true,
    action: 'click'
  },
  {
    id: 'demo-key',
    title: 'Use Demo API Key',
    description: 'For testing purposes, you can use our demo Google Gemini API key. Click the "Use Demo Key" button to automatically fill in a demo key for Google Gemini.',
    target: '[data-tutorial="demo-key-button"]',
    position: 'left',
    highlight: true,
    action: 'click'
  },
  {
    id: 'description',
    title: 'Add Meaningful Description',
    description: 'Describe what this API key will be used for. Be specific about the purpose - e.g., "Chat completion for customer support", "Text analysis for content moderation", etc.',
    target: '[data-tutorial="description-field"]',
    position: 'bottom',
    highlight: true,
    action: 'focus'
  },
  {
    id: 'template-name',
    title: 'Set Unique Template Name',
    description: 'Give your template a unique, descriptive name. This helps you identify and manage your API keys later. Use kebab-case format like "my-chat-completion".',
    target: '[data-tutorial="template-name-field"]',
    position: 'bottom',
    highlight: true,
    action: 'focus'
  },
  {
    id: 'expiry-date',
    title: 'Set Expiry Date',
    description: 'Set when this API key should expire. By default, it\'s set to tomorrow. You can extend this based on your security requirements.',
    target: '[data-tutorial="expiry-date-field"]',
    position: 'bottom',
    highlight: true,
    action: 'focus'
  },
  {
    id: 'rate-limits',
    title: 'Configure Rate Limits',
    description: 'Set your daily and weekly request limits, daily token limits, and maximum payload size. You can use the defaults or customize based on your needs.',
    target: '[data-tutorial="rate-limits-section"]',
    position: 'left',
    highlight: true,
    action: 'scroll'
  },
  {
    id: 'allowed-origins',
    title: 'Add Allowed Origins',
    description: 'Specify which domains can use this API key. At least one origin is required. The default is set to https://myapp.com - update this to your actual domain.',
    target: '[data-tutorial="allowed-origins-section"]',
    position: 'left',
    highlight: true,
    action: 'focus'
  },
  {
    id: 'scopes',
    title: 'Define API Scopes',
    description: 'Specify what this API key can do. Common scopes include: text, chat, completion, gemini. Add the scopes that match your use case.',
    target: '[data-tutorial="scopes-section"]',
    position: 'left',
    highlight: true,
    action: 'focus'
  },
  {
    id: 'submit',
    title: 'Add Your API Key',
    description: 'Review all your settings and click "Add API Key" to create your new API key. You\'ll be able to manage and monitor it from your dashboard.',
    target: '[data-tutorial="submit-button"]',
    position: 'top',
    highlight: true,
    action: 'click'
  }
]

// API Key Tutorial Provider component
export const ApiKeyTutorialProvider = ({ children }) => {
  const [tutorialState, setTutorialState] = useState(() => {
    // Check if user has completed the API key tutorial before
    const hasCompleted = localStorage.getItem('keypilot_api_key_tutorial_completed')
    const isFirstTime = localStorage.getItem('keypilot_first_api_key') !== 'true'
    
    return {
      ...initialTutorialState,
      hasCompletedTutorial: hasCompleted === 'true',
      isFirstTime
    }
  })

  // Start tutorial (called when user opens AddKeyModal for the first time)
  const startTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_api_key_tutorial_in_progress', 'true')
  }, [])

  // Go to next step
  const nextStep = useCallback(() => {
    setTutorialState(prev => {
      const nextStepIndex = prev.currentStep + 1
      
      if (nextStepIndex >= apiKeyTutorialSteps.length) {
        // Tutorial completed
        localStorage.setItem('keypilot_api_key_tutorial_completed', 'true')
        localStorage.removeItem('keypilot_api_key_tutorial_in_progress')
        
        return {
          ...prev,
          isActive: false,
          hasCompletedTutorial: true,
          currentStep: 0
        }
      }
      
      // Normal step progression
      return {
        ...prev,
        currentStep: nextStepIndex
      }
    })
  }, [])

  // Go to previous step
  const prevStep = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }))
  }, [])

  // Skip tutorial
  const skipTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedTutorial: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_api_key_tutorial_completed', 'true')
    localStorage.removeItem('keypilot_api_key_tutorial_in_progress')
  }, [])

  // Complete tutorial
  const completeTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedTutorial: true,
      currentStep: 0
    }))
    localStorage.setItem('keypilot_api_key_tutorial_completed', 'true')
    localStorage.removeItem('keypilot_api_key_tutorial_in_progress')
  }, [])

  // Mark first API key as added
  const markFirstApiKeyAdded = useCallback(() => {
    localStorage.setItem('keypilot_first_api_key', 'true')
    setTutorialState(prev => ({
      ...prev,
      isFirstTime: false
    }))
  }, [])

  // Check if tutorial should start
  const checkShouldStartTutorial = useCallback(() => {
    const hasCompletedTutorial = localStorage.getItem('keypilot_api_key_tutorial_completed')
    const tutorialInProgress = localStorage.getItem('keypilot_api_key_tutorial_in_progress')
    const isFirstTime = localStorage.getItem('keypilot_first_api_key') !== 'true'
    
    if (isFirstTime && !hasCompletedTutorial && !tutorialInProgress && !tutorialState.isActive) {
      // Wait a bit to ensure modal is fully rendered
      setTimeout(() => {
        const firstTarget = document.querySelector('[data-tutorial="template-selection"]')
        if (firstTarget) {
          startTutorial()
        } else {
          // Retry after another second if target not found
          setTimeout(() => {
            const retryTarget = document.querySelector('[data-tutorial="template-selection"]')
            if (retryTarget) {
              startTutorial()
            }
          }, 1000)
        }
      }, 500)
    }
  }, [tutorialState.isActive, startTutorial])

  // Reset tutorial (for development/testing)
  const resetTutorial = useCallback(() => {
    localStorage.removeItem('keypilot_api_key_tutorial_completed')
    localStorage.removeItem('keypilot_api_key_tutorial_in_progress')
    localStorage.removeItem('keypilot_first_api_key')
    setTutorialState(initialTutorialState)
  }, [])

  const value = {
    // State
    isActive: tutorialState.isActive,
    currentStep: tutorialState.currentStep,
    hasCompletedTutorial: tutorialState.hasCompletedTutorial,
    isFirstTime: tutorialState.isFirstTime,
    currentStepData: tutorialState.currentStep < apiKeyTutorialSteps.length ? apiKeyTutorialSteps[tutorialState.currentStep] : null,
    totalSteps: apiKeyTutorialSteps.length,
    
    // Actions
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    markFirstApiKeyAdded,
    checkShouldStartTutorial,
    resetTutorial
  }

  return (
    <ApiKeyTutorialContext.Provider value={value}>
      {children}
    </ApiKeyTutorialContext.Provider>
  )
}
