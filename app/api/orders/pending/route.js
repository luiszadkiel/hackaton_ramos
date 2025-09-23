import { NextResponse } from 'next/server'
import { getAllOrdenes } from '../../../../lib/database'

// GET /api/orders/pending - Obtener pedidos pendientes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    console.log('GET /api/orders/pending - Request params:', { userId, page, limit })

    // Obtener todas las órdenes
    let ordenes = await getAllOrdenes()
    
    // Filtrar solo las pendientes
    ordenes = ordenes.filter(orden => orden.estado === 'pendiente')
    
    // Filtrar por usuario si se especifica
    if (userId) {
      ordenes = ordenes.filter(orden => orden.id_usuario === userId)
    }

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrdenes = ordenes.slice(startIndex, endIndex)

    console.log(`GET /api/orders/pending - Found ${ordenes.length} pending orders, returning ${paginatedOrdenes.length}`)

    return NextResponse.json({
      data: paginatedOrdenes,
      pagination: {
        page,
        limit,
        total: ordenes.length,
        totalPages: Math.ceil(ordenes.length / limit)
      },
      filters: {
        estado: 'pendiente',
        userId: userId || null
      }
    })
  } catch (error) {
    console.error('Error in GET /api/orders/pending:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending orders' },
      { status: 500 }
    )
  }
}
