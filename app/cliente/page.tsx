"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Plus,
  Package,
  Droplets,
  Wind,
  Shirt,
  CheckCircle,
  Home,
  Calendar,
  Gift,
  MessageCircle,
  Moon,
  Sun,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import SmartChatbot from "@/components/smart-chatbot"
import GamificationSystem from "@/components/gamification-system"
import NewOrderForm from "@/components/new-order-form"
import { useOrdenesState, Orden } from "@/hooks/useOrdenes"

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

export default function ClienteDashboard() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showNewOrderForm, setShowNewOrderForm] = useState(false)
  const router = useRouter()

  // Usar el hook de órdenes para obtener datos reales
  const { ordenes, loading, error, fetchOrdenes, addOrden } = useOrdenesState()

  useEffect(() => {
    // Cargar órdenes al montar el componente
    fetchOrdenes()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleOrderCreated = (newOrder: any) => {
    // Agregar la nueva orden al estado local
    addOrden(newOrder)
    // También refrescar desde la API para obtener datos actualizados
    fetchOrdenes()
  }

  const orderStages = [
    { icon: Package, label: "Recibido", completed: true },
    { icon: Droplets, label: "Lavando", completed: true },
    { icon: Wind, label: "Secando", completed: false },
    { icon: Shirt, label: "Planchado", completed: false },
    { icon: CheckCircle, label: "Listo", completed: false },
  ]

  const smartClosetItems = [
    { name: "Camisa de algodón", status: "Limpia", recommendation: "Última limpieza: hace 5 días" },
    { name: "Vestido de seda", status: "Cuidado especial", recommendation: "Recomendación: Lavado en seco" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "en_proceso":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "listo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "entregado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "en_proceso":
        return "En Proceso"
      case "listo":
        return "Listo"
      case "entregado":
        return "Entregado"
      default:
        return status
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "rewards":
        return <GamificationSystem />
      case "home":
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">¡Hola, María! 👋</h2>
              <p className="text-slate-600 dark:text-slate-300">¿Qué necesitas lavar hoy?</p>
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-semibold"
              onClick={() => setShowNewOrderForm(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Pedido
            </Button>

            {/* Órdenes Recientes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Pedidos Recientes</h3>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4">
                  Error al cargar pedidos: {error}
                </div>
              )}

              {ordenes.length > 0 ? (
                <div className="space-y-3">
                  {ordenes.slice(0, 3).map((orden) => (
                    <div key={orden.id_orden} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800 dark:text-white">
                          Pedido #{orden.id_orden ? orden.id_orden.slice(-6) : 'N/A'}
                        </span>
                        <Badge className={getStatusColor(orden.estado)}>
                          {getStatusText(orden.estado)}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <p>Servicio: {orden.tipo_servicio}</p>
                        <p>Total: ${orden.precio_total}</p>
                        <p>Fecha: {new Date(orden.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No tienes pedidos aún</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Crea tu primer pedido usando el botón de arriba
                  </p>
                </div>
              )}
            </Card>
          
            



            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Smart Closet</h3>
                <Badge variant="secondary">12 prendas</Badge>
              </div>

              <div className="space-y-3">
                {smartClosetItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Shirt className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.recommendation}</p>
                    </div>
                    <Badge
                      className={
                        item.status === "Limpia" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }
                    >
                      {item.status === "Limpia" ? "✓ Limpia" : "⚠ Cuidado especial"}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-blue-600 dark:text-blue-400">
                Ver todas
              </Button>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">Cliente</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
       
      <div className="p-4 pb-20">{renderContent()}</div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-3 ${activeTab === "home" ? "text-blue-500" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-3"
            onClick={() => router.push("/cliente/pedidos")}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Pedidos</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-3 ${activeTab === "rewards" ? "text-blue-500" : ""}`}
            onClick={() => setActiveTab("rewards")}
          >
            <Gift className="h-5 w-5 mb-1" />
            <span className="text-xs">Rewards</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-3"
            onClick={() => router.push("/cliente/chat")}
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Chat</span>
          </Button>
        </div>
      </div>

      {showNewOrderForm && (
        <NewOrderForm onClose={() => setShowNewOrderForm(false)} onOrderCreated={handleOrderCreated} />
      )}

      <SmartChatbot />
    </div>
  )
}
