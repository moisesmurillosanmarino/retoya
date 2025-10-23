import knex from 'knex'
import { getMongoDb } from './mongo/client.js'
import knexConfig from './knex/knexfile.js'

let knexInstance = null
let mongoDb = null

export async function getDatabase() {
  const provider = process.env.DB_PROVIDER || 'postgres'
  
  if (provider === 'mongo') {
    if (!mongoDb) {
      mongoDb = await getMongoDb()
    }
    return { provider, db: mongoDb }
  } else {
    if (!knexInstance) {
      knexInstance = knex(knexConfig)
    }
    return { provider, knex: knexInstance }
  }
}

export async function closeDatabase() {
  if (knexInstance) {
    await knexInstance.destroy()
    knexInstance = null
  }
  
  if (mongoDb) {
    const { closeMongoConnection } = await import('./mongo/client.js')
    await closeMongoConnection()
    mongoDb = null
  }
}