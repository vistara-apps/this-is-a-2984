/**
 * Authentication Service
 * Handles user authentication, session management, and user profile operations
 */

import { useState, useEffect } from 'react'
import { internalApi } from './api'

const AUTH_TOKEN_KEY = 'brandsync_auth_token'
const USER_DATA_KEY = 'brandsync_user_data'

/**
 * Authentication state management
 */
class AuthService {
  constructor() {
    this.currentUser = null
    this.authToken = null
    this.isInitialized = false
    this.listeners = []
  }

  /**
   * Initialize authentication service
   */
  async initialize() {
    if (this.isInitialized) return

    try {
      // Check for stored auth token
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_DATA_KEY)

      if (storedToken && storedUser) {
        this.authToken = storedToken
        this.currentUser = JSON.parse(storedUser)
        
        // Verify token is still valid
        await this.verifyToken()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      this.clearAuth()
    }

    this.isInitialized = true
    this.notifyListeners()
  }

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const { user, token } = await response.json()
      
      this.setAuth(user, token)
      return user
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const { user, token } = await response.json()
      
      this.setAuth(user, token)
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(googleToken) {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken })
      })

      if (!response.ok) {
        throw new Error('Google login failed')
      }

      const { user, token } = await response.json()
      
      this.setAuth(user, token)
      return user
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      if (this.authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuth()
    }
  }

  /**
   * Verify current auth token
   */
  async verifyToken() {
    if (!this.authToken) {
      throw new Error('No auth token')
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }

      const { user } = await response.json()
      this.currentUser = user
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
      
      return user
    } catch (error) {
      console.error('Token verification error:', error)
      this.clearAuth()
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    if (!this.currentUser) {
      throw new Error('User not authenticated')
    }

    try {
      const updatedUser = await internalApi.updateUser(this.currentUser.userId, profileData)
      this.currentUser = updatedUser
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser))
      this.notifyListeners()
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Password change failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Password reset request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Password reset failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  /**
   * Set authentication data
   */
  setAuth(user, token) {
    this.currentUser = user
    this.authToken = token
    
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    
    this.notifyListeners()
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    this.currentUser = null
    this.authToken = null
    
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    
    this.notifyListeners()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(this.currentUser && this.authToken)
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return this.authToken
  }

  /**
   * Add auth state listener
   */
  addListener(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  /**
   * Notify all listeners of auth state changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          isAuthenticated: this.isAuthenticated(),
          user: this.currentUser,
          token: this.authToken
        })
      } catch (error) {
        console.error('Auth listener error:', error)
      }
    })
  }

  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders() {
    if (!this.authToken) {
      return {}
    }

    return {
      'Authorization': `Bearer ${this.authToken}`
    }
  }
}

// Create singleton instance
const authService = new AuthService()

/**
 * Demo mode functions for development
 */
export const demoAuth = {
  /**
   * Login as demo user (for development)
   */
  async loginAsDemo() {
    const demoUser = {
      userId: 'demo_user_1',
      email: 'demo@brandsync.ai',
      subscriptionTier: 'Pro',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        company: 'BrandSync Demo',
        avatar: null
      },
      preferences: {
        defaultTemplate: null,
        autoApplyBranding: true,
        notifications: {
          email: true,
          videoComplete: true,
          subscriptionUpdates: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const demoToken = 'demo_token_' + Date.now()
    
    authService.setAuth(demoUser, demoToken)
    return demoUser
  },

  /**
   * Check if in demo mode
   */
  isDemoMode() {
    const user = authService.getCurrentUser()
    return user?.userId?.startsWith('demo_')
  }
}

/**
 * React hook for authentication
 */
export function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
    token: authService.getAuthToken(),
    isLoading: !authService.isInitialized
  })

  useEffect(() => {
    // Initialize auth service
    authService.initialize().then(() => {
      setAuthState({
        isAuthenticated: authService.isAuthenticated(),
        user: authService.getCurrentUser(),
        token: authService.getAuthToken(),
        isLoading: false
      })
    })

    // Listen for auth changes
    const unsubscribe = authService.addListener((newState) => {
      setAuthState({
        ...newState,
        isLoading: false
      })
    })

    return unsubscribe
  }, [])

  return {
    ...authState,
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    updateProfile: authService.updateProfile.bind(authService),
    changePassword: authService.changePassword.bind(authService),
    requestPasswordReset: authService.requestPasswordReset.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    loginWithGoogle: authService.loginWithGoogle.bind(authService),
    // Demo functions
    loginAsDemo: demoAuth.loginAsDemo,
    isDemoMode: demoAuth.isDemoMode
  }
}

export default authService
