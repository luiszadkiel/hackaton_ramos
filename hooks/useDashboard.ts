import { useState, useEffect } from 'react'
import { useApi } from './useApi'

export interface DashboardStats {
  resumen: {
    total_ordenes: number
    total_usuarios: number
    total_servicios: number
    periodo_dias: number
  }
  ordenes: {
    por_estado: {
      pendiente: number
      confirmada: number
      en_proceso: number
      lista_recogida: number
      en_lavado: number
      lista_entrega: number
      entregada: number
      cancelada: number
    }
    ingresos_totales: number
    promedio_orden: number
  }
  tendencias: {
    ordenes_por_dia: Record<string, number>
    ingresos_por_dia: Record<string, number>
  }
}

// Hook para obtener estadísticas del dashboard
export function useDashboard(periodo = 30, fecha_desde?: string, fecha_hasta?: string) {
  const params = new URLSearchParams({
    periodo: periodo.toString(),
    ...(fecha_desde && { fecha_desde }),
    ...(fecha_hasta && { fecha_hasta }),
  })

  return useApi<DashboardStats>(`/api/dashboard?${params}`)
}

// Hook para gestión de estado local del dashboard
export function useDashboardState() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async (periodo = 30, fecha_desde?: string, fecha_hasta?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        periodo: periodo.toString(),
        ...(fecha_desde && { fecha_desde }),
        ...(fecha_hasta && { fecha_hasta }),
      })

      const response = await fetch(`/api/dashboard?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: DashboardStats = await response.json()
      setStats(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = () => {
    if (stats) {
      fetchStats()
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats,
  }
}
