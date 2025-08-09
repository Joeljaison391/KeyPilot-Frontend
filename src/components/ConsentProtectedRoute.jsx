import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useConsent } from '../context/ConsentContext'
import toast from 'react-hot-toast'

const ConsentProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { canAccessLogin, showWelcomeScreen } = useConsent()
  
  // Check if this is a demo flow (has demo=true query parameter)
  const isDemoFlow = new URLSearchParams(location.search).get('demo') === 'true'
  
  useEffect(() => {
    if (isDemoFlow && !canAccessLogin(true)) {
      // User is trying to access demo login without consent
      toast.error('Please provide consent to use the demo')
      showWelcomeScreen()
      navigate('/')
    }
  }, [isDemoFlow, canAccessLogin, showWelcomeScreen, navigate])
  
  // If it's a demo flow and no consent, don't render children
  if (isDemoFlow && !canAccessLogin(true)) {
    return null
  }
  
  // Otherwise, render the children (login page)
  return children
}

export default ConsentProtectedRoute
