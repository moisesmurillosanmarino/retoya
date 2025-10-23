// Umzug ejecuta esta función con un contexto { db }
export const up = async ({ db }) => {
  await db.createCollection('users')
  await db.createCollection('courts')
  await db.createCollection('bookings')
  await db.createCollection('teams')
  await db.createCollection('team_members')
  await db.createCollection('matches')
  await db.createCollection('bets')
  
  // Índices para optimizar consultas
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('courts').createIndex({ location: '2dsphere' })
  await db.collection('bookings').createIndex({ court_id: 1, start_time: 1 })
  await db.collection('bookings').createIndex({ user_id: 1 })
  await db.collection('teams').createIndex({ captain_user_id: 1 })
  await db.collection('team_members').createIndex({ team_id: 1, user_id: 1 }, { unique: true })
  await db.collection('matches').createIndex({ booking_id: 1 })
  await db.collection('bets').createIndex({ match_id: 1 })
}

export const down = async ({ db }) => {
  await db.collection('bets').drop().catch(() => {})
  await db.collection('matches').drop().catch(() => {})
  await db.collection('team_members').drop().catch(() => {})
  await db.collection('teams').drop().catch(() => {})
  await db.collection('bookings').drop().catch(() => {})
  await db.collection('courts').drop().catch(() => {})
  await db.collection('users').drop().catch(() => {})
}
