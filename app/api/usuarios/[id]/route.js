import { NextResponse } from 'next/server'
import { getUsuarioById, updateUsuario } from '../../../../lib/database'

// GET /api/usuarios/[id] - Get usuario by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const usuario = await getUsuarioById(id)
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error in GET /api/usuarios/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usuario' },
      { status: 500 }
    )
  }
}

// PUT /api/usuarios/[id] - Update usuario
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { nombre, email, telefono, direccion } = body

    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const usuario = await updateUsuario(id, { nombre, email, telefono, direccion })
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error in PUT /api/usuarios/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update usuario' },
      { status: 500 }
    )
  }
}
