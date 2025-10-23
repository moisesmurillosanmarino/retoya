import { matchesService } from '../../domain/services/matches.service.js'

export const matchesController = {
  async getAll(req, res, next) {
    try {
      const matches = await matchesService.getAll()
      res.json({ matches })
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const match = await matchesService.create(req.body)
      res.status(201).json({ match })
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const match = await matchesService.getById(id)
      res.json({ match })
    } catch (error) {
      next(error)
    }
  }
}
