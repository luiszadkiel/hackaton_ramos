import { NextResponse } from 'next/server'
import { getAllOrdenes } from '../../../../lib/database'

// GET /api/orders/by-status - Obtener pedidos por estado
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    if (!estado) {
      return NextResponse.json(
        { error: 'El parámetro estado es requerido' },
        { status: 400 }
      )
    }

    // Validar estado
    const estadosValidos = ['pendiente', 'en_proceso', 'listo', 'entregado', 'cancelado']
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('GET /api/orders/by-status - Request params:', { estado, userId, page, limit })

    // Obtener todas las órdenes
    let ordenes = await getAllOrdenes()
    
    // Filtrar por estado
    ordenes = ordenes.filter(orden => orden.estado === estado)
    
    // Filtrar por usuario si se especifica
    if (userId) {
      ordenes = ordenes.filter(orden => orden.id_usuario === userId)
    }

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrdenes = ordenes.slice(startIndex, endIndex)

    console.log(`GET /api/orders/by-status - Found ${ordenes.length} orders with estado '${estado}', returning ${paginatedOrdenes.length}`)

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
        userId: userId || null
      }
    })
  } catch (error) {
    console.error('Error in GET /api/orders/by-status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders by status' },
      { status: 500 }
    )
  }
}
