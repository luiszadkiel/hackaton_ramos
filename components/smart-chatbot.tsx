"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function SmartChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente de PressTo Smart Laundry. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")

  const quickQuestions = [
    "¿Cuáles son sus horarios?",
    "¿Cuánto cuesta el lavado?",
    "¿Tienen promociones?",
    "¿Cómo funciona el delivery?",
  ]

  const botResponses: { [key: string]: string } = {
    horarios:
      "Nuestros horarios son de Lunes a Viernes: 7:00 AM - 9:00 PM, Sábados: 8:00 AM - 8:00 PM, Domingos: 9:00 AM - 6:00 PM",
    precio: "Nuestros precios son: Camisa $25, Pantalón $30, Vestido $45, Saco $50. ¡Tenemos descuentos por volumen!",
    promociones:
      "¡Tenemos promociones especiales! 20% de descuento en tu primer pedido y 3 lavadas = 1 gratis para clientes frecuentes.",
    delivery:
      "Nuestro servicio de delivery es gratuito en pedidos mayores a $200. Tiempo estimado: 2-4 horas según la zona.",
    default:
      "Gracias por tu pregunta. Un agente se pondrá en contacto contigo pronto para brindarte información más específica.",
  }

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simple AI response logic
    setTimeout(() => {
      let response = botResponses.default
      const text = inputText.toLowerCase()

      if (text.includes("horario") || text.includes("hora")) {
        response = botResponses.horarios
      } else if (text.includes("precio") || text.includes("cuesta") || text.includes("costo")) {
        response = botResponses.precio
      } else if (text.includes("promocion") || text.includes("descuento") || text.includes("oferta")) {
        response = botResponses.promociones
      } else if (text.includes("delivery") || text.includes("entrega") || text.includes("domicilio")) {
        response = botResponses.delivery
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputText("")
  }

  const handleQuickQuestion = (question: string) => {
    setInputText(question)
    sendMessage()
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
      <Card className="h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">Asistente PressTo</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = "/cliente/chat")}
              className="text-white hover:bg-blue-600"
              title="Abrir chat completo"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Preguntas frecuentes:</p>
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start text-xs bg-transparent"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
            />
            <Button onClick={sendMessage} size="icon" className="bg-blue-500 hover:bg-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
