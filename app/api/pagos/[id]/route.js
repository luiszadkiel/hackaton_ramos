import { NextResponse } from 'next/server'
import { getPagosByOrdenId } from '../../../../lib/database'

// GET /api/pagos/[id] - Get pagos by orden ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const pagos = await getPagosByOrdenId(id)
    
    return NextResponse.json({
      orden_id: id,
      pagos,
      total_pagos: pagos.length,
      monto_total: pagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0)
    })
  } catch (error) {
    console.error('Error in GET /api/pagos/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pagos' },
      { status: 500 }
    )
  }
}
