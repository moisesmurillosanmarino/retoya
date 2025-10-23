#!/usr/bin/env node

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import knex from 'knex'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') })

console.log('🔍 RetaYa MVP - Verificando conexión a base de datos')
console.log('====================================================')

async function checkDatabaseConnection() {
  console.log('📋 Variables de entorno:')
  console.log(`   DB_PROVIDER: ${process.env.DB_PROVIDER || 'postgres'}`)
  console.log(`   PG_HOST: ${process.env.PG_HOST || 'localhost'}`)
  console.log(`   PG_PORT: ${process.env.PG_PORT || '5432'}`)
  console.log(`   PG_DATABASE: ${process.env.PG_DATABASE || 'rbjab'}`)
  console.log(`   PG_USER: ${process.env.PG_USER || 'postgres'}`)
  console.log(`   PG_PASSWORD: ${process.env.PG_PASSWORD ? '***configurado***' : 'NO CONFIGURADO'}`)
  
  const knexConfig = (await import('./src/infra/db/knex/knexfile.js')).default
  console.log('\n📊 Configuración de Knex:')
  console.log(`   Cliente: ${knexConfig.client}`)
  console.log(`   Host: ${knexConfig.connection.host}`)
  console.log(`   Puerto: ${knexConfig.connection.port}`)
  console.log(`   Base de datos: ${knexConfig.connection.database}`)
  console.log(`   Usuario: ${knexConfig.connection.user}`)
  
  const db = knex(knexConfig)
  
  try {
    console.log('\n🔌 Probando conexión...')
    
    // Probar conexión básica
    await db.raw('SELECT 1')
    console.log('✅ Conexión exitosa')
    
    // Verificar base de datos actual
    const currentDb = await db.raw('SELECT current_database()')
    console.log(`📊 Base de datos actual: ${currentDb.rows[0].current_database}`)
    
    // Verificar esquemas disponibles
    const schemas = await db.raw("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')")
    console.log('\n📋 Esquemas disponibles:')
    schemas.rows.forEach(schema => {
      console.log(`   📁 ${schema.schema_name}`)
    })
    
    // Verificar si existe el esquema retaya
    const retayaSchema = await db.raw("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'retaya'")
    console.log(`\n🏗️ Esquema retaya: ${retayaSchema.rows.length > 0 ? '✅ Existe' : '❌ No existe'}`)
    
    if (retayaSchema.rows.length > 0) {
      // Verificar tablas en esquema retaya
      const tables = await db.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'retaya' ORDER BY table_name")
      console.log(`\n📊 Tablas en esquema retaya (${tables.rows.length}):`)
      tables.rows.forEach(table => {
        console.log(`   ✅ ${table.table_name}`)
      })
      
      // Verificar datos en tablas principales
      console.log('\n📈 Datos en tablas principales:')
      
      try {
        const userCount = await db('retaya.users').count('* as count')
        console.log(`   👥 Usuarios: ${userCount[0].count}`)
        
        const roleCount = await db('retaya.roles').count('* as count')
        console.log(`   🎭 Roles: ${roleCount[0].count}`)
        
        const venueCount = await db('retaya.venues').count('* as count')
        console.log(`   🏢 Venues: ${venueCount[0].count}`)
        
        const courtCount = await db('retaya.courts').count('* as count')
        console.log(`   ⚽ Canchas: ${courtCount[0].count}`)
        
        const teamCount = await db('retaya.teams').count('* as count')
        console.log(`   👥 Equipos: ${teamCount[0].count}`)
        
        const couponCount = await db('retaya.coupons').count('* as count')
        console.log(`   🎫 Cupones: ${couponCount[0].count}`)
        
      } catch (error) {
        console.log(`   ❌ Error verificando datos: ${error.message}`)
      }
    }
    
    // Verificar tabla de migraciones
    const migrationTableExists = await db.schema.hasTable('knex_migrations')
    console.log(`\n📝 Tabla knex_migrations: ${migrationTableExists ? '✅ Existe' : '❌ No existe'}`)
    
    if (migrationTableExists) {
      const migrations = await db('knex_migrations').select('*').orderBy('id')
      console.log(`📋 Migraciones registradas: ${migrations.length}`)
      migrations.forEach(migration => {
        console.log(`   ✅ ${migration.name} - Batch ${migration.batch}`)
      })
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error('📋 Stack trace:', error.stack)
  } finally {
    await db.destroy()
  }
}

// Ejecutar verificación
checkDatabaseConnection()
