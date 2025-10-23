import { betRepository } from '../../infra/repositories/bet.repository.js'

export const betsService = {
  async getAll() {
    return await betRepository.findAll()
  },

  async create(data) {
    return await betRepository.create(data)
  },

  async getById(id) {
    const bet = await betRepository.findById(id)
    if (!bet) {
      throw new Error('Bet not found')
    }
    return bet
  }
}
