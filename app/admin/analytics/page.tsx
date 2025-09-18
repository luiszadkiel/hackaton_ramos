"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Users, Clock, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const router = useRouter()

  const analyticsData = {
    dailyRevenue: 4750.5,
    weeklyRevenue: 28500.0,
    monthlyRevenue: 125000.0,
    totalOrders: 1250,
    averageOrderValue: 38.5,
    customerSatisfaction: 4.8,
    machineEfficiency: 94,
    deliveryTime: 2.5,
  }

  const chartData = [
    { day: "Lun", orders: 45, revenue: 1800 },
    { day: "Mar", orders: 52, revenue: 2100 },
    { day: "Mié", orders: 38, revenue: 1500 },
    { day: "Jue", orders: 61, revenue: 2400 },
    { day: "Vie", orders: 48, revenue: 1900 },
    { day: "Sáb", orders: 35, revenue: 1400 },
    { day: "Dom", orders: 28, revenue: 1200 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-slate-800 dark:text-white">Analytics</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Revenue Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">${analyticsData.dailyRevenue}</div>
            <div className="text-sm text-slate-600">Ingresos Hoy</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">${analyticsData.weeklyRevenue}</div>
            <div className="text-sm text-slate-600">Ingresos Semana</div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Métricas de Rendimiento</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Eficiencia de Máquinas</span>
              <span className="font-semibold text-green-600">{analyticsData.machineEfficiency}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analyticsData.machineEfficiency}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Satisfacción del Cliente</span>
              <span className="font-semibold text-blue-600">{analyticsData.customerSatisfaction}/5.0</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(analyticsData.customerSatisfaction / 5) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tiempo Promedio de Entrega</span>
              <span className="font-semibold text-purple-600">{analyticsData.deliveryTime}h</span>
            </div>
          </div>
        </Card>

        {/* Weekly Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Rendimiento Semanal</h3>
          <div className="space-y-3">
            {chartData.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-600 w-8">{day.day}</span>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(day.orders / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">{day.orders} pedidos</div>
                  <div className="text-xs text-slate-600">${day.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-600">{analyticsData.totalOrders}</div>
            <div className="text-sm text-slate-600">Total Pedidos</div>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">${analyticsData.averageOrderValue}</div>
            <div className="text-sm text-slate-600">Valor Promedio</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
