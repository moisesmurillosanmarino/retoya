const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  // Courts endpoints
  async getCourts() {
    return this.request('/courts')
  }

  async getCourt(id) {
    return this.request(`/courts/${id}`)
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings')
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
  }

  // Teams endpoints
  async getTeams() {
    return this.request('/teams')
  }

  async createTeam(teamData) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    })
  }

  async getTeam(id) {
    return this.request(`/teams/${id}`)
  }

  // Matches endpoints
  async getMatches() {
    return this.request('/matches')
  }

  async createMatch(matchData) {
    return this.request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    })
  }

  async getMatch(id) {
    return this.request(`/matches/${id}`)
  }

  // Bets endpoints
  async getBets() {
    return this.request('/bets')
  }

  async createBet(betData) {
    return this.request('/bets', {
      method: 'POST',
      body: JSON.stringify(betData),
    })
  }

  async getBet(id) {
    return this.request(`/bets/${id}`)
  }
}

export const apiService = new ApiService()