"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Droplets, Wind, Shirt, CheckCircle, Clock, MapPin, Phone, Camera } from "lucide-react"

interface OrderTrackingProps {
  orderId: string
  customerName?: string
  items?: string
  currentStage: number
  estimatedTime?: string
  showActions?: boolean
  role?: "customer" | "admin" | "delivery"
}

export default function OrderTracking({
  orderId,
  customerName,
  items,
  currentStage,
  estimatedTime,
  showActions = false,
  role = "customer",
}: OrderTrackingProps) {
  const [stage, setStage] = useState(currentStage)

  const orderStages = [
    {
      icon: Package,
      label: "Recibido",
      description: "Pedido recibido en lavandería",
      color: "bg-blue-500",
    },
    {
      icon: Droplets,
      label: "Lavando",
      description: "En proceso de lavado",
      color: "bg-blue-600",
    },
    {
      icon: Wind,
      label: "Secando",
      description: "En proceso de secado",
      color: "bg-yellow-500",
    },
    {
      icon: Shirt,
      label: "Planchado",
      description: "En proceso de planchado",
      color: "bg-purple-500",
    },
    {
      icon: CheckCircle,
      label: "Listo",
      description: "Listo para entrega",
      color: "bg-green-500",
    },
  ]

  const getStageStatus = (index: number) => {
    if (index < stage) return "completed"
    if (index === stage) return "current"
    return "pending"
  }

  const getStageColor = (index: number) => {
    const status = getStageStatus(index)
    if (status === "completed") return "bg-green-500 text-white"
    if (status === "current") return orderStages[index].color + " text-white"
    return "bg-slate-200 dark:bg-slate-600 text-slate-400"
  }

  const nextStage = () => {
    if (stage < orderStages.length - 1) {
      setStage(stage + 1)
    }
  }

  const progressPercentage = ((stage + 1) / orderStages.length) * 100

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Pedido {orderId}</h3>
          {customerName && <p className="text-sm text-slate-600 dark:text-slate-300">{customerName}</p>}
        </div>
        <Badge
          className={
            stage === orderStages.length - 1
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          }
        >
          {stage === orderStages.length - 1 ? "Completado" : "En Proceso"}
        </Badge>
      </div>

      {items && <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{items}</p>}

      {/* Stage Timeline */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          {orderStages.map((stageInfo, index) => {
            const IconComponent = stageInfo.icon
            const status = getStageStatus(index)

            return (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStageColor(index)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span
                    className={`text-xs font-medium ${
                      status === "pending" ? "text-slate-400" : "text-slate-800 dark:text-white"
                    }`}
                  >
                    {stageInfo.label}
                  </span>
                  {status === "current" && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{stageInfo.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Progress value={progressPercentage} className="h-2" />

        {estimatedTime && stage < orderStages.length - 1 && (
          <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
            <Clock className="h-4 w-4 mr-1" />
            ETA: {estimatedTime}
          </div>
        )}
      </div>

      {/* Role-specific Actions */}
      {showActions && (
        <div className="space-y-3">
          {role === "admin" && stage < orderStages.length - 1 && (
            <div className="flex space-x-2">
              <Button onClick={nextStage} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como {orderStages[stage + 1]?.label}
              </Button>
              <Button variant="outline" size="icon">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          )}

          {role === "delivery" && stage === orderStages.length - 1 && (
            <div className="flex space-x-2">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Iniciar Entrega
              </Button>
              <Button variant="outline" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          )}

          {role === "customer" && stage === orderStages.length - 1 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">¡Tu pedido está listo para recoger!</p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Recibirás una notificación cuando el delivery esté en camino
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stage History */}
      {role === "admin" && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-3">Historial de Estados</h4>
          <div className="space-y-2">
            {orderStages.slice(0, stage + 1).map((stageInfo, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{stageInfo.label}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {index === stage ? "En proceso" : "Completado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
