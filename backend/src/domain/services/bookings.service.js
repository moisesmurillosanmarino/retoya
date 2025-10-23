import { bookingRepository } from '../../infra/repositories/booking.repository.js'

export const bookingsService = {
  async getAll() {
    return await bookingRepository.findAll()
  },

  async create(data) {
    return await bookingRepository.create(data)
  }
}
