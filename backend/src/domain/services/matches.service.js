import { matchRepository } from '../../infra/repositories/match.repository.js'

export const matchesService = {
  async getAll() {
    return await matchRepository.findAll()
  },

  async create(data) {
    return await matchRepository.create(data)
  },

  async getById(id) {
    const match = await matchRepository.findById(id)
    if (!match) {
      throw new Error('Match not found')
    }
    return match
  }
}
