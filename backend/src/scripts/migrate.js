import { Umzug } from 'umzug'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const provider = process.env.DB_PROVIDER || 'postgres'

console.log(`🔍 Iniciando migraciones con proveedor: ${provider}`)

async function getContext() {
  if (provider === 'mongo') {
    const { MongoClient } = await import('mongodb')
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
    const db = client.db(process.env.MONGO_DB)
    return { db, client }
  } else {
    const knexModule = await import('knex')
    const config = (await import('../infra/db/knex/knexfile.js')).default
    const knex = knexModule.default(config)
    return { knex }
  }
}

function createUmzug(ctx) {
  if (provider === 'mongo') {
    const migrationsPath = resolve(__dirname, '../infra/db/mongo/migrations')
    return new Umzug({
      context: { db: ctx.db },
      migrations: { glob: migrationsPath + '/*.js' },
      storage: {
        async executed() {
          const result = await ctx.db.collection('umzug_migrations').find({}).toArray()
          return result.map(row => row.name)
        },
        async logMigration(migration) {
          await ctx.db.collection('umzug_migrations').insertOne({
            name: migration.name,
            executed_at: new Date()
          })
          console.log(`✅ Migración MongoDB ejecutada: ${migration.name}`)
        },
        async unlogMigration(migration) {
          await ctx.db.collection('umzug_migrations').deleteOne({ name: migration.name })
          console.log(`✅ Migración MongoDB revertida: ${migration.name}`)
        }
      },
      logger: console
    })
  } else {
    const migrationsPath = resolve(__dirname, '../infra/db/knex/migrations')
    return new Umzug({
      context: { knex: ctx.knex },
      migrations: {
        glob: migrationsPath + '/*.js',
        resolve: ({ name, path, context }) => ({
          name,
          up: async () => {
            console.log(`📝 Ejecutando migración SQL: ${name}`)
            return (await import(path)).up(context.knex)
          },
          down: async () => {
            console.log(`📝 Revirtiendo migración SQL: ${name}`)
            return (await import(path)).down(context.knex)
          }
        })
      },
      storage: {
        async executed() {
          try {
            const result = await ctx.knex('knex_migrations').select('name')
            return result.map(row => row.name)
          } catch (error) {
            // Si la tabla no existe, crear migraciones vacías
            console.log('📋 Tabla knex_migrations no existe, creándola...')
            await ctx.knex.schema.createTable('knex_migrations', (table) => {
              table.increments('id').primary()
              table.string('name').notNullable()
              table.integer('batch').notNullable()
              table.timestamp('migration_time').defaultTo(ctx.knex.fn.now())
            })
            return []
          }
        },
        async logMigration(migration) {
          await ctx.knex('knex_migrations').insert({
            name: migration.name,
            batch: 1,
            migration_time: new Date()
          })
          console.log(`✅ Migración SQL ejecutada: ${migration.name}`)
        },
        async unlogMigration(migration) {
          await ctx.knex('knex_migrations').where('name', migration.name).del()
          console.log(`✅ Migración SQL revertida: ${migration.name}`)
        }
      },
      logger: console
    })
  }
}

const action = process.argv[2] || 'up'
let ctx = null

try {
  console.log(`📋 Acción solicitada: ${action}`)
  ctx = await getContext()
  const umzug = createUmzug(ctx)

  // Verificar migraciones pendientes
  const pending = await umzug.pending()
  const executed = await umzug.executed()
  
  console.log(`📊 Estado actual:`)
  console.log(`   - Migraciones ejecutadas: ${executed.length}`)
  console.log(`   - Migraciones pendientes: ${pending.length}`)

  if (action === 'down') {
    if (executed.length === 0) {
      console.log('⚠️ No hay migraciones para revertir')
    } else {
      console.log('📝 Revirtiendo última migración...')
      await umzug.down()
      console.log('✅ Migración revertida correctamente')
    }
  } else {
    if (pending.length === 0) {
      console.log('✅ No hay migraciones pendientes')
    } else {
      console.log('📝 Ejecutando migraciones pendientes...')
      await umzug.up()
      console.log('✅ Todas las migraciones ejecutadas correctamente')
    }
  }

  // Mostrar estado final
  const finalExecuted = await umzug.executed()
  console.log(`📊 Estado final: ${finalExecuted.length} migraciones ejecutadas`)

} catch (error) {
  console.error('❌ Error durante las migraciones:', error.message)
  console.error('📋 Stack trace:', error.stack)
  process.exit(1)
} finally {
  // Cerrar conexiones
  if (ctx?.client) {
    await ctx.client.close()
    console.log('🔌 Conexión MongoDB cerrada')
  }
  if (ctx?.knex) {
    await ctx.knex.destroy()
    console.log('🔌 Conexión SQL cerrada')
  }
}
