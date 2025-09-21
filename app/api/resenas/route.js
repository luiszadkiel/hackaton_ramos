import { NextResponse } from 'next/server'
import { createResena, getResenasByOrdenId } from '../../../lib/database'

// GET /api/resenas - Get resenas by orden ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id_orden = searchParams.get('id_orden')

    if (!id_orden) {
      return NextResponse.json(
        { error: 'Orden ID parameter is required' },
        { status: 400 }
      )
    }

    const resenas = await getResenasByOrdenId(id_orden)
    
    return NextResponse.json({
      id_orden,
      resenas,
      total_resenas: resenas.length,
      promedio_calificacion: resenas.length > 0 
        ? resenas.reduce((sum, resena) => sum + resena.calificacion, 0) / resenas.length 
        : 0
    })
  } catch (error) {
    console.error('Error in GET /api/resenas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resenas' },
      { status: 500 }
    )
  }
}

// POST /api/resenas - Create a new resena
export async function POST(request) {
  try {
    const body = await request.json()
    const { id_orden, id_usuario, calificacion, comentario = '' } = body

    if (!id_orden || !id_usuario || !calificacion) {
      return NextResponse.json(
        { error: 'Orden ID, usuario ID, and calificacion are required' },
        { status: 400 }
      )
    }

    // Validate calificacion (1-5)
    if (calificacion < 1 || calificacion > 5) {
      return NextResponse.json(
        { error: 'Calificacion must be between 1 and 5' },
        { status: 400 }
      )
    }

    const resena = await createResena({
      id_orden,
      id_usuario,
      calificacion,
      comentario
    })

    return NextResponse.json(resena, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/resenas:', error)
    return NextResponse.json(
      { error: 'Failed to create resena' },
      { status: 500 }
    )
  }
}
