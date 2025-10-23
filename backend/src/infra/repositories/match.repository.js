import { getDatabase } from '../../infra/db/index.js'

class MatchRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('matches').find({}).toArray()
    } else {
      return await knex('matches').select('*')
    }
  }

  async findById(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('matches').findOne({ _id: id })
    } else {
      return await knex('matches').where('id', id).first()
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('matches').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [match] = await knex('matches').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return match
    }
  }
}

export const matchRepository = new MatchRepository()
