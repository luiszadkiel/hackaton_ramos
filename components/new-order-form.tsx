"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus, Minus, Calendar, MapPin, Check, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useServicios } from "@/hooks/useServicios"
import { useCreateOrden } from "@/hooks/useOrdenes"
import { useCreateUsuario } from "@/hooks/useUsuarios"

interface NewOrderFormProps {
  onClose: () => void
  onOrderCreated: (order: any) => void
}

export default function NewOrderForm({ onClose, onOrderCreated }: NewOrderFormProps) {
  const [step, setStep] = useState(1)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [address, setAddress] = useState("")
  const [customerData, setCustomerData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  })

  // API hooks
  const { data: serviciosData, loading: serviciosLoading } = useServicios()
  const { data: extrasData, loading: extrasLoading } = useServicios()
  const createOrden = useCreateOrden()
  const createUsuario = useCreateUsuario()

  // Mock clothing items (estos podrían venir de una API también)
  const clothingItems = [
    { id: 1, name: "Camisa", price: 15, icon: "👔" },
    { id: 2, name: "Pantalón", price: 20, icon: "👖" },
    { id: 3, name: "Vestido", price: 25, icon: "👗" },
    { id: 4, name: "Chaqueta", price: 30, icon: "🧥" },
    { id: 5, name: "Falda", price: 18, icon: "👗" },
    { id: 6, name: "Blusa", price: 16, icon: "👚" },
  ]

  // Usar servicios reales de la API
  const services = serviciosData?.data || []
  const extras = extrasData?.data || []

  const addItem = (item: any) => {
    const existingItem = selectedItems.find((selected) => selected.id === item.id)
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((selected) =>
          selected.id === item.id ? { ...selected, quantity: selected.quantity + 1 } : selected,
        ),
      )
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
    toast.success(`${item.name} ha sido agregado`)
  }

  const removeItem = (itemId: number) => {
    const existingItem = selectedItems.find((selected) => selected.id === itemId)
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(
        selectedItems.map((selected) =>
          selected.id === itemId ? { ...selected, quantity: selected.quantity - 1 } : selected,
        ),
      )
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== itemId))
    }
    toast.error(`El articulo ha sido Borrado`)
  }

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const servicePrice = services.find((s) => s.id_servicio.toString() === selectedService)?.precio_base || 0
    return itemsTotal + servicePrice
  }

  const handleCreateOrder = async () => {
    try {
      // Validar datos del cliente
      if (!customerData.nombre || !customerData.email) {
        toast.error("Por favor completa los datos del cliente")
        return
      }

      // Crear usuario primero
      const usuario = await createUsuario.post({
        nombre: customerData.nombre,
        email: customerData.email,
        telefono: customerData.telefono,
        direccion: address,
        rol: "cliente"
      })

      if (!usuario) {
        toast.error("Error al crear el usuario")
        return
      }

      // Crear orden
      const ordenData = {
        id_usuario: usuario.id_usuario,
        tipo_servicio: services.find((s) => s.id_servicio.toString() === selectedService)?.nombre || "Lavado Regular",
        direccion_entrega: address,
        zona_entrega: "Centro", // Esto podría venir de una API de cobertura
        precio_total: calculateTotal(),
        estado: "pendiente",
        extras_orden: selectedItems.map(item => ({
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price
        })),
        tiempo_estimado: "2 horas 30 min"
      }

      const nuevaOrden = await createOrden.post(ordenData)

      if (!nuevaOrden) {
        toast.error("Error al crear la orden")
        return
      }

      // Crear objeto de orden para el frontend
      const newOrder = {
        id: nuevaOrden.id_orden,
        items: selectedItems.map((item) => ({
          type: item.name,
          quantity: item.quantity,
          service: services.find((s) => s.id_servicio.toString() === selectedService)?.nombre || selectedService,
        })),
        status: nuevaOrden.estado,
        total: nuevaOrden.precio_total,
        pickupDate,
        deliveryDate,
        pickupAddress: address,
        deliveryAddress: address,
        createdAt: nuevaOrden.created_at,
        cliente_nombre: usuario.nombre,
        cliente_email: usuario.email,
      }

      toast.success("¡Pedido creado exitosamente!")
      onOrderCreated(newOrder)
      onClose()
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Error al crear el pedido")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Datos del Cliente</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={customerData.nombre}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={customerData.telefono}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="300 123 4567"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Selecciona tus prendas</h3>

            <div className="grid grid-cols-2 gap-3">
              {clothingItems.map((item) => (
                <Card key={item.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{item.icon}</div>
                    <h4 className="font-medium text-slate-800 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">${item.price}</p>
                    <Button size="sm" onClick={() => addItem(item)} className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-medium text-slate-800 dark:text-white mb-3">Prendas seleccionadas:</h4>
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {item.name} x{item.quantity}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => removeItem(item.id)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Selecciona el servicio</h3>

            {serviciosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando servicios...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <Card
                    key={service.id_servicio}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedService === service.id_servicio.toString()
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedService(service.id_servicio.toString())}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-white">{service.nombre}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{service.descripcion || "Servicio de lavandería"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800 dark:text-white">
                          {service.precio_base > 0 ? `$${service.precio_base}` : "Incluido"}
                        </p>
                        {selectedService === service.id_servicio.toString() && <Check className="h-5 w-5 text-blue-500 ml-auto mt-1" />}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Programar recogida y entrega</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de recogida
                </label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de entrega
                </label>
                <input
                  type="datetime-local"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Dirección
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingresa tu dirección completa..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Resumen del pedido</h3>

            <Card className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white mb-2">Prendas:</h4>
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between text-sm">
                  <span>Servicio: {services.find((s) => s.id_servicio.toString() === selectedService)?.nombre}</span>
                  <span>+${services.find((s) => s.id_servicio.toString() === selectedService)?.precio_base || 0}</span>
                </div>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p>
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Recogida: {new Date(pickupDate).toLocaleString()}
                </p>
                <p>
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Entrega: {new Date(deliveryDate).toLocaleString()}
                </p>
                <p>
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Dirección: {address}
                </p>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Pedido</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-600 text-slate-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`w-8 h-1 mx-2 ${step > stepNumber ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          {renderStep()}

          {/* Actions */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : onClose())}>
              {step > 1 ? "Anterior" : "Cancelar"}
            </Button>

            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!customerData.nombre || !customerData.email)) ||
                  (step === 2 && selectedItems.length === 0) ||
                  (step === 3 && !selectedService) ||
                  (step === 4 && (!pickupDate || !deliveryDate || !address))
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={handleCreateOrder} 
                className="bg-green-500 hover:bg-green-600"
                disabled={createOrden.loading || createUsuario.loading}
              >
                {createOrden.loading || createUsuario.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Crear Pedido
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
