import { MongoClient } from 'mongodb'

let client = null
let db = null

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
  }
  return client
}

export async function getMongoDb() {
  if (!db) {
    const mongoClient = await getMongoClient()
    db = mongoClient.db(process.env.MONGO_DB)
  }
  return db
}

export async function closeMongoConnection() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}