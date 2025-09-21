import { NextResponse } from 'next/server'
import { getAllOrdenes, createOrden } from '../../../lib/database'

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

// POST /api/orders - Create a new orden
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
      tiempo_estimado = null
    } = body

    if (!id_usuario || !tipo_servicio || !direccion_entrega || !precio_total) {
      return NextResponse.json(
        { error: 'Usuario ID, tipo servicio, direccion entrega, and precio total are required' },
        { status: 400 }
      )
    }

    const orden = await createOrden({ 
      id_usuario, 
      tipo_servicio, 
      direccion_entrega, 
      zona_entrega,
      precio_total, 
      estado,
      extras_orden,
      tiempo_estimado
    })

    // TODO: Add prendas and extras to orden
    // This would require additional database functions

    return NextResponse.json(orden, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return NextResponse.json(
      { error: 'Failed to create orden' },
      { status: 500 }
    )
  }
}
