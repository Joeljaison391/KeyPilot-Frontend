import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent race conditions
  demoUsers: [],
  userProfile: null,
  error: null
}

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_DEMO_USERS: 'SET_DEMO_USERS',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      }
    
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        userProfile: null,
        error: null
      }
    
    case ACTION_TYPES.SET_DEMO_USERS:
      return {
        ...state,
        demoUsers: action.payload
      }
    
    case ACTION_TYPES.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      }
    
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load persisted auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('keypilot_token')
    const savedUser = localStorage.getItem('keypilot_user')
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: { token: savedToken, user }
        })
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('keypilot_token')
        localStorage.removeItem('keypilot_user')
        // Set loading to false if there's an error
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false })
      }
    } else {
      // No saved auth data, set loading to false
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false })
    }
  }, [])

  // Define fetchDemoUsers before using it in useEffect
  const fetchDemoUsers = useCallback(async () => {
    try {
      const response = await authAPI.getDemoUsers()
      if (response.success) {
        const allowedIds = new Set(['demo1', 'demo2', 'demo3'])
        const filteredDemoUsers = Array.isArray(response.demoUsers)
          ? response.demoUsers.filter((demoUser) => allowedIds.has(demoUser.userId))
          : []

        dispatch({
          type: ACTION_TYPES.SET_DEMO_USERS,
          payload: filteredDemoUsers
        })
      }
    } catch (error) {
      console.error('Error fetching demo users:', error)
    }
  }, [])

  // Fetch demo users on mount
  useEffect(() => {
    fetchDemoUsers()
  }, [fetchDemoUsers])

  // Auth actions
  const login = async (userId, password) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true })
    
    try {
      // Try API login
      const response = await authAPI.login(userId, password)
      
      if (response.success) {
        const userData = { userId }
        
        // Persist to localStorage
        localStorage.setItem('keypilot_token', response.token)
        localStorage.setItem('keypilot_user', JSON.stringify(userData))
        
        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: { 
            token: response.token, 
            user: userData 
          }
        })
        
        toast.success(`🎉 Welcome back, ${userId}!`)
        
        // Try to fetch user profile after login
        try {
          await fetchUserProfile(userId)
        } catch (error) {
          console.error('error fetching user profile:', error)
        }
        
        return { success: true }
      } else {
        const errorMessage = response.error || 'Login failed'
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILURE,
          payload: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      let errorMessage = 'Login failed'
      
      // Handle different types of errors with beautiful messages
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = '🔌 Unable to connect to server. Please check if the backend is running.'
      } else if (error.response?.status === 409) {
        errorMessage = '👤 This user already exists or there\'s a conflict. Please try a different username.'
      } else if (error.response?.status === 401) {
        errorMessage = '🔐 Invalid credentials. Please check your username and password.'
      } else if (error.response?.status === 404) {
        errorMessage = '❓ User not found. Please check your username or sign up.'
      } else if (error.response?.status === 500) {
        errorMessage = '⚡ Server error. Please try again later.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = '❌ Login failed. Please try again.'
      }
      
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILURE,
        payload: errorMessage
      })
      
      // Show beautiful error toast
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#374151',
          color: '#fff',
          border: '1px solid #f87171',
        },
        iconTheme: {
          primary: '#f87171',
          secondary: '#374151',
        },
      })
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    const userId = state.user?.userId
    
    try {
      if (userId) {
        await authAPI.logout(userId)
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear localStorage
      localStorage.removeItem('keypilot_token')
      localStorage.removeItem('keypilot_user')
      // Clean up tour state on logout
      localStorage.removeItem('keypilot_tour_in_progress')
      
      dispatch({ type: ACTION_TYPES.LOGOUT })
      toast.success('👋 Logged out successfully')
    }
  }

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const response = await authAPI.getUserProfile(userId)
      if (response.success) {
        dispatch({
          type: ACTION_TYPES.SET_USER_PROFILE,
          payload: response.user_profile
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR })
  }, [])

  const value = {
    ...state,
    login,
    logout,
    fetchDemoUsers,
    fetchUserProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
