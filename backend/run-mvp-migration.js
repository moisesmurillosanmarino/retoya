#!/usr/bin/env node

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import knex from 'knex'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') })

console.log('🚀 RetaYa MVP - Ejecutando migración completa')
console.log('==============================================')

async function runMigration() {
  const knexConfig = (await import('./src/infra/db/knex/knexfile.js')).default
  const db = knex(knexConfig)
  
  try {
    console.log('📝 Ejecutando migración: 202410190000_retaya_mvp_schema.js')
    
    // Importar y ejecutar la migración
    const migration = await import('./src/infra/db/knex/migrations/202410190000_retaya_mvp_schema.js')
    await migration.up(db)
    
    console.log('✅ Migración ejecutada exitosamente')
    
    // Verificar el resultado
    console.log('\n🔍 Verificando resultado...')
    
    // Verificar esquema
    const schemaResult = await db.raw("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'retaya'")
    console.log(`📋 Esquema retaya: ${schemaResult.rows.length > 0 ? '✅ Existe' : '❌ No existe'}`)
    
    if (schemaResult.rows.length > 0) {
      // Contar tablas
      const tableCount = await db.raw("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'retaya'")
      console.log(`📊 Tablas creadas: ${tableCount.rows[0].count}`)
      
      // Verificar roles
      const roles = await db('retaya.roles').select('key', 'name')
      console.log(`👥 Roles: ${roles.map(r => r.key).join(', ')}`)
      
      // Listar tablas principales
      const mainTables = await db.raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'retaya' 
        AND table_name IN ('users', 'roles', 'venues', 'courts', 'bookings', 'teams', 'matches')
        ORDER BY table_name
      `)
      console.log('📋 Tablas principales:')
      mainTables.rows.forEach(table => {
        console.log(`   ✅ ${table.table_name}`)
      })
    }
    
    console.log('\n🎉 ¡Migración completada exitosamente!')
    console.log('\n📚 Próximos pasos:')
    console.log('   1. Ejecutar: npm run seed (para datos de ejemplo)')
    console.log('   2. Ejecutar: npm run dev (para iniciar el servidor)')
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message)
    console.error('📋 Stack trace:', error.stack)
    process.exit(1)
  } finally {
    await db.destroy()
  }
}

// Ejecutar migración
runMigration()
