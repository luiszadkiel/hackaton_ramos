import postgres from 'postgres'

// Configuración de Supabase
const DATABASE_URL = process.env.DATABASE_URL;

// Validar URL de conexión
if (!DATABASE_URL || DATABASE_URL.includes('[TU_CONTRASEÑA_REAL]')) {
  throw new Error('❌ ERROR: Debes configurar la contraseña real de Supabase en db.js')
}

// Crear conexión a Supabase
let sql

try {
  sql = postgres(DATABASE_URL)
  console.log('✅ Conectado a Supabase PostgreSQL')
} catch (error) {
  console.error('❌ Error conectando a Supabase:', error.message)
  throw error
}

export default sql
