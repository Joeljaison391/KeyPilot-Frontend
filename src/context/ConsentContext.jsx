import { createContext, useContext, useState, useEffect } from 'react'

// Initial state
const initialState = {
  hasConsent: false,
  showWelcome: false,
  consentGiven: false
}

// Create context
const ConsentContext = createContext()

// Custom hook to use consent context
export const useConsent = () => {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider')
  }
  return context
}

// Consent Provider component
export const ConsentProvider = ({ children }) => {
  const [consentState, setConsentState] = useState(() => {
    // Check if consent was previously given and stored
    const storedConsent = localStorage.getItem('keypilot_demo_consent')
    const storedConsentExpiry = localStorage.getItem('keypilot_demo_consent_expiry')
    
    // Check if consent exists and hasn't expired (24 hours)
    if (storedConsent === 'true' && storedConsentExpiry) {
      const expiryTime = parseInt(storedConsentExpiry)
      const now = Date.now()
      
      if (now < expiryTime) {
        return {
          ...initialState,
          hasConsent: true,
          consentGiven: true
        }
      } else {
        // Clear expired consent
        localStorage.removeItem('keypilot_demo_consent')
        localStorage.removeItem('keypilot_demo_consent_expiry')
      }
    }
    
    return initialState
  })

  // Show welcome screen (called when user clicks "Try Demo")
  const showWelcomeScreen = () => {
    setConsentState(prev => ({
      ...prev,
      showWelcome: true
    }))
  }

  // Hide welcome screen
  const hideWelcomeScreen = () => {
    setConsentState(prev => ({
      ...prev,
      showWelcome: false
    }))
  }

  // Give consent (called when user accepts terms in welcome screen)
  const giveConsent = () => {
    const consentExpiry = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    
    // Store consent in localStorage with expiry
    localStorage.setItem('keypilot_demo_consent', 'true')
    localStorage.setItem('keypilot_demo_consent_expiry', consentExpiry.toString())
    
    setConsentState(prev => ({
      ...prev,
      hasConsent: true,
      consentGiven: true,
      showWelcome: false
    }))
  }

  // Revoke consent (for testing or user choice)
  const revokeConsent = () => {
    localStorage.removeItem('keypilot_demo_consent')
    localStorage.removeItem('keypilot_demo_consent_expiry')
    
    setConsentState({
      ...initialState
    })
  }

  // Reset consent (for development/testing)
  const resetConsent = () => {
    localStorage.removeItem('keypilot_demo_consent')
    localStorage.removeItem('keypilot_demo_consent_expiry')
    
    setConsentState({
      ...initialState
    })
  }

  // Check if user can access login (has consent or is not in demo flow)
  const canAccessLogin = (isDemoFlow = false) => {
    if (!isDemoFlow) {
      return true // Regular users can always access login
    }
    return consentState.hasConsent // Demo users need consent
  }

  const value = {
    // State
    hasConsent: consentState.hasConsent,
    showWelcome: consentState.showWelcome,
    consentGiven: consentState.consentGiven,
    
    // Actions
    showWelcomeScreen,
    hideWelcomeScreen,
    giveConsent,
    revokeConsent,
    resetConsent,
    canAccessLogin
  }

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  )
}
