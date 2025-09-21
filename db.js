import postgres from 'postgres'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
try {
  const envPath = join(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=')
      process.env[key.trim()] = value.trim()
    }
  })
} catch (error) {
  console.warn('Could not load .env.local file:', error.message)
}

const connectionString = process.env.DATABASE_URL

// For development, use a mock database if no connection string is provided
let sql

if (!connectionString) {
  console.warn('DATABASE_URL not set, using mock database for development')
  
  // Mock database implementation
  const mockData = {
    usuarios: [],
    ordenes: [],
    servicios: [],
    pagos: []
  }

  // Helper function to generate UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Helper function to generate orden ID
  const generateOrdenId = () => {
    const number = Math.floor(Math.random() * 900000) + 100000
    return `LAV-${number}`
  }
  
  sql = (query, ...params) => {
    return new Promise((resolve) => {
      console.log('Mock SQL Query:', query)
      console.log('Mock SQL Params:', params)
      
      // Simple mock implementation
      if (query.includes('INSERT INTO usuarios')) {
        const newId = generateUUID()
        // Extract data from the query parameters - the order should match the INSERT statement
        const usuario = {
          id_usuario: newId,
          rol: params[0] || 'cliente',
          nombre: params[1] || 'Mock User',
          email: params[2] || 'mock@example.com',
          telefono: params[3] || '',
          direccion: params[4] || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockData.usuarios.push(usuario)
        console.log('Created usuario:', usuario)
        resolve([usuario])
      } else if (query.includes('SELECT * FROM usuarios')) {
        resolve(mockData.usuarios)
      } else if (query.includes('INSERT INTO ordenes')) {
        const newId = generateOrdenId()
        const orden = {
          id_orden: newId,
          id_usuario: params[1] || generateUUID(),
          id_repartidor: null,
          fecha_creacion: new Date().toISOString(),
          estado: params[6] || 'pendiente',
          tipo_servicio: params[2] || 'regular',
          extras_orden: params[7] || null,
          precio_total: params[5] || 0,
          tiempo_estimado: params[8] || null,
          direccion_entrega: params[3] || 'Mock Address',
          zona_entrega: params[4] || 'centro',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockData.ordenes.push(orden)
        console.log('Created orden:', orden)
        resolve([orden])
      } else if (query.includes('SELECT * FROM ordenes')) {
        resolve(mockData.ordenes)
      } else if (query.includes('gen_random_uuid()')) {
        // Handle gen_random_uuid() function call
        resolve([generateUUID()])
      } else {
        resolve([])
      }
    })
  }
} else {
  sql = postgres(connectionString)
}

export default sql
