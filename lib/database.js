import sql from '../db.js'

// Database functions for your Supabase schema

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

export async function createUsuario(usuarioData) {
  try {
    const { nombre, email, telefono, direccion, rol = 'cliente' } = usuarioData
    const [usuario] = await sql`
      INSERT INTO usuarios (nombre, email, telefono, direccion, rol) 
      VALUES (${nombre}, ${email}, ${telefono}, ${direccion}, ${rol}) 
      RETURNING *
    `
    return usuario
  } catch (error) {
    console.error('Error creating usuario:', error)
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
    const [orden] = await sql`
      INSERT INTO ordenes (id_usuario, tipo_servicio, direccion_entrega, zona_entrega, precio_total, estado, extras_orden, tiempo_estimado) 
      VALUES (${id_usuario}, ${tipo_servicio}, ${direccion_entrega}, ${zona_entrega}, ${precio_total}, ${estado}, ${JSON.stringify(extras_orden)}, ${tiempo_estimado}) 
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
