import { useState, useEffect } from 'react'
import { useApi, useApiPost, useApiUpdate } from './useApi'

export interface Usuario {
  id_usuario: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  rol: string
  created_at: string
  updated_at?: string
}

export interface UsuarioCreateData {
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  rol?: string
}

export interface UsuariosResponse {
  data: Usuario[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Hook para obtener todos los usuarios
export function useUsuarios(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  })

  return useApi<UsuariosResponse>(`/api/usuarios?${params}`)
}

// Hook para obtener un usuario específico
export function useUsuario(id: string) {
  return useApi<Usuario>(`/api/usuarios/${id}`)
}

// Hook para crear un usuario
export function useCreateUsuario() {
  return useApiPost<UsuarioCreateData, Usuario>('/api/usuarios')
}

// Hook para actualizar un usuario
export function useUpdateUsuario(id: string) {
  return useApiUpdate<UsuarioCreateData, Usuario>(`/api/usuarios/${id}`)
}

// Hook para gestión de estado local de usuarios
export function useUsuariosState() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/usuarios?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: UsuariosResponse = await response.json()
      setUsuarios(result.data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const addUsuario = (usuario: Usuario) => {
    setUsuarios(prev => [usuario, ...prev])
  }

  const updateUsuario = (updatedUsuario: Usuario) => {
    setUsuarios(prev => 
      prev.map(usuario => 
        usuario.id_usuario === updatedUsuario.id_usuario ? updatedUsuario : usuario
      )
    )
  }

  const removeUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id_usuario !== id))
  }

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    addUsuario,
    updateUsuario,
    removeUsuario,
  }
}
