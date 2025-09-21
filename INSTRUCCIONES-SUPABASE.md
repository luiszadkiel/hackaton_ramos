# 🚀 Configuración de Supabase - Instrucciones

## ✅ Archivos Configurados

Tu proyecto ya tiene configurada la conexión a Supabase con la cadena de conexión que especificaste:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.urhugsbsrluchtdwbuii.supabase.co:5432/postgres
```

## 🔧 Pasos Finales

### 1. Reemplazar la Contraseña
En el archivo `.env.local`, reemplaza `[YOUR-PASSWORD]` con tu contraseña real de Supabase:

```bash
# Cambia esto:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.urhugsbsrluchtdwbuii.supabase.co:5432/postgres

# Por esto (ejemplo):
DATABASE_URL=postgresql://postgres:mi_password_123@db.urhugsbsrluchtdwbuii.supabase.co:5432/postgres
```

### 2. Probar la Conexión
Ejecuta el script de prueba para verificar que todo funciona:

```bash
node test-db-connection.js
```

### 3. Usar en tu Aplicación

#### En API Routes (ejemplo):
```javascript
// app/api/usuarios/route.js
import { getAllUsers, createUser } from '../../../lib/database'

export async function GET() {
  const usuarios = await getAllUsers()
  return Response.json(usuarios)
}
```

#### En Server Components:
```javascript
import { getAllOrders } from '../lib/database'

export default async function OrdersPage() {
  const orders = await getAllOrders()
  
  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  )
}
```

## 📋 Archivos Disponibles

- `db.js` - Conexión principal a Supabase
- `lib/database.js` - Funciones helper para CRUD
- `app/api/users/route.js` - API endpoint de usuarios
- `app/api/orders/route.js` - API endpoint de órdenes
- `test-db-connection.js` - Script de prueba

## 🔍 Tipo de Conexión

Estás usando **Direct Connection**, que es ideal para:
- ✅ Aplicaciones con conexiones persistentes
- ✅ Máquinas virtuales o contenedores de larga duración
- ✅ Cada cliente tiene una conexión dedicada a Postgres

## ⚠️ Importante

- Asegúrate de que tu proyecto de Supabase esté activo
- Verifica que la contraseña sea correcta
- El archivo `.env.local` ya está en `.gitignore` por defecto en Next.js

¡Tu integración con Supabase está lista para usar! 🎉
