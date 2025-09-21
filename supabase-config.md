# Supabase Database Configuration

## Environment Variables Setup

Create a `.env.local` file in your project root with one of the following connection strings:

### 1. Direct Connection (Recommended for persistent connections)
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.urhugsbsrluchtdwbuii.supabase.co:5432/postgres
```

**Use when:**
- Applications with persistent, long-lived connections
- Running on virtual machines or long-standing containers
- Each client has a dedicated connection to Postgres
- Not IPv4 compatible (use Session Pooler if on IPv4 network)

### 2. Transaction Pooler (Recommended for serverless)
```
DATABASE_URL=postgresql://postgres.urhugsbsrluchtdwbuii:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres
```

**Use when:**
- Stateless applications like serverless functions
- Each interaction with Postgres is brief and isolated
- IPv4 compatible
- Does not support PREPARE statements

### 3. Session Pooler (IPv4 alternative)
```
DATABASE_URL=postgresql://postgres.urhugsbsrluchtdwbuii:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Use when:**
- IPv4 compatible
- Alternative to Direct Connection when connecting via IPv4 network
- Only use on IPv4 network

## Instructions

1. Copy one of the connection strings above
2. Replace `[YOUR-PASSWORD]` with your actual Supabase database password
3. Create a `.env.local` file in your project root
4. Add the connection string to the file
5. The `db.js` file will automatically use this environment variable

## Usage Example

```javascript
import sql from './db.js'

// Example query
const users = await sql`SELECT * FROM users`
console.log(users)
```
