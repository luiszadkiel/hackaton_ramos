"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Bell, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderManagement({ params }: { params: { orderId: string } }) {
  const [currentStage, setCurrentStage] = useState("Lavando")
  const [photos, setPhotos] = useState<{ before?: string; after?: string }>({})
  const [machineInfo, setMachineInfo] = useState({ name: "Lavadora #3", timeRemaining: 25 })
  const router = useRouter()

  const stages = [
    { id: "Lavado", label: "Lavado", icon: "🧽", color: "bg-blue-500" },
    { id: "Secado", label: "Secado", icon: "🌪️", color: "bg-yellow-500" },
    { id: "Planchado", label: "Planchado", icon: "👔", color: "bg-purple-500" },
    { id: "Listo", label: "Listo", icon: "✅", color: "bg-green-500" },
  ]

  const notifications = [
    { id: "completed", label: "Proceso completado", icon: Bell },
    { id: "special", label: "Tratamiento especial aplicado", icon: Bell },
    { id: "ready", label: "Listo para recolección", icon: Bell },
  ]

  const handleStageUpdate = (stage: string) => {
    setCurrentStage(stage)

    // Update machine info based on stage
    switch (stage) {
      case "Lavado":
        setMachineInfo({ name: "Lavadora #3", timeRemaining: 25 })
        break
      case "Secado":
        setMachineInfo({ name: "Secadora #1", timeRemaining: 20 })
        break
      case "Planchado":
        setMachineInfo({ name: "Estación de Planchado", timeRemaining: 15 })
        break
      case "Listo":
        setMachineInfo({ name: "Listo para entrega", timeRemaining: 0 })
        break
    }

    // Auto-send notification when stage changes
    sendNotification("completed")
  }

  const handlePhotoCapture = (type: "before" | "after") => {
    setPhotos((prev) => ({
      ...prev,
      [type]: `/placeholder.svg?height=150&width=150&query=${type === "before" ? "dirty clothes before washing" : "clean clothes after washing"}`,
    }))
  }

  const sendNotification = (type: string) => {
    const notification = notifications.find((n) => n.id === type)
    alert(`Notificación enviada al cliente: ${notification?.label}`)
  }

  useEffect(() => {
    if (machineInfo.timeRemaining > 0 && currentStage !== "Listo") {
      const timer = setInterval(() => {
        setMachineInfo((prev) => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
        }))
      }, 60000) // Update every minute

      return () => clearInterval(timer)
    }
  }, [machineInfo.timeRemaining, currentStage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800">Pedido {params.orderId}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Estado Actual</h3>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                {currentStage === "Listo" ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <Clock className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{machineInfo.name}</p>
                {machineInfo.timeRemaining > 0 ? (
                  <p className="text-sm text-slate-600">Tiempo restante: {machineInfo.timeRemaining} min</p>
                ) : (
                  <p className="text-sm text-green-600">Proceso completado</p>
                )}
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">{currentStage}</Badge>
          </div>
        </Card>

        {/* Update Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Actualizar Estado</h3>
          <div className="grid grid-cols-2 gap-3">
            {stages.map((stage) => (
              <Button
                key={stage.id}
                variant={currentStage === stage.id ? "default" : "outline"}
                className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                  stage.id === "Listo" ? "bg-blue-500 hover:bg-blue-600 text-white col-span-2" : ""
                } ${currentStage === stage.id ? stage.color : ""}`}
                onClick={() => handleStageUpdate(stage.id)}
              >
                <span className="text-lg">{stage.icon}</span>
                <span className="text-sm font-medium">{stage.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Process Photos */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Fotos del Proceso</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                {photos.before ? (
                  <img
                    src={photos.before || "/placeholder.svg"}
                    alt="Antes"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Antes</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-600">Antes</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                {photos.after ? (
                  <img
                    src={photos.after || "/placeholder.svg"}
                    alt="Después"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Después</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-600">Después</p>
            </div>
          </div>
          <Button
            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            onClick={() => handlePhotoCapture(photos.before ? "after" : "before")}
          >
            <Camera className="h-4 w-4 mr-2" />
            Tomar Foto
          </Button>
        </Card>

        {/* Client Notifications */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Notificar Cliente</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Button
                key={notification.id}
                variant="outline"
                className="w-full justify-start p-4 h-auto bg-transparent hover:bg-blue-50"
                onClick={() => sendNotification(notification.id)}
              >
                <notification.icon className="h-4 w-4 mr-3" />
                {notification.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
