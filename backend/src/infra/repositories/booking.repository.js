import { getDatabase } from '../../infra/db/index.js'

class BookingRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('bookings').find({}).toArray()
    } else {
      return await knex('bookings').select('*')
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('bookings').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [booking] = await knex('bookings').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return booking
    }
  }
}

export const bookingRepository = new BookingRepository()
