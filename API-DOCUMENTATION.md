# 🚀 API Documentation - Sistema de Lavandería

## 📋 Endpoints Disponibles

### 👥 **Usuarios**

#### `GET /api/usuarios`
Obtiene todos los usuarios con paginación y filtros.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `search` (opcional): Buscar por nombre, email o teléfono

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### `POST /api/usuarios`
Crea un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "direccion": "Calle 123 #45-67"
}
```

#### `GET /api/usuarios/[id]`
Obtiene un usuario específico por ID.

#### `PUT /api/usuarios/[id]`
Actualiza un usuario específico.

---

### 📦 **Órdenes**

#### `GET /api/orders`
Obtiene todas las órdenes con filtros avanzados.

**Query Parameters:**
- `page`, `limit`: Paginación
- `estado`: Filtrar por estado
- `usuario_id`: Filtrar por usuario
- `fecha_desde`, `fecha_hasta`: Rango de fechas

**Response:**
```json
{
  "data": [...],
  "pagination": {...},
  "filters": {
    "estado": "pendiente",
    "usuario_id": "1",
    "fecha_desde": "2025-01-01",
    "fecha_hasta": "2025-12-31"
  }
}
```

#### `POST /api/orders`
Crea una nueva orden.

**Body:**
```json
{
  "usuario_id": 1,
  "tipo_servicio": "lavado_completo",
  "direccion_recogida": "Calle 123 #45-67",
  "direccion_entrega": "Calle 456 #78-90",
  "fecha_recogida": "2025-09-22",
  "fecha_entrega": "2025-09-23",
  "total": 25.00,
  "estado": "pendiente",
  "observaciones": "Prendas delicadas"
}
```

#### `GET /api/ordenes/[id]`
Obtiene una orden completa con todos sus detalles.

**Response:**
```json
{
  "id": 1,
  "usuario_id": 1,
  "cliente_nombre": "Juan Pérez",
  "cliente_email": "juan@email.com",
  "tipo_servicio": "lavado_completo",
  "estado": "pendiente",
  "total": 25.00,
  "prendas": [...],
  "extras": [...],
  "historial": [...],
  "pagos": [...]
}
```

#### `PATCH /api/ordenes/[id]`
Actualiza el estado de una orden.

**Body:**
```json
{
  "estado": "confirmada",
  "observaciones": "Orden confirmada por el cliente",
  "usuario_id": 1
}
```

**Estados válidos:**
- `pendiente`, `confirmada`, `en_proceso`, `lista_recogida`
- `en_lavado`, `lista_entrega`, `entregada`, `cancelada`

#### `DELETE /api/ordenes/[id]`
Cancela una orden (soft delete).

---

### 🧺 **Servicios y Extras**

#### `GET /api/servicios`
Obtiene todos los servicios disponibles.

**Query Parameters:**
- `categoria`: Filtrar por categoría
- `activo`: Filtrar por estado activo (default: true)

#### `GET /api/servicios/[id]`
Obtiene un servicio específico.

#### `GET /api/extras`
Obtiene todos los extras disponibles.

---

### 💳 **Pagos**

#### `POST /api/pagos`
Crea un nuevo pago.

**Body:**
```json
{
  "orden_id": 1,
  "monto": 25.00,
  "metodo_pago": "tarjeta",
  "estado": "pendiente",
  "referencia": "TXN123456"
}
```

**Métodos de pago válidos:**
- `efectivo`, `tarjeta`, `transferencia`, `paypal`, `nequi`, `daviplata`

**Estados válidos:**
- `pendiente`, `procesando`, `completado`, `fallido`, `reembolsado`

#### `GET /api/pagos/[id]`
Obtiene todos los pagos de una orden específica.

---

### 📊 **Historial**

#### `POST /api/historial`
Agrega una entrada al historial de estados.

**Body:**
```json
{
  "orden_id": 1,
  "estado": "confirmada",
  "observaciones": "Cliente confirmó la orden",
  "usuario_id": 1
}
```

---

### 🗺️ **Utilidades**

#### `GET /api/cobertura`
Verifica cobertura de servicio por dirección.

**Query Parameters:**
- `direccion`: Dirección a verificar

**Response:**
```json
{
  "disponible": true,
  "cobertura": {
    "zona": "Centro",
    "tiempo_estimado": "30 minutos",
    "costo_adicional": 0
  },
  "direccion": "Calle 123 #45-67"
}
```

#### `GET /api/cupones`
Valida un cupón de descuento.

**Query Parameters:**
- `codigo`: Código del cupón

**Response:**
```json
{
  "valido": true,
  "cupon": {
    "id": 1,
    "codigo": "DESCUENTO10",
    "descuento": 10,
    "tipo": "porcentaje"
  },
  "codigo": "DESCUENTO10"
}
```

#### `GET /api/resenas`
Obtiene reseñas de una orden.

**Query Parameters:**
- `orden_id`: ID de la orden

#### `POST /api/resenas`
Crea una nueva reseña.

**Body:**
```json
{
  "orden_id": 1,
  "usuario_id": 1,
  "calificacion": 5,
  "comentario": "Excelente servicio"
}
```

---

### 📈 **Dashboard**

#### `GET /api/dashboard`
Obtiene estadísticas del dashboard.

**Query Parameters:**
- `periodo`: Días a analizar (default: 30)
- `fecha_desde`, `fecha_hasta`: Rango personalizado

**Response:**
```json
{
  "resumen": {
    "total_ordenes": 150,
    "total_usuarios": 45,
    "total_servicios": 8,
    "periodo_dias": 30
  },
  "ordenes": {
    "por_estado": {
      "pendiente": 5,
      "confirmada": 10,
      "en_proceso": 8,
      "entregada": 120,
      "cancelada": 7
    },
    "ingresos_totales": 3750.00,
    "promedio_orden": 25.00
  },
  "tendencias": {
    "ordenes_por_dia": {...},
    "ingresos_por_dia": {...}
  }
}
```

---

## 🔧 **Códigos de Estado HTTP**

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 📝 **Ejemplos de Uso**

### Crear una orden completa:
```javascript
// 1. Crear usuario
const usuario = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '3001234567',
    direccion: 'Calle 123 #45-67'
  })
})

// 2. Crear orden
const orden = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario_id: usuario.id,
    tipo_servicio: 'lavado_completo',
    direccion_recogida: 'Calle 123 #45-67',
    direccion_entrega: 'Calle 123 #45-67',
    fecha_recogida: '2025-09-22',
    fecha_entrega: '2025-09-23',
    total: 25.00
  })
})

// 3. Crear pago
const pago = await fetch('/api/pagos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orden_id: orden.id,
    monto: 25.00,
    metodo_pago: 'tarjeta',
    estado: 'completado'
  })
})
```

### Obtener estadísticas:
```javascript
const stats = await fetch('/api/dashboard?periodo=7')
const data = await stats.json()
console.log(`Total órdenes esta semana: ${data.resumen.total_ordenes}`)
console.log(`Ingresos: $${data.ordenes.ingresos_totales}`)
```

¡Tu API está lista para usar! 🎉
