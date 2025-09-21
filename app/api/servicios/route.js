import { NextResponse } from 'next/server'
import { getAllServicios, getServicioById } from '../../../lib/database'

// GET /api/servicios - Get all servicios with filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') || ''
    const activo = searchParams.get('activo') !== 'false' // Default to true
    
    let servicios = await getAllServicios()
    
    // Filter by categoria
    if (categoria) {
      servicios = servicios.filter(servicio => 
        servicio.categoria?.toLowerCase() === categoria.toLowerCase()
      )
    }
    
    // Filter by activo status
    if (activo !== null) {
      servicios = servicios.filter(servicio => servicio.activo === activo)
    }

    return NextResponse.json({
      data: servicios,
      filters: {
        categoria,
        activo
      }
    })
  } catch (error) {
    console.error('Error in GET /api/servicios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch servicios' },
      { status: 500 }
    )
  }
}
