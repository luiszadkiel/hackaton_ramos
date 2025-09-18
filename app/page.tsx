"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Truck, Settings, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RoleSelection() {
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const roles = [
    {
      id: "cliente",
      title: "Cliente",
      description: "Gestiona tus pedidos y historial",
      icon: User,
      color: "bg-blue-500",
      route: "/cliente",
    },
    {
      id: "delivery",
      title: "Delivery",
      description: "Rutas y entregas optimizadas",
      icon: Truck,
      color: "bg-green-500",
      route: "/delivery",
    },
    {
      id: "admin",
      title: "Empleado/Admin",
      description: "Gestión y supervisión",
      icon: Settings,
      color: "bg-purple-500",
      route: "/admin",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Theme Toggle */}
      <Button variant="ghost" size="icon" onClick={toggleTheme} className="absolute top-4 right-4">
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Logo and Brand */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-slate-700">
          <Image src="/images/pressto-logo.png" alt="PressTo Logo" width={80} height={26} className="object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">LavaSmart</h1>
        <p className="text-slate-600 dark:text-slate-300">Selecciona tu rol para continuar</p>
      </div>

      {/* Role Cards */}
      <div className="w-full max-w-md space-y-4">
        {roles.map((role) => {
          const IconComponent = role.icon
          return (
            <Card
              key={role.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-md"
              onClick={() => router.push(role.route)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-white">{role.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{role.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Help Button */}
      <Button variant="ghost" className="mt-8 text-slate-600 dark:text-slate-300">
        ¿Necesitas ayuda?
      </Button>
    </div>
  )
}
