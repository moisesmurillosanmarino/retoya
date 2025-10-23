import { betsService } from '../../domain/services/bets.service.js'

export const betsController = {
  async getAll(req, res, next) {
    try {
      const bets = await betsService.getAll()
      res.json({ bets })
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const bet = await betsService.create(req.body)
      res.status(201).json({ bet })
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const bet = await betsService.getById(id)
      res.json({ bet })
    } catch (error) {
      next(error)
    }
  }
}
