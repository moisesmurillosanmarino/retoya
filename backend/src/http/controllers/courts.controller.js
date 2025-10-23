import { courtsService } from '../../domain/services/courts.service.js'

export const courtsController = {
  async getAll(req, res, next) {
    try {
      const courts = await courtsService.getAll()
      res.json({ courts })
    } catch (error) {
      next(error)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const court = await courtsService.getById(id)
      res.json({ court })
    } catch (error) {
      next(error)
    }
  }
}
