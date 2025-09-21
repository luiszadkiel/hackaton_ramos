import { NextResponse } from 'next/server'
import { getCoberturaByDireccion } from '../../../lib/database'

// GET /api/cobertura - Check cobertura by direccion
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const direccion = searchParams.get('direccion')

    if (!direccion) {
      return NextResponse.json(
        { error: 'Direccion parameter is required' },
        { status: 400 }
      )
    }

    const cobertura = await getCoberturaByDireccion(direccion)
    
    if (!cobertura) {
      return NextResponse.json({
        disponible: false,
        mensaje: 'No hay cobertura en esta dirección',
        direccion
      })
    }

    return NextResponse.json({
      disponible: true,
      cobertura,
      direccion
    })
  } catch (error) {
    console.error('Error in GET /api/cobertura:', error)
    return NextResponse.json(
      { error: 'Failed to check cobertura' },
      { status: 500 }
    )
  }
}
