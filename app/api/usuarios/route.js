import { NextResponse } from 'next/server'
import { getAllUsuarios, createUsuario } from '../../../lib/database'

// GET /api/usuarios - Get all usuarios
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''

    let usuarios = await getAllUsuarios()
    
    // Filter by search term if provided
    if (search) {
      usuarios = usuarios.filter(usuario => 
        usuario.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(search.toLowerCase()) ||
        usuario.telefono?.includes(search)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsuarios = usuarios.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedUsuarios,
      pagination: {
        page,
        limit,
        total: usuarios.length,
        totalPages: Math.ceil(usuarios.length / limit)
      }
    })
  } catch (error) {
    console.error('Error in GET /api/usuarios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usuarios' },
      { status: 500 }
    )
  }
}

// POST /api/usuarios - Create a new usuario
export async function POST(request) {
  try {
    console.log('POST /api/usuarios - Starting request')
    const body = await request.json()
    console.log('POST /api/usuarios - Request body:', body)
    
    const { nombre, email, telefono, direccion, rol = 'cliente' } = body

    if (!nombre || !email) {
      console.log('POST /api/usuarios - Missing required fields')
      return NextResponse.json(
        { error: 'Nombre and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('POST /api/usuarios - Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('POST /api/usuarios - Calling createUsuario with:', { nombre, email, telefono, direccion, rol })
    const usuario = await createUsuario({ nombre, email, telefono, direccion, rol })
    console.log('POST /api/usuarios - Created usuario:', usuario)
    
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/usuarios:', error)
    console.error('Error stack:', error.stack)
    
    // Manejar específicamente el error de email duplicado
    if (error.code === '23505' && error.constraint === 'usuarios_email_key') {
      return NextResponse.json(
        { error: 'El email ya está registrado en el sistema' },
        { status: 409 } // Conflict
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create usuario' },
      { status: 500 }
    )
  }
}
