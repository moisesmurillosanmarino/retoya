import { authService } from '../../domain/services/auth.service.js'

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body
      const user = await authService.register({ name, email, password, role })
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      next(error)
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user
      })
    } catch (error) {
      next(error)
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id)
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }
}
