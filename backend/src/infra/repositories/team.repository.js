import { getDatabase } from '../../infra/db/index.js'

class TeamRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('teams').find({}).toArray()
    } else {
      return await knex('teams').select('*')
    }
  }

  async findById(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('teams').findOne({ _id: id })
    } else {
      return await knex('teams').where('id', id).first()
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('teams').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [team] = await knex('teams').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return team
    }
  }
}

export const teamRepository = new TeamRepository()
