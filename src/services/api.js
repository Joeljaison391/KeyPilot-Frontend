import axios from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://keypilot.onrender.com'

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
      console.error('Backend server is not running')
      console.error(error)
      throw {
        success: false,
        error: true,
        message: error.message,
        details: {
          message: 'Backend server is not available. Please check your connection'
        }
      }
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
  },

  // Get demo API key
  getDemoApiKey: async () => {
    try {
      // Get user credentials from localStorage
      const token = localStorage.getItem('keypilot_token')
      const userStr = localStorage.getItem('keypilot_user')
      
      if (!token || !userStr) {
        throw new Error('User not authenticated. Please login first.')
      }

      const user = JSON.parse(userStr)
      const userId = user?.userId
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.')
      }

      // Send userId and token as query parameters
      const response = await apiClient.get(`/auth/demo-api-key?userId=${userId}&token=${token}`)
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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      // Handle both network errors and timeouts
      console.log('Backend connection test failed:', error.message)
      return false
    }
  }
}

// API Keys management
export const apiKeysAPI = {
  // Add new API key
  addKey: async (keyData) => {
    try {
      const response = await apiClient.post('/auth/add-key', keyData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get user's API keys
  getMyKeys: async () => {
    try {
      const response = await apiClient.get('/keys/my-keys')
      return response
    } catch (error) {
      throw error
    }
  },

  // Update API key
  updateKey: async (keyData) => {
    try {
      const response = await apiClient.put('/auth/update-key', keyData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Delete API key
  deleteKey: async (template, confirm = true) => {
    try {
      const token = localStorage.getItem('keypilot_token')
      const response = await apiClient.delete('/auth/delete-key', {
        data: { token, template, confirm }
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Get available templates
  getTemplates: async () => {
    try {
      const response = await apiClient.get('/api/templates')
      return response
    } catch (error) {
      throw error
    }
  },

  // Get specific template details
  getTemplate: async (templateId) => {
    try {
      const response = await apiClient.get(`/api/templates/${templateId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default apiClient
