import { bookingsService } from '../../domain/services/bookings.service.js'

export const bookingsController = {
  async getAll(req, res, next) {
    try {
      const bookings = await bookingsService.getAll()
      res.json({ bookings })
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    try {
      const booking = await bookingsService.create(req.body)
      res.status(201).json({ booking })
    } catch (error) {
      next(error)
    }
  }
}
