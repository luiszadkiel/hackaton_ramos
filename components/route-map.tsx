"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Navigation, Clock, Phone, Car, Flag } from "lucide-react"

interface RouteMapProps {
  onBack: () => void
}

export default function RouteMap({ onBack }: RouteMapProps) {
  const [currentLocation, setCurrentLocation] = useState({ lat: 19.4326, lng: -99.1332 })
  const [selectedRoute, setSelectedRoute] = useState(0)

  const routes = [
    {
      id: 1,
      customer: "María González",
      address: "Av. Revolución 123",
      distance: "2.3 km",
      duration: "8 min",
      priority: "Alta",
      coordinates: { lat: 19.4356, lng: -99.1289 },
      items: "3 camisas, 2 pantalones",
      phone: "+52 555 123 4567",
    },
    {
      id: 2,
      customer: "Carlos Ruiz",
      address: "Calle 5 de Mayo 456",
      distance: "4.1 km",
      duration: "12 min",
      priority: "Normal",
      coordinates: { lat: 19.4284, lng: -99.1276 },
      items: "1 vestido, 2 blusas",
      phone: "+52 555 987 6543",
    },
    {
      id: 3,
      customer: "Ana Torres",
      address: "Insurgentes Sur 789",
      distance: "6.8 km",
      duration: "18 min",
      priority: "Baja",
      coordinates: { lat: 19.4194, lng: -99.1438 },
      items: "4 camisas, 1 saco",
      phone: "+52 555 456 7890",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Normal":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Baja":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">Rutas de Entrega</h1>
          <Button variant="ghost" size="icon">
            <Navigation className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Map Container */}
        <Card className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 320" className="w-full h-full">
                {/* Streets */}
                <path d="M0 100 L400 100" stroke="#666" strokeWidth="2" />
                <path d="M0 200 L400 200" stroke="#666" strokeWidth="2" />
                <path d="M100 0 L100 320" stroke="#666" strokeWidth="2" />
                <path d="M200 0 L200 320" stroke="#666" strokeWidth="2" />
                <path d="M300 0 L300 320" stroke="#666" strokeWidth="2" />
              </svg>
            </div>

            {/* Current Location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Tu ubicación
              </div>
            </div>

            {/* Route Points */}
            {routes.map((route, index) => (
              <div
                key={route.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  selectedRoute === index ? "scale-125" : "hover:scale-110"
                }`}
                style={{
                  top: `${20 + index * 25}%`,
                  left: `${30 + index * 20}%`,
                }}
                onClick={() => setSelectedRoute(index)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${
                    route.priority === "Alta"
                      ? "bg-red-500"
                      : route.priority === "Normal"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                >
                  {index + 1}
                </div>
                {selectedRoute === index && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {route.customer}
                  </div>
                )}
              </div>
            ))}

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M200 160 Q250 120 280 100 Q320 140 340 180 Q360 220 380 240"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              -
            </Button>
          </div>

          {/* Distance and Time Info */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1 text-blue-500" />
                <span className="font-semibold">13.2 km</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-green-500" />
                <span className="font-semibold">38 min</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Route Details */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Ruta Optimizada</h3>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">3 paradas</Badge>
          </div>

          <div className="space-y-3">
            {routes.map((route, index) => (
              <div
                key={route.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedRoute === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
                onClick={() => setSelectedRoute(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        route.priority === "Alta"
                          ? "bg-red-500"
                          : route.priority === "Normal"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">{route.customer}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{route.address}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(route.priority)}>{route.priority}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                    <span>{route.distance}</span>
                    <span>•</span>
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Navigation className="h-4 w-4 mr-1" />
                      Ir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Start Route Button */}
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold">
          <Flag className="h-5 w-5 mr-2" />
          Iniciar Ruta Completa
        </Button>
      </div>
    </div>
  )
}
