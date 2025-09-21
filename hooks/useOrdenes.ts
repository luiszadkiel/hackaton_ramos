import { useState, useEffect } from 'react'
import { useApi, useApiPost, useApiUpdate, useApiDelete } from './useApi'

export interface Orden {
  id_orden: string
  id_usuario: string
  id_repartidor?: string
  fecha_creacion: string
  estado: string
  tipo_servicio: string
  extras_orden?: any
  precio_total: number
  tiempo_estimado?: string
  direccion_entrega?: string
  zona_entrega?: string
  created_at: string
  updated_at?: string
  cliente_nombre?: string
  cliente_email?: string
  cliente_telefono?: string
  prendas?: any[]
  extras?: any[]
  historial?: any[]
  pagos?: any[]
}

export interface OrdenCreateData {
  id_usuario: string
  tipo_servicio: string
  direccion_entrega: string
  zona_entrega?: string
  precio_total: number
  estado?: string
  extras_orden?: any
  tiempo_estimado?: string
}

export interface OrdenUpdateData {
  estado: string
  observaciones?: string
  usuario_id?: string
}

export interface OrdenesResponse {
  data: Orden[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    estado?: string
    usuario_id?: string
    fecha_desde?: string
    fecha_hasta?: string
  }
}

// Hook para obtener todas las órdenes
export function useOrdenes(page = 1, limit = 10, filters: {
  estado?: string
  usuario_id?: string
  fecha_desde?: string
  fecha_hasta?: string
} = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value
      return acc
    }, {} as Record<string, string>),
  })

  return useApi<OrdenesResponse>(`/api/orders?${params}`)
}

// Hook para obtener una orden específica
export function useOrden(id: string) {
  return useApi<Orden>(`/api/ordenes/${id}`)
}

// Hook para crear una orden
export function useCreateOrden() {
  return useApiPost<OrdenCreateData, Orden>('/api/orders')
}

// Hook para actualizar el estado de una orden
export function useUpdateOrdenEstado(id: string) {
  return useApiUpdate<OrdenUpdateData, Orden>(`/api/ordenes/${id}`)
}

// Hook para cancelar una orden
export function useCancelOrden(id: string) {
  return useApiDelete(`/api/ordenes/${id}`)
}

// Hook para gestión de estado local de órdenes
export function useOrdenesState() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrdenes = async (page = 1, limit = 10, filters: {
    estado?: string
    usuario_id?: string
    fecha_desde?: string
    fecha_hasta?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value
          return acc
        }, {} as Record<string, string>),
      })

      const response = await fetch(`/api/orders?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: OrdenesResponse = await response.json()
      setOrdenes(result.data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const addOrden = (orden: Orden) => {
    setOrdenes(prev => [orden, ...prev])
  }

  const updateOrden = (updatedOrden: Orden) => {
    setOrdenes(prev => 
      prev.map(orden => 
        orden.id_orden === updatedOrden.id_orden ? updatedOrden : orden
      )
    )
  }

  const removeOrden = (id: string) => {
    setOrdenes(prev => prev.filter(orden => orden.id_orden !== id))
  }

  return {
    ordenes,
    loading,
    error,
    fetchOrdenes,
    addOrden,
    updateOrden,
    removeOrden,
  }
}
