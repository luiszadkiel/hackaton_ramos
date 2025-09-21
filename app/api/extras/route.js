import { NextResponse } from 'next/server'
import { getAllExtras } from '../../../lib/database'

// GET /api/extras - Get all extras
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') || ''
    const activo = searchParams.get('activo') !== 'false' // Default to true
    
    let extras = await getAllExtras()
    
    // Filter by categoria
    if (categoria) {
      extras = extras.filter(extra => 
        extra.categoria?.toLowerCase() === categoria.toLowerCase()
      )
    }
    
    // Filter by activo status
    if (activo !== null) {
      extras = extras.filter(extra => extra.activo === activo)
    }

    return NextResponse.json({
      data: extras,
      filters: {
        categoria,
        activo
      }
    })
  } catch (error) {
    console.error('Error in GET /api/extras:', error)
    return NextResponse.json(
      { error: 'Failed to fetch extras' },
      { status: 500 }
    )
  }
}
