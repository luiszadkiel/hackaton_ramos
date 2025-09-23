import { NextResponse } from 'next/server'
import { getOrdenesByUsuarioNombre } from '../../../../lib/database'

// GET /api/ordenes/buscar - Buscar órdenes por nombre de usuario
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const nombre = searchParams.get('nombre') || ''
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    if (!nombre.trim()) {
      return NextResponse.json(
        { error: 'El parámetro nombre es requerido' },
        { status: 400 }
      )
    }

    console.log('Buscando órdenes para usuario:', nombre)
    
    const ordenes = await getOrdenesByUsuarioNombre(nombre)
    
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
      search: {
        nombre,
        results: ordenes.length
      }
    })
  } catch (error) {
    console.error('Error in GET /api/ordenes/buscar:', error)
    return NextResponse.json(
      { error: 'Failed to search ordenes' },
      { status: 500 }
    )
  }
}
