import { NextResponse } from 'next/server'
import { getAllUsuarios, createUsuario } from '../../../lib/database'

// GET /api/users - Get all usuarios
export async function GET() {
  try {
    const usuarios = await getAllUsuarios()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usuarios' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new usuario
export async function POST(request) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, direccion } = body

    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre and email are required' },
        { status: 400 }
      )
    }

    const usuario = await createUsuario({ nombre, email, telefono, direccion })
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/users:', error)
    return NextResponse.json(
      { error: 'Failed to create usuario' },
      { status: 500 }
    )
  }
}
