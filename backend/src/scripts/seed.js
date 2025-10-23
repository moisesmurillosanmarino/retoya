import { getDatabase } from '../infra/db/index.js'
import bcrypt from 'bcryptjs'

async function seed() {
  const { provider, knex, db } = await getDatabase()
  
  if (provider === 'mongo') {
    await seedMongo(db)
  } else {
    await seedSQL(knex)
  }
  
  console.log('✅ RetaYa MVP seed data created successfully')
}

async function seedSQL(knex) {
  console.log('🌱 Poblando base de datos RetaYa MVP...')
  
  // 1. Crear usuarios de prueba
  console.log('👥 Creando usuarios...')
  
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const [adminUser] = await knex('retaya.users').insert({
    email: 'admin@retaya.com',
    full_name: 'Administrador RetaYa',
    phone: '+57 300 123 4567',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  const ownerPasswordHash = await bcrypt.hash('owner123', 10)
  const [ownerUser] = await knex('retaya.users').insert({
    email: 'owner@retaya.com',
    full_name: 'Carlos Mendoza - Propietario',
    phone: '+57 300 234 5678',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  const userPasswordHash = await bcrypt.hash('user123', 10)
  const [regularUser] = await knex('retaya.users').insert({
    email: 'user@retaya.com',
    full_name: 'Juan Pérez - Usuario',
    phone: '+57 300 345 6789',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  // Crear credenciales para usuarios
  await knex('retaya.user_credentials').insert([
    {
      user_id: adminUser.id,
      provider: 'EMAIL_OTP',
      provider_uid: adminUser.email,
      email_verified: true,
      last_login_at: new Date()
    },
    {
      user_id: ownerUser.id,
      provider: 'EMAIL_OTP',
      provider_uid: ownerUser.email,
      email_verified: true,
      last_login_at: new Date()
    },
    {
      user_id: regularUser.id,
      provider: 'EMAIL_OTP',
      provider_uid: regularUser.email,
      email_verified: true,
      last_login_at: new Date()
    }
  ])
  
  // Asignar roles
  const adminRole = await knex('retaya.roles').where('key', 'ADMIN').first()
  const ownerRole = await knex('retaya.roles').where('key', 'OWNER').first()
  const userRole = await knex('retaya.roles').where('key', 'USER').first()
  
  await knex('retaya.user_roles').insert([
    { user_id: adminUser.id, role_id: adminRole.id },
    { user_id: ownerUser.id, role_id: ownerRole.id },
    { user_id: regularUser.id, role_id: userRole.id }
  ])
  
  // 2. Crear propietario y venue
  console.log('🏢 Creando propietario y venue...')
  
  const [owner] = await knex('retaya.owners').insert({
    user_id: ownerUser.id,
    business_name: 'Complejo Deportivo El Dorado',
    kyc_status: 'VERIFIED',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  const [venue] = await knex('retaya.venues').insert({
    owner_id: owner.id,
    name: 'Complejo Deportivo El Dorado',
    description: 'Complejo deportivo moderno con múltiples canchas de fútbol, ubicado en el corazón de Bogotá. Contamos con canchas de fútbol 5, 7 y 11, todas con césped sintético de última generación.',
    address: 'Carrera 15 #93-47, Chapinero',
    city: 'Bogotá',
    country: 'CO',
    geo_lat: 4.6500,
    geo_lng: -74.0600,
    publish_state: 'PUBLISHED',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  // 3. Crear canchas
  console.log('⚽ Creando canchas...')
  
  const [court1] = await knex('retaya.courts').insert({
    venue_id: venue.id,
    name: 'Cancha Principal - Fútbol 5',
    sport: 'FUTBOL_5',
    modality: '5v5',
    surface: 'Césped Sintético Premium',
    base_duration_minutes: 60,
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  const [court2] = await knex('retaya.courts').insert({
    venue_id: venue.id,
    name: 'Cancha Secundaria - Fútbol 7',
    sport: 'FUTBOL_7',
    modality: '7v7',
    surface: 'Césped Sintético',
    base_duration_minutes: 90,
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  const [court3] = await knex('retaya.courts').insert({
    venue_id: venue.id,
    name: 'Cancha Premium - Fútbol 11',
    sport: 'FUTBOL_11',
    modality: '11v11',
    surface: 'Césped Natural Profesional',
    base_duration_minutes: 90,
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  // 4. Crear horarios para las canchas
  console.log('🕐 Configurando horarios...')
  
  const courts = [court1, court2, court3]
  for (const court of courts) {
    for (let weekday = 0; weekday < 7; weekday++) {
      await knex('retaya.court_schedules').insert({
        court_id: court.id,
        weekday: weekday,
        open_time: '06:00',
        close_time: '22:00',
        slot_minutes: court.base_duration_minutes
      })
    }
  }
  
  // 5. Crear reglas de precio
  console.log('💰 Configurando precios...')
  
  await knex('retaya.pricing_rules').insert([
    // Cancha Fútbol 5 - Tarifas normales
    {
      court_id: court1.id,
      currency: 'COP',
      price_cents: 45000, // $45,000 COP
      weekday: 1, // Lunes
      time_from: '06:00',
      time_to: '18:00',
      promo_label: 'Tarifa Normal'
    },
    {
      court_id: court1.id,
      currency: 'COP',
      price_cents: 55000, // $55,000 COP
      weekday: 1, // Lunes
      time_from: '18:00',
      time_to: '22:00',
      promo_label: 'Tarifa Nocturna'
    },
    // Cancha Fútbol 7
    {
      court_id: court2.id,
      currency: 'COP',
      price_cents: 65000, // $65,000 COP
      weekday: 1,
      time_from: '06:00',
      time_to: '18:00',
      promo_label: 'Tarifa Normal'
    },
    {
      court_id: court2.id,
      currency: 'COP',
      price_cents: 75000, // $75,000 COP
      weekday: 1,
      time_from: '18:00',
      time_to: '22:00',
      promo_label: 'Tarifa Nocturna'
    },
    // Cancha Fútbol 11
    {
      court_id: court3.id,
      currency: 'COP',
      price_cents: 120000, // $120,000 COP
      weekday: 1,
      time_from: '06:00',
      time_to: '22:00',
      promo_label: 'Tarifa Premium'
    }
  ])
  
  // 6. Crear equipo de ejemplo
  console.log('👥 Creando equipos...')
  
  const [team] = await knex('retaya.teams').insert({
    name: 'Los Campeones FC',
    owner_user_id: regularUser.id,
    sport: 'FUTBOL_5',
    status: 'ACTIVE',
    is_active: true
  }).returning('*')
  
  await knex('retaya.team_members').insert([
    { team_id: team.id, user_id: regularUser.id, role: 'CAPTAIN' }
  ])
  
  // 7. Crear cupones de ejemplo
  console.log('🎫 Creando cupones...')
  
  await knex('retaya.coupons').insert([
    {
      code: 'BIENVENIDO20',
      description: 'Descuento del 20% para nuevos usuarios',
      percent_off: 20.00,
      max_redemptions: 100,
      valid_from: new Date(),
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      active: true
    },
    {
      code: 'FINDE50',
      description: 'Descuento de $50,000 para fines de semana',
      amount_off_cents: 5000000, // $50,000 COP
      max_redemptions: 50,
      valid_from: new Date(),
      valid_to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
      active: true
    }
  ])
  
  // 8. Crear slots de ejemplo para los próximos días
  console.log('📅 Generando slots de ejemplo...')
  
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0) // 10:00 AM
  
  // Crear algunos slots para mañana
  for (let i = 0; i < 3; i++) {
    const startTime = new Date(tomorrow)
    startTime.setHours(10 + i, 0, 0, 0)
    
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 1, 0, 0, 0)
    
    await knex('retaya.court_slots').insert({
      court_id: court1.id,
      starts_at: startTime,
      ends_at: endTime,
      currency: 'COP',
      price_cents: 45000,
      is_available: true
    })
  }
  
  console.log('✅ SQL seed data created successfully')
  console.log('\n📊 Resumen de datos creados:')
  console.log('   👥 Usuarios: 3 (admin, owner, user)')
  console.log('   🏢 Venue: Complejo Deportivo El Dorado')
  console.log('   ⚽ Canchas: 3 (Fútbol 5, 7 y 11)')
  console.log('   👥 Equipo: Los Campeones FC')
  console.log('   🎫 Cupones: 2 (BIENVENIDO20, FINDE50)')
  console.log('   📅 Slots: 3 slots de ejemplo para mañana')
  console.log('\n🔑 Credenciales de acceso:')
  console.log('   Admin: admin@retaya.com / admin123')
  console.log('   Owner: owner@retaya.com / owner123')
  console.log('   User: user@retaya.com / user123')
}

async function seedMongo(db) {
  console.log('🌱 Poblando MongoDB RetaYa MVP...')
  
  // Crear usuarios
  const adminUser = (await db.collection('users').insertOne({
    email: 'admin@retaya.com',
    full_name: 'Administrador RetaYa',
    phone: '+57 300 123 4567',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  const ownerUser = (await db.collection('users').insertOne({
    email: 'owner@retaya.com',
    full_name: 'Carlos Mendoza - Propietario',
    phone: '+57 300 234 5678',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  const regularUser = (await db.collection('users').insertOne({
    email: 'user@retaya.com',
    full_name: 'Juan Pérez - Usuario',
    phone: '+57 300 345 6789',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  // Crear owner y venue
  const owner = (await db.collection('owners').insertOne({
    user_id: ownerUser,
    business_name: 'Complejo Deportivo El Dorado',
    kyc_status: 'VERIFIED',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  const venue = (await db.collection('venues').insertOne({
    owner_id: owner,
    name: 'Complejo Deportivo El Dorado',
    description: 'Complejo deportivo moderno con múltiples canchas de fútbol',
    address: 'Carrera 15 #93-47, Chapinero',
    city: 'Bogotá',
    country: 'CO',
    geo_lat: 4.6500,
    geo_lng: -74.0600,
    publish_state: 'PUBLISHED',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  // Crear canchas
  await db.collection('courts').insertMany([
    {
      venue_id: venue,
      name: 'Cancha Principal - Fútbol 5',
      sport: 'FUTBOL_5',
      modality: '5v5',
      surface: 'Césped Sintético Premium',
      base_duration_minutes: 60,
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      venue_id: venue,
      name: 'Cancha Secundaria - Fútbol 7',
      sport: 'FUTBOL_7',
      modality: '7v7',
      surface: 'Césped Sintético',
      base_duration_minutes: 90,
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      venue_id: venue,
      name: 'Cancha Premium - Fútbol 11',
      sport: 'FUTBOL_11',
      modality: '11v11',
      surface: 'Césped Natural Profesional',
      base_duration_minutes: 90,
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
  
  // Crear equipo
  const team = (await db.collection('teams').insertOne({
    name: 'Los Campeones FC',
    owner_user_id: regularUser,
    sport: 'FUTBOL_5',
    status: 'ACTIVE',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })).insertedId
  
  await db.collection('team_members').insertOne({
    team_id: team,
    user_id: regularUser,
    role: 'CAPTAIN',
    joined_at: new Date()
  })
  
  // Crear cupones
  await db.collection('coupons').insertMany([
    {
      code: 'BIENVENIDO20',
      description: 'Descuento del 20% para nuevos usuarios',
      percent_off: 20.00,
      max_redemptions: 100,
      valid_from: new Date(),
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true,
      created_at: new Date()
    },
    {
      code: 'FINDE50',
      description: 'Descuento de $50,000 para fines de semana',
      amount_off_cents: 5000000,
      max_redemptions: 50,
      valid_from: new Date(),
      valid_to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      active: true,
      created_at: new Date()
    }
  ])
  
  console.log('✅ MongoDB seed data created successfully')
}

seed().catch(console.error)