import { NextResponse } from 'next/server'
import { createPago } from '../../../lib/database'

// POST /api/pagos - Create a new pago
export async function POST(request) {
  try {
    const body = await request.json()
    const { id_orden, monto, metodo_pago, estado = 'pendiente', referencia = '' } = body

    if (!id_orden || !monto || !metodo_pago) {
      return NextResponse.json(
        { error: 'Orden ID, monto, and metodo_pago are required' },
        { status: 400 }
      )
    }

    // Validate monto
    if (monto <= 0) {
      return NextResponse.json(
        { error: 'Monto must be greater than 0' },
        { status: 400 }
      )
    }

    // Valid payment methods
    const validMetodos = ['efectivo', 'tarjeta', 'transferencia', 'paypal', 'nequi', 'daviplata']
    if (!validMetodos.includes(metodo_pago)) {
      return NextResponse.json(
        { error: `Invalid metodo_pago. Must be one of: ${validMetodos.join(', ')}` },
        { status: 400 }
      )
    }

    // Valid estados
    const validEstados = ['pendiente', 'procesando', 'completado', 'fallido', 'reembolsado']
    if (!validEstados.includes(estado)) {
      return NextResponse.json(
        { error: `Invalid estado. Must be one of: ${validEstados.join(', ')}` },
        { status: 400 }
      )
    }

    const pago = await createPago({ 
      id_orden, 
      monto, 
      metodo_pago, 
      estado, 
      referencia 
    })

    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/pagos:', error)
    return NextResponse.json(
      { error: 'Failed to create pago' },
      { status: 500 }
    )
  }
}
