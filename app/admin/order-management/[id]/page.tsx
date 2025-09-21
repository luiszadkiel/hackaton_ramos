"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, RefreshCw, Loader2, Package, User, MapPin, Calendar, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOrden } from "@/hooks/useOrdenes"
import { useUpdateOrdenEstado } from "@/hooks/useOrdenes"
import toast from "react-hot-toast"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  const [newEstado, setNewEstado] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: orden, loading, error, refetch } = useOrden(params.id)
  const updateOrdenEstado = useUpdateOrdenEstado(params.id)

  useEffect(() => {
    if (orden) {
      setNewEstado(orden.estado)
    }
  }, [orden])

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

  const handleUpdateEstado = async () => {
    if (!newEstado) {
      toast.error("Selecciona un estado")
      return
    }

    try {
      setIsUpdating(true)
      const result = await updateOrdenEstado.update({
        estado: newEstado,
        observaciones,
        usuario_id: "admin" // Esto debería venir del contexto de usuario autenticado
      })

      if (result) {
        toast.success("Estado actualizado exitosamente")
        setObservaciones("")
        refetch()
      } else {
        toast.error("Error al actualizar el estado")
      }
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !orden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar el pedido</p>
          <Button onClick={() => router.push("/admin/order-management")}>
            Volver a la lista
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/order-management")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">
            Pedido #{orden.id_orden ? orden.id_orden.slice(-6) : 'N/A'}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Estado del Pedido</h2>
            <Badge className={getStatusColor(orden.estado)}>
              {getStatusText(orden.estado)}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Cambiar Estado
              </label>
              <Select value={newEstado} onValueChange={setNewEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Observaciones
              </label>
              <Textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Agrega observaciones sobre el cambio de estado..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpdateEstado}
              disabled={isUpdating || updateOrdenEstado.loading}
              className="w-full"
            >
              {isUpdating || updateOrdenEstado.loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Estado
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Información del Cliente</h3>
            </div>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {orden.cliente_nombre || "N/A"}</p>
              <p><strong>Email:</strong> {orden.cliente_email || "N/A"}</p>
              <p><strong>Teléfono:</strong> {orden.cliente_telefono || "N/A"}</p>
            </div>
          </Card>

          {/* Service Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Información del Servicio</h3>
            </div>
            <div className="space-y-2">
              <p><strong>Tipo de Servicio:</strong> {orden.tipo_servicio}</p>
              <p><strong>Precio Total:</strong> ${orden.precio_total}</p>
              <p><strong>Tiempo Estimado:</strong> {orden.tiempo_estimado || "N/A"}</p>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-orange-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Información de Entrega</h3>
            </div>
            <div className="space-y-2">
              <p><strong>Dirección:</strong> {orden.direccion_entrega || "N/A"}</p>
              <p><strong>Zona:</strong> {orden.zona_entrega || "N/A"}</p>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 mr-2 text-purple-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Cronología</h3>
            </div>
            <div className="space-y-2">
              <p><strong>Creado:</strong> {new Date(orden.created_at).toLocaleString()}</p>
              <p><strong>Última Actualización:</strong> {orden.updated_at ? new Date(orden.updated_at).toLocaleString() : "N/A"}</p>
            </div>
          </Card>
        </div>

        {/* Order History */}
        {orden.historial && orden.historial.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Historial de Estados</h3>
            <div className="space-y-3">
              {orden.historial.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <Badge className={getStatusColor(entry.estado)}>
                      {getStatusText(entry.estado)}
                    </Badge>
                    {entry.observaciones && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {entry.observaciones}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(entry.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Payment Info */}
        {orden.pagos && orden.pagos.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Información de Pago</h3>
            </div>
            <div className="space-y-3">
              {orden.pagos.map((pago: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      ${pago.monto} - {pago.metodo_pago}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Estado: {pago.estado}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(pago.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
