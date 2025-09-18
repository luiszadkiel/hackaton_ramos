"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MachineManagement() {
  const router = useRouter()

  const [machines, setMachines] = useState([
    {
      id: "L01",
      name: "Lavadora #1",
      type: "washer",
      status: "active",
      capacity: 85,
      timeRemaining: 20,
      location: "L01",
    },
    {
      id: "L02",
      name: "Lavadora #2",
      type: "washer",
      status: "free",
      capacity: 0,
      timeRemaining: null,
      location: "L02",
    },
    {
      id: "L03",
      name: "Lavadora #3",
      type: "washer",
      status: "active",
      capacity: 70,
      timeRemaining: 25,
      location: "L03",
    },
    {
      id: "S01",
      name: "Secadora #1",
      type: "dryer",
      status: "maintenance",
      capacity: 0,
      timeRemaining: null,
      location: "S01",
    },
    {
      id: "S02",
      name: "Secadora #2",
      type: "dryer",
      status: "active",
      capacity: 90,
      timeRemaining: 15,
      location: "S02",
    },
  ])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-500",
          badge: "bg-blue-100 text-blue-800",
          text: "Activa",
          icon: CheckCircle,
        }
      case "free":
        return {
          color: "bg-gray-400",
          badge: "bg-gray-100 text-gray-800",
          text: "Libre",
          icon: CheckCircle,
        }
      case "maintenance":
        return {
          color: "bg-red-500",
          badge: "bg-red-100 text-red-800",
          text: "Mantenimiento",
          icon: AlertTriangle,
        }
      default:
        return {
          color: "bg-gray-400",
          badge: "bg-gray-100 text-gray-800",
          text: "Desconocido",
          icon: Settings,
        }
    }
  }

  const activeCount = machines.filter((m) => m.status === "active").length
  const freeCount = machines.filter((m) => m.status === "free").length
  const maintenanceCount = machines.filter((m) => m.status === "maintenance").length

  const scheduleMaintenance = (machineId: string) => {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === machineId ? { ...machine, status: "maintenance", capacity: 0, timeRemaining: null } : machine,
      ),
    )
    alert(`Mantenimiento programado para ${machineId}`)
  }

  const startMachine = (machineId: string) => {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === machineId ? { ...machine, status: "active", capacity: 50, timeRemaining: 30 } : machine,
      ),
    )
  }

  const completeMaintenance = (machineId: string) => {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === machineId ? { ...machine, status: "free", capacity: 0, timeRemaining: null } : machine,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800">Gestión de Máquinas</h1>
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/machine-management/add")}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-slate-600">Activas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{freeCount}</div>
            <div className="text-sm text-slate-600">Libres</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{maintenanceCount}</div>
            <div className="text-sm text-slate-600">Mantenimiento</div>
          </Card>
        </div>

        {/* Machines List */}
        <div className="space-y-4">
          {machines.map((machine) => {
            const statusInfo = getStatusInfo(machine.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={machine.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{machine.name}</h3>
                      <p className="text-sm text-slate-600">{machine.location}</p>
                    </div>
                  </div>
                  <Badge className={statusInfo.badge}>{statusInfo.text}</Badge>
                </div>

                {machine.status === "active" && (
                  <>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Capacidad utilizada</span>
                        <span className="text-sm font-semibold text-slate-800">{machine.capacity}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${machine.capacity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Tiempo restante: {machine.timeRemaining} min
                      </div>
                      <Button size="sm" variant="outline" onClick={() => scheduleMaintenance(machine.id)}>
                        Mantenimiento
                      </Button>
                    </div>
                  </>
                )}

                {machine.status === "free" && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Máquina disponible para uso</p>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => startMachine(machine.id)}
                    >
                      Iniciar
                    </Button>
                  </div>
                )}

                {machine.status === "maintenance" && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Requiere mantenimiento
                    </p>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => scheduleMaintenance(machine.id)}>
                        Programar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => completeMaintenance(machine.id)}
                      >
                        Completar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
