import axios from 'axios'

// Base API configuration
const API_BASE_URL = 'http://localhost:3000'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('keypilot_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data // Return only the data part
  },
  (error) => {
    // Handle different error scenarios
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on localhost:3000')
      return Promise.reject({
        response: {
          data: {
            success: false,
            error: 'Connection failed',
            message: 'Backend server is not available. Please make sure it\'s running on localhost:3000'
          }
        }
      })
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('keypilot_token')
      localStorage.removeItem('keypilot_user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  // Login user
  login: async (userId, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        userId,
        password
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Logout user
  logout: async (userId) => {
    try {
      const response = await apiClient.post('/auth/logout', {
        userId
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Get demo users (development only)
  getDemoUsers: async () => {
    try {
      const response = await apiClient.get('/auth/demo-users')
      return response
    } catch (error) {
      // Return mock data if endpoint fails
      return {
        success: true,
        demoUsers: [
          { userId: 'demo1', passwordHint: 'pa***' },
          { userId: 'demo2', passwordHint: 'pa***' },
          { userId: 'demo3', passwordHint: 'pa***' }
        ],
        totalUsers: 3
      }
    }
  },

  // Get user profile (development only)
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/auth/user-profile/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

// General API utilities
export const api = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health')
      return response
    } catch (error) {
      return { success: false, error: 'Backend not available' }
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export default apiClient
