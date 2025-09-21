import { useState, useEffect } from 'react'
import { useApi } from './useApi'

export interface Servicio {
  id_servicio: number
  nombre: string
  precio_base: number
  tiempo_estimado?: string
  descripcion?: string
  created_at: string
}

export interface Extra {
  id_extra: number
  nombre: string
  precio: number
  created_at: string
}

export interface ServiciosResponse {
  data: Servicio[]
  filters: {
    categoria?: string
    activo?: boolean
  }
}

export interface ExtrasResponse {
  data: Extra[]
  filters: {
    categoria?: string
    activo?: boolean
  }
}

// Hook para obtener todos los servicios
export function useServicios(categoria?: string, activo?: boolean) {
  const params = new URLSearchParams()
  if (categoria) params.append('categoria', categoria)
  if (activo !== undefined) params.append('activo', activo.toString())

  const queryString = params.toString()
  return useApi<ServiciosResponse>(`/api/servicios${queryString ? `?${queryString}` : ''}`)
}

// Hook para obtener un servicio específico
export function useServicio(id: string) {
  return useApi<Servicio>(`/api/servicios/${id}`)
}

// Hook para obtener todos los extras
export function useExtras(categoria?: string, activo?: boolean) {
  const params = new URLSearchParams()
  if (categoria) params.append('categoria', categoria)
  if (activo !== undefined) params.append('activo', activo.toString())

  const queryString = params.toString()
  return useApi<ExtrasResponse>(`/api/extras${queryString ? `?${queryString}` : ''}`)
}

// Hook para gestión de estado local de servicios
export function useServiciosState() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServicios = async (categoria?: string, activo?: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (categoria) params.append('categoria', categoria)
      if (activo !== undefined) params.append('activo', activo.toString())

      const queryString = params.toString()
      const response = await fetch(`/api/servicios${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ServiciosResponse = await response.json()
      setServicios(result.data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchExtras = async (categoria?: string, activo?: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (categoria) params.append('categoria', categoria)
      if (activo !== undefined) params.append('activo', activo.toString())

      const queryString = params.toString()
      const response = await fetch(`/api/extras${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ExtrasResponse = await response.json()
      setExtras(result.data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    servicios,
    extras,
    loading,
    error,
    fetchServicios,
    fetchExtras,
  }
}
