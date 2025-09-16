"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Package, Clock, MapPin, Eye, Plus, CheckCircle, Droplets, Wind, Zap, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  items: Array<{
    type: string
    quantity: number
    service: string
  }>
  status: string
  total: number
  pickupDate: string
  deliveryDate: string
  pickupAddress: string
  deliveryAddress: string
  createdAt: string
}

export default function PedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("clientOrders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem("clientOrders")
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically for updates
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "recibido":
        return 20
      case "lavando":
        return 40
      case "secando":
        return 60
      case "planchado":
        return 80
      case "listo":
        return 100
      case "entregado":
        return 100
      default:
        return 0
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "recibido":
        return <Package className="h-4 w-4" />
      case "lavando":
        return <Droplets className="h-4 w-4" />
      case "secando":
        return <Wind className="h-4 w-4" />
      case "planchado":
        return <Zap className="h-4 w-4" />
      case "listo":
        return <Sparkles className="h-4 w-4" />
      case "entregado":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recibido":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "lavando":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "secando":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "planchado":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "listo":
        return "bg-green-100 text-green-800 border-green-200"
      case "entregado":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "recibido":
        return "Recibido"
      case "lavando":
        return "Lavando"
      case "secando":
        return "Secando"
      case "planchado":
        return "Planchado"
      case "listo":
        return "Listo"
      case "entregado":
        return "Entregado"
      default:
        return status
    }
  }

  const getOrderStages = (currentStatus: string) => {
    const stages = [
      { key: "recibido", label: "Recibido", icon: Package },
      { key: "lavando", label: "Lavando", icon: Droplets },
      { key: "secando", label: "Secando", icon: Wind },
      { key: "planchado", label: "Planchado", icon: Zap },
      { key: "listo", label: "Listo", icon: Sparkles },
    ]

    const currentIndex = stages.findIndex((stage) => stage.key === currentStatus)

    return stages.map((stage, index) => ({
      ...stage,
      completed: index <= currentIndex,
      current: stage.key === currentStatus,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold text-slate-800">Mis Pedidos</h1>
            <p className="text-sm text-slate-600">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push("/cliente")}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2">No tienes pedidos aún</h3>
            <p className="text-slate-600 mb-6">Crea tu primer pedido y comienza a disfrutar de nuestro servicio</p>
            <Button onClick={() => router.push("/cliente")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Pedido
            </Button>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(order.status).replace("text-", "text-").replace("bg-", "bg-")}`}
                  >
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Pedido #{order.id}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(order.status)} border`}>{getStatusText(order.status)}</Badge>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 mb-3">
                  <span className="font-medium">Progreso del pedido</span>
                  <span>{getStatusProgress(order.status)}%</span>
                </div>
                <Progress value={getStatusProgress(order.status)} className="h-2 mb-4" />

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    {getOrderStages(order.status).map((stage, index) => {
                      const IconComponent = stage.icon
                      return (
                        <div key={stage.key} className="flex flex-col items-center space-y-2 flex-1">
                          <div
                            className={`p-2 rounded-full transition-colors ${
                              stage.completed
                                ? stage.current
                                  ? "bg-blue-600 text-white"
                                  : "bg-green-600 text-white"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-xs font-medium ${stage.completed ? "text-slate-800" : "text-slate-400"}`}
                          >
                            {stage.label}
                          </span>
                          {index < getOrderStages(order.status).length - 1 && (
                            <div
                              className={`absolute h-0.5 w-8 mt-4 ${stage.completed ? "bg-green-600" : "bg-slate-200"}`}
                              style={{ left: `${(index + 1) * 20}%` }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">ETA:</span>
                      <span className="font-medium text-slate-800">2 horas 30 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-slate-800 mb-3">Artículos del pedido</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-700">
                          {item.quantity}x {item.type}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.service}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Recogida</p>
                    <p className="text-sm text-slate-600">
                      {new Date(order.pickupDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Entrega</p>
                    <p className="text-sm text-slate-600">
                      {new Date(order.deliveryDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Total del pedido</p>
                  <p className="text-xl font-bold text-slate-800">S/ {order.total.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/tracking/${order.id}`)}
                    className="hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Seguimiento
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
