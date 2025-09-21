import { NextResponse } from 'next/server'
import { getCuponByCodigo } from '../../../lib/database'

// GET /api/cupones - Validate cupon by codigo
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const codigo = searchParams.get('codigo')

    if (!codigo) {
      return NextResponse.json(
        { error: 'Codigo parameter is required' },
        { status: 400 }
      )
    }

    const cupon = await getCuponByCodigo(codigo)
    
    if (!cupon) {
      return NextResponse.json({
        valido: false,
        mensaje: 'Cupón no válido o expirado',
        codigo
      })
    }

    return NextResponse.json({
      valido: true,
      cupon,
      codigo
    })
  } catch (error) {
    console.error('Error in GET /api/cupones:', error)
    return NextResponse.json(
      { error: 'Failed to validate cupon' },
      { status: 500 }
    )
  }
}
