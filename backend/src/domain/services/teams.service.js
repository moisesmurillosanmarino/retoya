import { teamRepository } from '../../infra/repositories/team.repository.js'

export const teamsService = {
  async getAll() {
    return await teamRepository.findAll()
  },

  async create(data) {
    return await teamRepository.create(data)
  },

  async getById(id) {
    const team = await teamRepository.findById(id)
    if (!team) {
      throw new Error('Team not found')
    }
    return team
  }
}
