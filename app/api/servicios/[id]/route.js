import { NextResponse } from 'next/server'
import { getServicioById } from '../../../../lib/database'

// GET /api/servicios/[id] - Get servicio by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const servicio = await getServicioById(id)
    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(servicio)
  } catch (error) {
    console.error('Error in GET /api/servicios/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch servicio' },
      { status: 500 }
    )
  }
}
