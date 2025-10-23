import { create } from 'zustand'

export const useUIStore = create((set, get) => ({
  // UI State
  sidebarOpen: false,
  theme: 'light',
  loading: false,
  notifications: [],

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setTheme: (theme) => {
    set({ theme })
    localStorage.setItem('theme', theme)
  },

  setLoading: (loading) => set({ loading }),

  addNotification: (notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      severity: 'info',
      summary: 'Notification',
      detail: '',
      life: 3000,
      ...notification
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))

    // Auto remove after life time
    setTimeout(() => {
      get().removeNotification(id)
    }, newNotification.life)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  // Initialize theme from localStorage
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    set({ theme: savedTheme })
  }
}))