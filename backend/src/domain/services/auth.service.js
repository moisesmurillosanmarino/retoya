import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../config/env.js'
import { userRepository } from '../../infra/repositories/user.repository.js'

export const authService = {
  async register({ name, email, password, role = 'user' }) {
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userRepository.create({
      name,
      email,
      password_hash: passwordHash,
      role
    })

    return user
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  },

  async getUserById(id) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
}
