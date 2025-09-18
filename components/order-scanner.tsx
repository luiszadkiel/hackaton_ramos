"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, X, Search, CheckCircle, Clock, Droplets, Wind, Icon as Iron, Package, Scan } from "lucide-react"

interface OrderScannerProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderScanner({ isOpen, onClose }: OrderScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedId, setScannedId] = useState("")
  const [foundOrder, setFoundOrder] = useState<any>(null)
  const [manualId, setManualId] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const orderStages = [
    { id: "recibido", name: "Recibido", icon: Package, color: "bg-gray-500" },
    { id: "lavando", name: "Lavando", icon: Droplets, color: "bg-blue-500" },
    { id: "secando", name: "Secando", icon: Wind, color: "bg-yellow-500" },
    { id: "planchado", name: "Planchado", icon: Iron, color: "bg-purple-500" },
    { id: "listo", name: "Listo", icon: CheckCircle, color: "bg-green-500" },
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("No se pudo acceder a la cámara")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const searchOrder = (orderId: string) => {
    // Simular búsqueda en localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const order = orders.find((o: any) => o.id === orderId || o.id === `#${orderId}`)

    if (order) {
      setFoundOrder(order)
      setScannedId(orderId)
    } else {
      alert("Pedido no encontrado")
    }
  }

  const updateOrderStage = (newStage: string) => {
    if (!foundOrder) return

    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = orders.map((order: any) => {
      if (order.id === foundOrder.id) {
        const currentStageIndex = orderStages.findIndex((stage) => stage.id === order.currentStage)
        const newStageIndex = orderStages.findIndex((stage) => stage.id === newStage)

        return {
          ...order,
          currentStage: newStage,
          progress: ((newStageIndex + 1) / orderStages.length) * 100,
          stages: order.stages.map((stage: any, index: number) => ({
            ...stage,
            completed: index <= newStageIndex,
            current: index === newStageIndex,
          })),
          updatedAt: new Date().toISOString(),
        }
      }
      return order
    })

    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Actualizar el pedido encontrado
    const updatedOrder = updatedOrders.find((o: any) => o.id === foundOrder.id)
    setFoundOrder(updatedOrder)

    alert(`Pedido ${foundOrder.id} actualizado a: ${orderStages.find((s) => s.id === newStage)?.name}`)
  }

  const handleManualSearch = () => {
    if (manualId.trim()) {
      searchOrder(manualId.trim())
    }
  }

  const simulateQRScan = () => {
    // Simular escaneo de QR - en producción esto sería un lector real
    const mockOrderIds = ["623916", "623917", "623918"]
    const randomId = mockOrderIds[Math.floor(Math.random() * mockOrderIds.length)]
    searchOrder(randomId)
    stopCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gestionar Estado de Pedido</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!foundOrder ? (
            <div className="space-y-6">
              {/* Camera Scanner */}
              <div className="text-center">
                <h3 className="font-semibold mb-4">Escanear Código QR</h3>

                {!isScanning ? (
                  <Button onClick={startCamera} className="bg-blue-500 hover:bg-blue-600 text-white mb-4">
                    <Camera className="h-5 w-5 mr-2" />
                    Activar Cámara
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 border-2 border-white border-dashed m-8 rounded-lg"></div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={simulateQRScan} className="bg-green-500 hover:bg-green-600 text-white flex-1">
                        <Scan className="h-4 w-4 mr-2" />
                        Simular Escaneo
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Search */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Búsqueda Manual</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresa ID del pedido"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
                  />
                  <Button onClick={handleManualSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Pedido {foundOrder.id}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Cliente: {foundOrder.customerName}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Artículos: {foundOrder.items?.length || 0} prendas
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Estado actual:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {orderStages.find((s) => s.id === foundOrder.currentStage)?.name || "Recibido"}
                  </Badge>
                </div>
              </div>

              {/* Stage Updates */}
              <div>
                <h3 className="font-semibold mb-4">Actualizar Estado</h3>
                <div className="grid grid-cols-1 gap-2">
                  {orderStages.map((stage) => {
                    const Icon = stage.icon
                    const isCurrentStage = foundOrder.currentStage === stage.id
                    const isCompleted = foundOrder.stages?.find((s: any) =>
                      s.name.toLowerCase().includes(stage.name.toLowerCase()),
                    )?.completed

                    return (
                      <Button
                        key={stage.id}
                        onClick={() => updateOrderStage(stage.id)}
                        variant={isCurrentStage ? "default" : "outline"}
                        className={`justify-start ${isCurrentStage ? stage.color + " text-white" : ""} ${isCompleted ? "opacity-60" : ""}`}
                        disabled={isCompleted && !isCurrentStage}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {stage.name}
                        {isCurrentStage && <Clock className="h-4 w-4 ml-auto" />}
                        {isCompleted && !isCurrentStage && <CheckCircle className="h-4 w-4 ml-auto" />}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setFoundOrder(null)
                    setScannedId("")
                    setManualId("")
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Buscar Otro
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
