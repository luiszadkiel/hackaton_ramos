"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Moon, Sun, MessageCircle, Phone, Share2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import OrderTracking from "@/components/order-tracking"

export default function OrderTrackingPage() {
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  // Mock order data - in real app this would come from API
  const orderData = {
    id: orderId,
    customerName: "María González",
    items: "3 camisas de algodón, 2 pantalones",
    currentStage: 2, // Secando
    estimatedTime: "1 hora 30 min",
    pickupAddress: "Av. Revolución 123, Col. Centro",
    deliveryPhone: "+52 555 123 4567",
    specialInstructions: "Planchado extra en camisas",
    orderDate: "16 Sep 2024, 10:30 AM",
    totalCost: 285.5,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">Seguimiento de Pedido</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Tracking Component */}
        <OrderTracking
          orderId={orderData.id}
          customerName={orderData.customerName}
          items={orderData.items}
          currentStage={orderData.currentStage}
          estimatedTime={orderData.estimatedTime}
          showActions={true}
          role="customer"
        />

        {/* Order Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Detalles del Pedido</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Fecha del pedido:</span>
              <span className="font-medium text-slate-800 dark:text-white">{orderData.orderDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Dirección de recogida:</span>
              <span className="font-medium text-slate-800 dark:text-white text-right">{orderData.pickupAddress}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Instrucciones especiales:</span>
              <span className="font-medium text-slate-800 dark:text-white">{orderData.specialInstructions}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">Total:</span>
              <span className="font-bold text-lg text-slate-800 dark:text-white">${orderData.totalCost}</span>
            </div>
          </div>
        </Card>

        {/* Contact & Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex flex-col items-center py-6 bg-transparent">
            <Phone className="h-5 w-5 mb-2" />
            <span className="text-xs">Llamar</span>
          </Button>

          <Button variant="outline" className="flex flex-col items-center py-6 bg-transparent">
            <MessageCircle className="h-5 w-5 mb-2" />
            <span className="text-xs">Chat</span>
          </Button>

          <Button variant="outline" className="flex flex-col items-center py-6 bg-transparent">
            <Share2 className="h-5 w-5 mb-2" />
            <span className="text-xs">Compartir</span>
          </Button>
        </div>

        {/* Delivery Info */}
        {orderData.currentStage >= 4 && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Información de Entrega</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">Repartidor:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">Roberto Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">Teléfono:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">{orderData.deliveryPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-300">ETA:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">15-20 minutos</span>
              </div>
            </div>
          </Card>
        )}

        {/* QR Code for Pickup */}
        <Card className="p-6 text-center">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Código QR para Recogida</h3>
          <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-24 h-24 bg-black dark:bg-white rounded grid grid-cols-8 gap-px p-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`${Math.random() > 0.5 ? "bg-white dark:bg-black" : "bg-black dark:bg-white"} rounded-sm`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Muestra este código al repartidor para confirmar la entrega
          </p>
        </Card>
      </div>
    </div>
  )
}
