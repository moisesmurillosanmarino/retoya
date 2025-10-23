import { teamsService } from '../../domain/services/teams.service.js'

export const teamsController = {
  async getAll(req, res, next) {
    try {
      const teams = await teamsService.getAll()
      res.json({ teams })
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const team = await teamsService.create(req.body)
      res.status(201).json({ team })
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const team = await teamsService.getById(id)
      res.json({ team })
    } catch (error) {
      next(error)
    }
  }
}
