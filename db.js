import postgres from 'postgres'

// Configuración de Supabase
const DATABASE_URL = process.env.DATABASE_URL;


console.log("variable de entrono", DATABASE_URL);

// Validar URL de conexión


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
