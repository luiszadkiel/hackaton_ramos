import { NextResponse } from 'next/server'
import { addEstadoToHistorial } from '../../../lib/database'

// POST /api/historial - Add estado to historial
export async function POST(request) {
  try {
    const body = await request.json()
    const { id_orden, estado, observaciones = '', id_usuario = null } = body

    if (!id_orden || !estado) {
      return NextResponse.json(
        { error: 'Orden ID and estado are required' },
        { status: 400 }
      )
    }

    // Valid estados
    const validEstados = ['pendiente', 'confirmada', 'en_proceso', 'lista_recogida', 'en_lavado', 'lista_entrega', 'entregada', 'cancelada']
    if (!validEstados.includes(estado)) {
      return NextResponse.json(
        { error: `Invalid estado. Must be one of: ${validEstados.join(', ')}` },
        { status: 400 }
      )
    }

    const historial = await addEstadoToHistorial(id_orden, {
      estado,
      observaciones,
      id_usuario
    })

    return NextResponse.json(historial, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/historial:', error)
    return NextResponse.json(
      { error: 'Failed to add historial entry' },
      { status: 500 }
    )
  }
}
