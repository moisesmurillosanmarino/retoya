import { getDatabase } from '../../infra/db/index.js'

class BetRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('bets').find({}).toArray()
    } else {
      return await knex('bets').select('*')
    }
  }

  async findById(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('bets').findOne({ _id: id })
    } else {
      return await knex('bets').where('id', id).first()
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('bets').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [bet] = await knex('bets').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return bet
    }
  }
}

export const betRepository = new BetRepository()
