import { getDatabase } from '../../infra/db/index.js'

class UserRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('users').find({}).toArray()
    } else {
      return await knex('users').select('*')
    }
  }

  async findById(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('users').findOne({ _id: id })
    } else {
      return await knex('users').where('id', id).first()
    }
  }

  async findByEmail(email) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('users').findOne({ email })
    } else {
      return await knex('users').where('email', email).first()
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('users').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [user] = await knex('users').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return user
    }
  }

  async update(id, data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      await db.collection('users').updateOne(
        { _id: id },
        { $set: { ...data, updated_at: new Date() } }
      )
      return await this.findById(id)
    } else {
      const [user] = await knex('users')
        .where('id', id)
        .update({ ...data, updated_at: new Date() })
        .returning('*')
      return user
    }
  }

  async delete(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('users').deleteOne({ _id: id })
    } else {
      return await knex('users').where('id', id).del()
    }
  }
}

export const userRepository = new UserRepository()
