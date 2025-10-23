import { create } from 'zustand'
import { apiService } from '../../services/api.js'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  // Actions
  login: (token, user) => {
    localStorage.setItem('authToken', token)
    set({ user, token, isLoading: false, error: null })
  },

  loginAsync: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiService.login(credentials)
      const { token, user } = response
      
      localStorage.setItem('authToken', token)
      set({ user, token, isLoading: false })
      
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiService.register(userData)
      set({ isLoading: false })
      
      return { success: true, user: response.user }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },

  logout: () => {
    localStorage.removeItem('authToken')
    set({ user: null, token: null, error: null })
  },

  getMe: async () => {
    const { token } = get()
    if (!token) return

    set({ isLoading: true, error: null })
    try {
      const response = await apiService.getMe()
      set({ user: response.user, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      // If token is invalid, logout
      if (error.message.includes('Unauthorized')) {
        get().logout()
      }
    }
  },

  clearError: () => set({ error: null }),

  // Getters
  isAuthenticated: () => {
    const { token, user } = get()
    return !!(token && user)
  },

  isAdmin: () => {
    const { user } = get()
    return user?.role === 'admin'
  },

  isOwner: () => {
    const { user } = get()
    return user?.role === 'owner'
  },

  isUser: () => {
    const { user } = get()
    return user?.role === 'user'
  }
}))