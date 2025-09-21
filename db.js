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
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}
const sql = postgres(connectionString)

export default sql
