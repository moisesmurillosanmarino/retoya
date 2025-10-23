import { getDatabase } from '../../infra/db/index.js'

class CourtRepository {
  async findAll() {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('courts').find({}).toArray()
    } else {
      // Obtener canchas con información de venue y disponibilidad
      const courts = await knex('retaya.courts as c')
        .select(
          'c.id',
          'c.name',
          'c.sport',
          'c.modality',
          'c.surface',
          'c.base_duration_minutes',
          'c.status',
          'c.is_active',
          'c.created_at',
          'c.updated_at',
          'v.id as venue_id',
          'v.name as venue_name',
          'v.address',
          'v.city',
          'v.geo_lat',
          'v.geo_lng',
          'o.business_name as owner_name'
        )
        .join('retaya.venues as v', 'v.id', 'c.venue_id')
        .join('retaya.owners as o', 'o.id', 'v.owner_id')
        .where('c.is_active', true)
        .where('c.status', 'ACTIVE')
        .orderBy('v.city', 'asc')
        .orderBy('c.name', 'asc')

      // Para cada cancha, obtener slots disponibles para hoy y mañana
      for (const court of courts) {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const slots = await knex('retaya.court_slots as cs')
          .select(
            'cs.id',
            'cs.starts_at',
            'cs.ends_at',
            'cs.price_cents',
            'cs.is_available',
            'cs.is_locked'
          )
          .where('cs.court_id', court.id)
          .where('cs.is_available', true)
          .whereBetween('cs.starts_at', [
            today.toISOString().split('T')[0] + ' 00:00:00',
            tomorrow.toISOString().split('T')[0] + ' 23:59:59'
          ])
          .orderBy('cs.starts_at', 'asc')
          .limit(10) // Limitar a 10 slots para no sobrecargar

        court.available_slots = slots
        court.next_available = slots.length > 0 ? slots[0].starts_at : null
      }

      return courts
    }
  }

  async findById(id) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      return await db.collection('courts').findOne({ _id: id })
    } else {
      // Obtener cancha con información completa
      const court = await knex('retaya.courts as c')
        .select(
          'c.id',
          'c.name',
          'c.sport',
          'c.modality',
          'c.surface',
          'c.base_duration_minutes',
          'c.status',
          'c.is_active',
          'c.created_at',
          'c.updated_at',
          'v.id as venue_id',
          'v.name as venue_name',
          'v.description as venue_description',
          'v.address',
          'v.city',
          'v.geo_lat',
          'v.geo_lng',
          'o.business_name as owner_name'
        )
        .join('retaya.venues as v', 'v.id', 'c.venue_id')
        .join('retaya.owners as o', 'o.id', 'v.owner_id')
        .where('c.id', id)
        .where('c.is_active', true)
        .where('c.status', 'ACTIVE')
        .first()

      if (!court) return null

      // Obtener slots disponibles para los próximos 7 días
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)
      
      const slots = await knex('retaya.court_slots as cs')
        .select(
          'cs.id',
          'cs.starts_at',
          'cs.ends_at',
          'cs.price_cents',
          'cs.is_available',
          'cs.is_locked'
        )
        .where('cs.court_id', court.id)
        .where('cs.is_available', true)
        .whereBetween('cs.starts_at', [
          today.toISOString().split('T')[0] + ' 00:00:00',
          nextWeek.toISOString().split('T')[0] + ' 23:59:59'
        ])
        .orderBy('cs.starts_at', 'asc')

      court.available_slots = slots

      return court
    }
  }

  async create(data) {
    const { provider, knex, db } = await getDatabase()
    
    if (provider === 'mongo') {
      const result = await db.collection('courts').insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      return { ...data, _id: result.insertedId }
    } else {
      const [court] = await knex('courts').insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      return court
    }
  }
}

export const courtRepository = new CourtRepository()
