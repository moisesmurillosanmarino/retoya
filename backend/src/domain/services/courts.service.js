import { courtRepository } from '../../infra/repositories/court.repository.js'

export const courtsService = {
  async getAll() {
    return await courtRepository.findAll()
  },

  async getById(id) {
    const court = await courtRepository.findById(id)
    if (!court) {
      throw new Error('Court not found')
    }
    return court
  }
}
