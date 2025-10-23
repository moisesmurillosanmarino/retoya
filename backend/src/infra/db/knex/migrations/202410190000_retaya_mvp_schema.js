/** @param {import('knex').Knex} knex */
export async function up(knex) {
  // Crear esquema
  await knex.raw('CREATE SCHEMA IF NOT EXISTS retaya;')
  
  // Habilitar extensiones necesarias
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "citext";')
  
  // Crear tipos de apoyo
  await knex.raw(`
    CREATE TYPE retaya.auth_provider AS ENUM ('EMAIL_OTP','GOOGLE','APPLE','FACEBOOK');
    CREATE TYPE retaya.role_key AS ENUM ('ADMIN','OWNER','USER');
    CREATE TYPE retaya.sport_key AS ENUM ('FUTBOL_5','FUTBOL_7','FUTBOL_11','BASKET','TENIS','PADEL','MULTIDEPORTE');
    CREATE TYPE retaya.currency AS ENUM ('COP','USD');
    CREATE TYPE retaya.booking_state AS ENUM (
      'REQUESTED','PENDING_PAYMENT','CONFIRMED','CHECKED_IN','COMPLETED',
      'CANCELED','EXPIRED','REFUND_REQUESTED','REFUNDED'
    );
    CREATE TYPE retaya.payment_state AS ENUM (
      'CREATED','REQUIRES_ACTION','CAPTURED','FAILED','CANCELED','REFUNDED','PARTIALLY_REFUNDED'
    );
    CREATE TYPE retaya.challenge_state AS ENUM ('OPEN','ACCEPTED','DECLINED','CANCELED','PLAYED');
    CREATE TYPE retaya.tournament_state AS ENUM ('DRAFT','PUBLISHED','ONGOING','FINISHED','CANCELED');
  `)

  // 1) Identidad, roles y sesiones (JWT, listas negras)
  await knex.schema.withSchema('retaya')
    .createTable('users', (t) => {
      t.bigIncrements('id').primary()
      t.specificType('email', 'CITEXT').unique().notNullable()
      t.text('phone')
      t.text('full_name').notNullable()
      t.text('avatar_url')
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('user_credentials', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.specificType('provider', 'retaya.auth_provider').notNullable()
      t.text('provider_uid').notNullable()
      t.boolean('email_verified').notNullable().defaultTo(false)
      t.timestamp('last_login_at', { useTz: true })
      t.unique(['provider', 'provider_uid'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('roles', (t) => {
      t.bigIncrements('id').primary()
      t.specificType('key', 'retaya.role_key').unique().notNullable()
      t.text('name').notNullable()
    })

  await knex.schema.withSchema('retaya')
    .createTable('user_roles', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.bigInteger('role_id').notNullable().references('id').inTable('retaya.roles').onDelete('RESTRICT')
      t.unique(['user_id', 'role_id'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('auth_sessions', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('device_info')
      t.specificType('ip', 'INET')
      t.text('refresh_token_hash').notNullable()
      t.timestamp('refresh_expires_at', { useTz: true }).notNullable()
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('revoked_at', { useTz: true })
      t.unique(['user_id', 'refresh_token_hash'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('jwt_blacklist', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('access_token_hash').notNullable()
      t.timestamp('issued_at', { useTz: true }).notNullable()
      t.timestamp('expires_at', { useTz: true }).notNullable()
      t.text('revoked_reason')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.unique(['access_token_hash'])
    })

  // 2) Sedes, canchas, calendarios, slots y precios
  await knex.schema.withSchema('retaya')
    .createTable('owners', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().unique().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('business_name').notNullable()
      t.text('kyc_status').notNullable().defaultTo('PENDING').checkIn(['PENDING','VERIFIED','REJECTED'])
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('venues', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('owner_id').notNullable().references('id').inTable('retaya.owners').onDelete('RESTRICT')
      t.text('name').notNullable()
      t.text('description')
      t.text('address').notNullable()
      t.text('city').notNullable()
      t.text('country').notNullable().defaultTo('CO')
      t.double('geo_lat')
      t.double('geo_lng')
      t.text('publish_state').notNullable().defaultTo('DRAFT').checkIn(['DRAFT','SUBMITTED','APPROVED','REJECTED','PUBLISHED'])
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('courts', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('venue_id').notNullable().references('id').inTable('retaya.venues').onDelete('RESTRICT')
      t.text('name').notNullable()
      t.specificType('sport', 'retaya.sport_key').notNullable()
      t.text('modality')
      t.text('surface')
      t.integer('base_duration_minutes').notNullable().defaultTo(60)
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('court_schedules', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('court_id').notNullable().references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.smallint('weekday').notNullable().checkBetween([0, 6])
      t.time('open_time').notNullable()
      t.time('close_time').notNullable()
      t.integer('slot_minutes').notNullable().defaultTo(60)
      t.unique(['court_id', 'weekday'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('court_blackouts', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('court_id').notNullable().references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.timestamp('starts_at', { useTz: true }).notNullable()
      t.timestamp('ends_at', { useTz: true }).notNullable()
      t.text('reason')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('pricing_rules', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('court_id').notNullable().references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.specificType('currency', 'retaya.currency').notNullable().defaultTo('COP')
      t.bigInteger('price_cents').notNullable().checkPositive()
      t.smallint('weekday')
      t.time('time_from')
      t.time('time_to')
      t.date('date_from')
      t.date('date_to')
      t.text('promo_label')
      t.boolean('is_promo').notNullable().defaultTo(false)
    })

  await knex.schema.withSchema('retaya')
    .createTable('court_slots', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('court_id').notNullable().references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.timestamp('starts_at', { useTz: true }).notNullable()
      t.timestamp('ends_at', { useTz: true }).notNullable()
      t.specificType('currency', 'retaya.currency').notNullable().defaultTo('COP')
      t.bigInteger('price_cents').notNullable()
      t.timestamp('lock_expires_at', { useTz: true })
      t.boolean('is_locked').notNullable().defaultTo(false)
      t.boolean('is_available').notNullable().defaultTo(true)
      t.unique(['court_id', 'starts_at'])
      t.check('ends_at > starts_at')
    })

  // 3) Reservas, pagos, reembolsos, liquidaciones
  await knex.schema.withSchema('retaya')
    .createTable('bookings', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('slot_id').notNullable().references('id').inTable('retaya.court_slots').onDelete('RESTRICT')
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.bigInteger('owner_id').notNullable().references('id').inTable('retaya.owners').onDelete('RESTRICT')
      t.bigInteger('court_id').notNullable().references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.bigInteger('venue_id').notNullable().references('id').inTable('retaya.venues').onDelete('RESTRICT')
      t.specificType('state', 'retaya.booking_state').notNullable().defaultTo('REQUESTED')
      t.specificType('currency', 'retaya.currency').notNullable().defaultTo('COP')
      t.bigInteger('price_cents').notNullable()
      t.bigInteger('fee_cents').notNullable().defaultTo(0)
      t.bigInteger('discount_cents').notNullable().defaultTo(0)
      t.bigInteger('total_cents').notNullable()
      t.text('notes')
      t.timestamp('checkin_at', { useTz: true })
      t.timestamp('completed_at', { useTz: true })
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('booking_events', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('booking_id').notNullable().references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.specificType('from_state', 'retaya.booking_state')
      t.specificType('to_state', 'retaya.booking_state').notNullable()
      t.jsonb('metadata')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('payment_intents', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('booking_id').notNullable().unique().references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.text('provider').notNullable()
      t.text('provider_intent_id').unique()
      t.specificType('currency', 'retaya.currency').notNullable().defaultTo('COP')
      t.bigInteger('amount_cents').notNullable()
      t.specificType('state', 'retaya.payment_state').notNullable().defaultTo('CREATED')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('payment_events', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('payment_intent_id').notNullable().references('id').inTable('retaya.payment_intents').onDelete('RESTRICT')
      t.text('event_key').notNullable()
      t.jsonb('payload')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('refunds', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('payment_intent_id').notNullable().references('id').inTable('retaya.payment_intents').onDelete('RESTRICT')
      t.bigInteger('amount_cents').notNullable().checkPositive()
      t.text('reason')
      t.specificType('state', 'retaya.payment_state').notNullable().defaultTo('REFUNDED')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('settlements', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('owner_id').notNullable().references('id').inTable('retaya.owners').onDelete('RESTRICT')
      t.date('period_from').notNullable()
      t.date('period_to').notNullable()
      t.specificType('currency', 'retaya.currency').notNullable().defaultTo('COP')
      t.bigInteger('gross_cents').notNullable().defaultTo(0)
      t.bigInteger('fees_cents').notNullable().defaultTo(0)
      t.bigInteger('net_cents').notNullable().defaultTo(0)
      t.timestamp('generated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('paid_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('settlement_items', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('settlement_id').notNullable().references('id').inTable('retaya.settlements').onDelete('RESTRICT')
      t.bigInteger('booking_id').notNullable().references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.bigInteger('gross_cents').notNullable()
      t.bigInteger('fee_cents').notNullable()
      t.bigInteger('net_cents').notNullable()
      t.unique(['settlement_id', 'booking_id'])
    })

  // 4) Equipos, retas, torneos, partidos
  await knex.schema.withSchema('retaya')
    .createTable('teams', (t) => {
      t.bigIncrements('id').primary()
      t.text('name').notNullable()
      t.bigInteger('owner_user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.specificType('sport', 'retaya.sport_key').notNullable().defaultTo('FUTBOL_5')
      t.text('status').notNullable().defaultTo('ACTIVE').checkIn(['ACTIVE','INACTIVE','ARCHIVED'])
      t.boolean('is_active').notNullable().defaultTo(true)
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('deleted_at', { useTz: true })
    })

  await knex.schema.withSchema('retaya')
    .createTable('team_members', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('team_id').notNullable().references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('role').notNullable().defaultTo('PLAYER')
      t.timestamp('joined_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.unique(['team_id', 'user_id'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('challenges', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('challenger_team_id').notNullable().references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.bigInteger('opponent_team_id').references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.bigInteger('booking_id').references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.bigInteger('stake_cents').notNullable().defaultTo(0)
      t.specificType('state', 'retaya.challenge_state').notNullable().defaultTo('OPEN')
      t.text('message')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('tournaments', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('owner_id').references('id').inTable('retaya.owners').onDelete('RESTRICT')
      t.text('name').notNullable()
      t.specificType('sport', 'retaya.sport_key').notNullable()
      t.specificType('state', 'retaya.tournament_state').notNullable().defaultTo('DRAFT')
      t.text('rules')
      t.bigInteger('entry_fee_cents').notNullable().defaultTo(0)
      t.bigInteger('prize_pool_cents').notNullable().defaultTo(0)
      t.date('starts_on')
      t.date('ends_on')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('tournament_enrollments', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('tournament_id').notNullable().references('id').inTable('retaya.tournaments').onDelete('RESTRICT')
      t.bigInteger('team_id').notNullable().references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.boolean('paid').notNullable().defaultTo(false)
      t.unique(['tournament_id', 'team_id'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('matches', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('tournament_id').references('id').inTable('retaya.tournaments').onDelete('RESTRICT')
      t.bigInteger('booking_id').references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.bigInteger('court_id').references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.bigInteger('team_home_id').notNullable().references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.bigInteger('team_away_id').notNullable().references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.timestamp('starts_at', { useTz: true }).notNullable()
      t.timestamp('ends_at', { useTz: true })
      t.integer('score_home')
      t.integer('score_away')
      t.text('status').notNullable().defaultTo('SCHEDULED').checkIn(['SCHEDULED','PLAYED','CANCELED'])
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  // 5) Contenido, cupones, notificaciones y chat
  await knex.schema.withSchema('retaya')
    .createTable('media', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('owner_id').references('id').inTable('retaya.owners').onDelete('RESTRICT')
      t.bigInteger('venue_id').references('id').inTable('retaya.venues').onDelete('RESTRICT')
      t.bigInteger('court_id').references('id').inTable('retaya.courts').onDelete('RESTRICT')
      t.text('url').notNullable()
      t.text('alt')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('coupons', (t) => {
      t.bigIncrements('id').primary()
      t.text('code').unique().notNullable()
      t.text('description')
      t.decimal('percent_off', 5, 2).checkBetween([0, 100])
      t.bigInteger('amount_off_cents').checkPositive()
      t.integer('max_redemptions')
      t.integer('redeemed_count').notNullable().defaultTo(0)
      t.timestamp('valid_from', { useTz: true })
      t.timestamp('valid_to', { useTz: true })
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.boolean('active').notNullable().defaultTo(true)
    })

  await knex.schema.withSchema('retaya')
    .createTable('coupon_redemptions', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('coupon_id').notNullable().references('id').inTable('retaya.coupons').onDelete('RESTRICT')
      t.bigInteger('booking_id').notNullable().references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.bigInteger('amount_cents').notNullable()
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
      t.unique(['coupon_id', 'booking_id'])
    })

  await knex.schema.withSchema('retaya')
    .createTable('notifications', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('key').notNullable()
      t.jsonb('payload')
      t.timestamp('delivered_at', { useTz: true })
      t.timestamp('read_at', { useTz: true })
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('chat_rooms', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('booking_id').references('id').inTable('retaya.bookings').onDelete('RESTRICT')
      t.bigInteger('team_id').references('id').inTable('retaya.teams').onDelete('RESTRICT')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('chat_messages', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('room_id').notNullable().references('id').inTable('retaya.chat_rooms').onDelete('RESTRICT')
      t.bigInteger('sender_id').notNullable().references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('content').notNullable()
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  // 6) Auditoría y seguridad
  await knex.schema.withSchema('retaya')
    .createTable('audit_logs', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('actor_user_id').references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('entity').notNullable()
      t.bigInteger('entity_id').notNullable()
      t.text('action').notNullable()
      t.jsonb('prev')
      t.jsonb('next')
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  await knex.schema.withSchema('retaya')
    .createTable('otp_requests', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('user_id').references('id').inTable('retaya.users').onDelete('RESTRICT')
      t.text('destination').notNullable()
      t.text('code_hash').notNullable()
      t.timestamp('expires_at', { useTz: true }).notNullable()
      t.timestamp('consumed_at', { useTz: true })
      t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now())
    })

  // Crear índices útiles
  await knex.raw(`
    CREATE INDEX ON retaya.venues (city);
    CREATE INDEX ON retaya.venues (geo_lat, geo_lng);
    CREATE INDEX ON retaya.courts (venue_id, sport);
    CREATE INDEX ON retaya.court_slots (court_id, starts_at);
    CREATE INDEX ON retaya.bookings (user_id, created_at DESC);
    CREATE INDEX ON retaya.bookings (owner_id, created_at DESC);
    CREATE INDEX ON retaya.bookings (state);
    CREATE UNIQUE INDEX ON retaya.teams (LOWER(name));
  `)

  // Insertar roles por defecto
  await knex('retaya.roles').insert([
    { key: 'ADMIN', name: 'Administrador' },
    { key: 'OWNER', name: 'Gestor de Cancha' },
    { key: 'USER', name: 'Usuario' }
  ]).onConflict('key').ignore()

  // Crear función para actualizar updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION retaya.touch_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END; $$ LANGUAGE plpgsql;
  `)

  // Crear triggers para updated_at
  await knex.raw(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at' AND table_schema = 'retaya'
      LOOP
        EXECUTE format(
          'DROP TRIGGER IF EXISTS trg_touch_%I ON %I.%I;
           CREATE TRIGGER trg_touch_%I BEFORE UPDATE ON %I.%I
           FOR EACH ROW EXECUTE FUNCTION retaya.touch_updated_at();',
          r.table_name, r.table_schema, r.table_name,
          r.table_name, r.table_schema, r.table_name
        );
      END LOOP;
    END $$;
  `)
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
  // Eliminar esquema completo
  await knex.raw('DROP SCHEMA IF EXISTS retaya CASCADE;')
}
