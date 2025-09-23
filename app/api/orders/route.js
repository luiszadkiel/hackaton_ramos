import { NextResponse } from 'next/server'
import { getAllOrdenes, createOrden, createOrdenCompleta } from '../../../lib/database'

// GET /api/orders - Get all ordenes with filtering and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const estado = searchParams.get('estado') || ''
    const usuario_id = searchParams.get('usuario_id') || ''
    const fecha_desde = searchParams.get('fecha_desde') || ''
    const fecha_hasta = searchParams.get('fecha_hasta') || ''

    let ordenes = await getAllOrdenes()
    
    // Filter by estado
    if (estado) {
      ordenes = ordenes.filter(orden => orden.estado === estado)
    }
    
    // Filter by usuario_id
    if (usuario_id) {
      ordenes = ordenes.filter(orden => orden.id_usuario == usuario_id)
    }
    
    // Filter by date range
    if (fecha_desde) {
      ordenes = ordenes.filter(orden => new Date(orden.created_at) >= new Date(fecha_desde))
    }
    if (fecha_hasta) {
      ordenes = ordenes.filter(orden => new Date(orden.created_at) <= new Date(fecha_hasta))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrdenes = ordenes.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedOrdenes,
      pagination: {
        page,
        limit,
        total: ordenes.length,
        totalPages: Math.ceil(ordenes.length / limit)
      },
      filters: {
        estado,
        usuario_id,
        fecha_desde,
        fecha_hasta
      }
    })
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ordenes' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new orden with prendas and extras
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      id_usuario, 
      tipo_servicio, 
      direccion_entrega, 
      zona_entrega,
      precio_total, 
      estado = 'pendiente',
      extras_orden = null,
      tiempo_estimado = null,
      prendas = [],
      extras = []
    } = body

    console.log('POST /api/orders - Request body:', body)

    // Validar campos obligatorios
    if (!id_usuario || !tipo_servicio || !direccion_entrega || !zona_entrega || !precio_total) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: id_usuario, tipo_servicio, direccion_entrega, zona_entrega, precio_total' },
        { status: 400 }
      )
    }

    // Validar prendas si existen
    if (prendas && prendas.length > 0) {
      for (const prenda of prendas) {
        if (!prenda.tipo_prenda || !prenda.cantidad || !prenda.tipo_lavado || !prenda.precio_unitario) {
          return NextResponse.json(
            { error: 'Todas las prendas deben tener: tipo_prenda, cantidad, tipo_lavado, precio_unitario' },
            { status: 400 }
          )
        }
      }
    }

    // Validar extras si existen
    if (extras && extras.length > 0) {
      for (const extra of extras) {
        if (!extra.id_extra || !extra.cantidad) {
          return NextResponse.json(
            { error: 'Todos los extras deben tener: id_extra, cantidad' },
            { status: 400 }
          )
        }
      }
    }

    // Crear orden completa con prendas y extras
    const ordenCompleta = await createOrdenCompleta({
      id_usuario,
      tipo_servicio,
      direccion_entrega,
      zona_entrega,
      precio_total,
      estado,
      extras_orden,
      tiempo_estimado,
      prendas,
      extras
    })

    console.log('POST /api/orders - Orden completa creada:', ordenCompleta.id_orden)

    return NextResponse.json({
      message: 'Pedido creado con éxito',
      orden: ordenCompleta
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create orden' },
      { status: 500 }
    )
  }
}
