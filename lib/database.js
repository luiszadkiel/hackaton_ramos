import sql from '../db.js'

// Database functions for your Supabase schema

// Función auxiliar para generar IDs únicos
function generateUniqueId(prefix = 'LAV') {
  // Generar número de 6 dígitos como en db.js para mantener consistencia
  const number = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${number}`
}

// Función auxiliar para validar y mapear tipo_servicio
function validateAndMapTipoServicio(tipoServicio) {
  if (!tipoServicio || typeof tipoServicio !== 'string') {
    throw new Error('tipo_servicio es requerido y debe ser una cadena')
  }

  // Valores válidos en la base de datos (probando valores más básicos)
  const validTipos = [
    'regular',
    'delicado', 
    'seco',
    'industrial',
    'express',
    'planchado'
  ]

  // Mapeo de valores comunes a valores válidos de la DB
  const tipoMap = {
    'lavado regular': 'regular',
    'lavado delicado': 'delicado',
    'lavado en seco': 'seco',
    'lavado industrial': 'industrial',
    'lavado express': 'express',
    'planchado': 'regular',  // Mapear planchado a regular
    'planchar': 'regular',  // Mapear planchar a regular
    'solo planchar': 'regular',  // Mapear Solo Planchar a regular
    'solo_planchar': 'regular',  // Mapear solo_planchar a regular
    'regular': 'regular',
    'delicado': 'delicado',
    'seco': 'seco',
    'industrial': 'industrial',
    'express': 'express'
  }

  // Normalizar el input (minúsculas, sin espacios extra)
  const normalizedInput = tipoServicio.toLowerCase().trim()
  
  // Buscar en el mapeo primero
  const mappedValue = tipoMap[normalizedInput]
  if (mappedValue) {
    return mappedValue
  }

  // Si no está en el mapeo, verificar si es un valor válido directo
  const isValidDirect = validTipos.some(validTipo => 
    validTipo.toLowerCase() === tipoServicio.toLowerCase()
  )
  
  if (isValidDirect) {
    return tipoServicio.toLowerCase() // Normalizar a minúsculas
  }

  // Si no se encuentra en ningún lado, lanzar error
  throw new Error(`tipo_servicio inválido: "${tipoServicio}". Valores válidos: ${validTipos.join(', ')}`)
}

// Función auxiliar para validar y mapear zona_entrega
function validateAndMapZonaEntrega(zonaEntrega) {
  if (!zonaEntrega || typeof zonaEntrega !== 'string') {
    throw new Error('zona_entrega es requerido y debe ser una cadena')
  }

  // Valores válidos en la base de datos (basados en el chat y db.js)
  const validZonas = [
    'centro',
    'norte',
    'sur',
    'periferica'
  ]

  // Mapeo de valores comunes a valores válidos de la DB
  const zonaMap = {
    'centro': 'centro',
    'norte': 'norte',
    'sur': 'sur',
    'periferica': 'periferica',
    'periférica': 'periferica',  // Mapear con tilde a sin tilde
    'periferico': 'periferica',   // Mapear masculino a femenino
    'periférico': 'periferica'    // Mapear masculino con tilde a femenino sin tilde
  }

  // Normalizar el input (minúsculas, sin espacios extra)
  const normalizedInput = zonaEntrega.toLowerCase().trim()
  
  // Buscar en el mapeo primero
  const mappedValue = zonaMap[normalizedInput]
  if (mappedValue) {
    return mappedValue
  }

  // Si no está en el mapeo, verificar si es un valor válido directo
  const isValidDirect = validZonas.some(validZona => 
    validZona.toLowerCase() === zonaEntrega.toLowerCase()
  )
  
  if (isValidDirect) {
    return zonaEntrega.toLowerCase() // Normalizar a minúsculas
  }

  // Si no se encuentra en ningún lado, lanzar error
  throw new Error(`zona_entrega inválida: "${zonaEntrega}". Valores válidos: ${validZonas.join(', ')}`)
}

// ===== USUARIOS =====
export async function getAllUsuarios() {
  try {
    const usuarios = await sql`SELECT * FROM usuarios ORDER BY created_at DESC`
    return usuarios
  } catch (error) {
    console.error('Error fetching usuarios:', error)
    throw error
  }
}

export async function getUsuarioById(id) {
  try {
    const [usuario] = await sql`SELECT * FROM usuarios WHERE id_usuario = ${id}`
    return usuario
  } catch (error) {
    console.error('Error fetching usuario:', error)
    throw error
  }
}

export async function getUsuarioByEmail(email) {
  try {
    const [usuario] = await sql`SELECT * FROM usuarios WHERE email = ${email}`
    return usuario
  } catch (error) {
    console.error('Error fetching usuario by email:', error)
    throw error
  }
}

export async function createUsuario(usuarioData) {
  try {
    const { nombre, email, telefono, direccion, rol = 'cliente' } = usuarioData
    console.log('Creating usuario with data:', usuarioData)
    
    // Verificar si el email ya existe
    const existingUsuario = await getUsuarioByEmail(email)
    
    if (existingUsuario) {
      console.log('Usuario with email already exists:', email)
      console.log('Returning existing usuario:', existingUsuario)
      return existingUsuario
    }
    
    const [usuario] = await sql`
      INSERT INTO usuarios (id_usuario, rol, nombre, email, telefono, direccion) 
      VALUES (gen_random_uuid(), ${rol}, ${nombre}, ${email}, ${telefono}, ${direccion}) 
      RETURNING *
    `
    
    console.log('Created usuario:', usuario)
    return usuario
  } catch (error) {
    console.error('Error creating usuario:', error)
    
    // Manejar específicamente el error de email duplicado
    if (error.code === '23505' && error.constraint === 'usuarios_email_key') {
      console.log('Email already exists, fetching existing usuario')
      try {
        const usuario = await getUsuarioByEmail(usuarioData.email)
        console.log('Returning existing usuario:', usuario)
        return usuario
      } catch (fetchError) {
        console.error('Error fetching existing usuario:', fetchError)
        throw new Error('Email ya existe y no se pudo recuperar el usuario existente')
      }
    }
    
    throw error
  }
}

export async function updateUsuario(id, usuarioData) {
  try {
    const { nombre, email, telefono, direccion, rol } = usuarioData
    const [usuario] = await sql`
      UPDATE usuarios 
      SET nombre = ${nombre}, email = ${email}, telefono = ${telefono}, direccion = ${direccion}, rol = ${rol}, updated_at = NOW()
      WHERE id_usuario = ${id} 
      RETURNING *
    `
    return usuario
  } catch (error) {
    console.error('Error updating usuario:', error)
    throw error
  }
}

// ===== ORDENES =====
export async function getAllOrdenes() {
  try {
    const ordenes = await sql`
      SELECT o.*, u.nombre as cliente_nombre, u.email as cliente_email 
      FROM ordenes o 
      LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario 
      ORDER BY o.created_at DESC
    `
    return ordenes
  } catch (error) {
    console.error('Error fetching ordenes:', error)
    throw error
  }
}

export async function getOrdenById(id) {
  try {
    const [orden] = await sql`
      SELECT o.*, u.nombre as cliente_nombre, u.email as cliente_email, u.telefono as cliente_telefono
      FROM ordenes o 
      LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario 
      WHERE o.id_orden = ${id}
    `
    return orden
  } catch (error) {
    console.error('Error fetching orden:', error)
    throw error
  }
}

export async function createOrden(ordenData) {
  try {
    const { id_usuario, tipo_servicio, direccion_entrega, zona_entrega, precio_total, estado = 'pendiente', extras_orden = null, tiempo_estimado = null } = ordenData
    
    // Validar y mapear tipo_servicio
    const tipoServicioValidado = validateAndMapTipoServicio(tipo_servicio)
    
    // Validar y mapear zona_entrega
    const zonaEntregaValidada = validateAndMapZonaEntrega(zona_entrega)
    
    // Generar ID único para la orden
    const id_orden = generateUniqueId('LAV')
    
    // Convertir tiempo_estimado al formato PostgreSQL interval si es necesario
    let tiempoEstimadoFormatted = tiempo_estimado
    if (tiempo_estimado && typeof tiempo_estimado === 'string') {
      // Convertir formato "2 horas 30 min" a formato PostgreSQL "2 hours 30 minutes"
      tiempoEstimadoFormatted = tiempo_estimado
        .replace(/horas?/gi, 'hours')
        .replace(/minutos?/gi, 'minutes')
        .replace(/\bmin\b/gi, 'minutes')  // Solo reemplazar "min" como palabra completa
        .replace(/segundos?/gi, 'seconds')
        .replace(/\bseg\b/gi, 'seconds')  // Solo reemplazar "seg" como palabra completa
    }
    
    const [orden] = await sql`
      INSERT INTO ordenes (id_orden, id_usuario, tipo_servicio, direccion_entrega, zona_entrega, precio_total, estado, extras_orden, tiempo_estimado) 
      VALUES (${id_orden}, ${id_usuario}, ${tipoServicioValidado}, ${direccion_entrega}, ${zonaEntregaValidada}, ${precio_total}, ${estado}, ${JSON.stringify(extras_orden)}, ${tiempoEstimadoFormatted}) 
      RETURNING *
    `
    return orden
  } catch (error) {
    console.error('Error creating orden:', error)
    throw error
  }
}

export async function updateOrdenEstado(id, estado) {
  try {
    const [orden] = await sql`
      UPDATE ordenes 
      SET estado = ${estado}, updated_at = NOW() 
      WHERE id_orden = ${id} 
      RETURNING *
    `
    return orden
  } catch (error) {
    console.error('Error updating orden estado:', error)
    throw error
  }
}

// ===== SERVICIOS =====
export async function getAllServicios() {
  try {
    const servicios = await sql`SELECT * FROM servicios ORDER BY nombre`
    return servicios
  } catch (error) {
    console.error('Error fetching servicios:', error)
    throw error
  }
}

export async function getServicioById(id) {
  try {
    const [servicio] = await sql`SELECT * FROM servicios WHERE id_servicio = ${id}`
    return servicio
  } catch (error) {
    console.error('Error fetching servicio:', error)
    throw error
  }
}

// ===== EXTRAS =====
export async function getAllExtras() {
  try {
    const extras = await sql`SELECT * FROM extras ORDER BY nombre`
    return extras
  } catch (error) {
    console.error('Error fetching extras:', error)
    throw error
  }
}

// ===== ORDEN PRENDAS =====
export async function getPrendasByOrdenId(ordenId) {
  try {
    const prendas = await sql`
      SELECT op.*, s.nombre as servicio_nombre, s.precio_base as servicio_precio
      FROM orden_prendas op
      LEFT JOIN servicios s ON op.id_servicio = s.id_servicio
      WHERE op.id_orden = ${ordenId}
    `
    return prendas
  } catch (error) {
    console.error('Error fetching prendas:', error)
    throw error
  }
}

export async function addPrendaToOrden(ordenId, prendaData) {
  try {
    const { id_servicio, cantidad, observaciones } = prendaData
    const [prenda] = await sql`
      INSERT INTO orden_prendas (id_orden, id_servicio, cantidad, observaciones) 
      VALUES (${ordenId}, ${id_servicio}, ${cantidad}, ${observaciones}) 
      RETURNING *
    `
    return prenda
  } catch (error) {
    console.error('Error adding prenda:', error)
    throw error
  }
}

// ===== ORDEN EXTRAS =====
export async function getExtrasByOrdenId(ordenId) {
  try {
    const extras = await sql`
      SELECT oe.*, e.nombre as extra_nombre, e.precio as extra_precio
      FROM orden_extras oe
      LEFT JOIN extras e ON oe.id_extra = e.id_extra
      WHERE oe.id_orden = ${ordenId}
    `
    return extras
  } catch (error) {
    console.error('Error fetching orden extras:', error)
    throw error
  }
}

// ===== PAGOS =====
export async function getPagosByOrdenId(ordenId) {
  try {
    const pagos = await sql`SELECT * FROM pagos WHERE id_orden = ${ordenId} ORDER BY created_at DESC`
    return pagos
  } catch (error) {
    console.error('Error fetching pagos:', error)
    throw error
  }
}

export async function createPago(pagoData) {
  try {
    const { id_orden, monto, metodo_pago, estado, referencia } = pagoData
    const [pago] = await sql`
      INSERT INTO pagos (id_orden, monto, metodo_pago, estado, referencia) 
      VALUES (${id_orden}, ${monto}, ${metodo_pago}, ${estado}, ${referencia}) 
      RETURNING *
    `
    return pago
  } catch (error) {
    console.error('Error creating pago:', error)
    throw error
  }
}

// ===== HISTORIAL DE ESTADOS =====
export async function getHistorialByOrdenId(ordenId) {
  try {
    const historial = await sql`
      SELECT ohe.*, u.nombre as usuario_nombre
      FROM orden_historial_estado ohe
      LEFT JOIN usuarios u ON ohe.id_usuario = u.id_usuario
      WHERE ohe.id_orden = ${ordenId}
      ORDER BY ohe.created_at DESC
    `
    return historial
  } catch (error) {
    console.error('Error fetching historial:', error)
    throw error
  }
}

export async function addEstadoToHistorial(ordenId, estadoData) {
  try {
    const { estado, observaciones, id_usuario } = estadoData
    const [historial] = await sql`
      INSERT INTO orden_historial_estado (id_orden, estado, observaciones, id_usuario) 
      VALUES (${ordenId}, ${estado}, ${observaciones}, ${id_usuario}) 
      RETURNING *
    `
    return historial
  } catch (error) {
    console.error('Error adding estado to historial:', error)
    throw error
  }
}

// ===== COBERTURA =====
export async function getCoberturaByDireccion(direccion) {
  try {
    const cobertura = await sql`
      SELECT * FROM cobertura 
      WHERE ${direccion} ILIKE '%' || zona || '%'
      ORDER BY prioridad DESC
      LIMIT 1
    `
    return cobertura[0] || null
  } catch (error) {
    console.error('Error fetching cobertura:', error)
    throw error
  }
}

// ===== CUPONES =====
export async function getCuponByCodigo(codigo) {
  try {
    const [cupon] = await sql`
      SELECT * FROM cupones 
      WHERE codigo = ${codigo} 
      AND activo = true 
      AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
    `
    return cupon
  } catch (error) {
    console.error('Error fetching cupon:', error)
    throw error
  }
}

// ===== RESEÑAS =====
export async function getResenasByOrdenId(ordenId) {
  try {
    const resenas = await sql`
      SELECT r.*, u.nombre as cliente_nombre
      FROM resenas r
      LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_orden = ${ordenId}
      ORDER BY r.created_at DESC
    `
    return resenas
  } catch (error) {
    console.error('Error fetching resenas:', error)
    throw error
  }
}

export async function createResena(resenaData) {
  try {
    const { id_orden, id_usuario, calificacion, comentario } = resenaData
    const [resena] = await sql`
      INSERT INTO resenas (id_orden, id_usuario, calificacion, comentario) 
      VALUES (${id_orden}, ${id_usuario}, ${calificacion}, ${comentario}) 
      RETURNING *
    `
    return resena
  } catch (error) {
    console.error('Error creating resena:', error)
    throw error
  }
}
