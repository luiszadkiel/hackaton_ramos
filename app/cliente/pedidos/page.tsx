"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, RefreshCw, Loader2, Eye, Package, Calendar, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOrdenesState } from "@/hooks/useOrdenes"

export default function ClientePedidos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  const { ordenes, loading, error, fetchOrdenes } = useOrdenesState()

  useEffect(() => {
    fetchOrdenes(1, 20, {
      estado: statusFilter === "all" ? undefined : statusFilter,
    })
  }, [statusFilter])

  const filteredOrders = ordenes.filter(orden => {
    const matchesSearch = 
      orden.id_orden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.tipo_servicio.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "confirmada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "en_proceso":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "lista_recogida":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "en_lavado":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      case "lista_entrega":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "entregada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "cancelada":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendiente": return "Pendiente"
      case "confirmada": return "Confirmada"
      case "en_proceso": return "En Proceso"
      case "lista_recogida": return "Lista Recogida"
      case "en_lavado": return "En Lavado"
      case "lista_entrega": return "Lista Entrega"
      case "entregada": return "Entregada"
      case "cancelada": return "Cancelada"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendiente": return "⏳"
      case "confirmada": return "✅"
      case "en_proceso": return "🔄"
      case "lista_recogida": return "📦"
      case "en_lavado": return "🧼"
      case "lista_entrega": return "🚚"
      case "entregada": return "🎉"
      case "cancelada": return "❌"
      default: return "📋"
    }
  }

  const handleRefresh = () => {
    fetchOrdenes(1, 20, {
      estado: statusFilter === "all" ? undefined : statusFilter,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/cliente")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">Mis Pedidos</h1>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por ID o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="lista_recogida">Lista Recogida</SelectItem>
                  <SelectItem value="en_lavado">En Lavado</SelectItem>
                  <SelectItem value="lista_entrega">Lista Entrega</SelectItem>
                  <SelectItem value="entregada">Entregada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Mis Pedidos ({filteredOrders.length})
            </h2>
            {loading && (
              <div className="flex items-center text-blue-500 text-sm">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cargando...
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              Error al cargar pedidos: {error}
            </div>
          )}

          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((orden) => (
                <div key={orden.id_orden} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(orden.estado)}</span>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                          Pedido #{orden.id_orden ? orden.id_orden.slice(-6) : 'N/A'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {orden.tipo_servicio}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(orden.estado)}>
                      {getStatusText(orden.estado)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(orden.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${orden.precio_total}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Package className="h-4 w-4 mr-2" />
                      <span>{orden.tiempo_estimado || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/tracking/${orden.id_orden}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Seguimiento
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                No tienes pedidos aún
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchTerm || (statusFilter && statusFilter !== "all")
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Crea tu primer pedido para comenzar"
                }
              </p>
              {!searchTerm && (!statusFilter || statusFilter === "all") && (
                <Button onClick={() => router.push("/cliente")}>
                  Crear Pedido
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}