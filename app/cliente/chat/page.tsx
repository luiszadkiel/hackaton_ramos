"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Bot, User, Package, Clock, Camera, Mic, MicOff, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "suggestion" | "order" | "image"
  data?: any
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente personal de lavandería. Puedo ayudarte con información sobre tus prendas, cuidados especiales, seguimiento de pedidos y mucho más. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickSuggestions = [
    "¿Cómo cuidar mi camisa de seda?",
    "¿Cuándo estará listo mi pedido?",
    "¿Qué productos usan para lavar?",
    "¿Pueden quitar esta mancha?",
    "¿Cuáles son sus precios?",
    "¿Hacen delivery los domingos?",
  ]

  const clothingCareResponses: { [key: string]: string } = {
    seda: "Para prendas de seda recomendamos lavado en seco profesional. La seda es delicada y puede dañarse con agua. Usamos solventes especiales que mantienen la textura y brillo natural.",
    algodon:
      "El algodón es resistente y se puede lavar con agua. Recomendamos agua tibia (30-40°C) y secado natural para evitar encogimiento.",
    lana: "La lana requiere cuidado especial. Usamos lavado en seco o lavado a mano con agua fría y detergentes específicos para lana.",
    lino: "El lino se puede lavar con agua, pero tiende a arrugarse. Lo planchamos mientras está ligeramente húmedo para mejores resultados.",
    cuero:
      "Para prendas de cuero ofrecemos limpieza especializada con productos específicos que nutren y protegen el material.",
    manchas:
      "Dependiendo del tipo de mancha, usamos diferentes tratamientos. Las manchas de grasa requieren desengrasantes, las de sangre agua fría, etc.",
  }

  const generateBotResponse = (userMessage: string): Message => {
    const text = userMessage.toLowerCase()
    let response = ""
    let type: "text" | "suggestion" | "order" = "text"
    let data: any = null

    // Respuestas sobre cuidado de prendas
    if (text.includes("seda")) {
      response = clothingCareResponses.seda
    } else if (text.includes("algodón") || text.includes("algodon")) {
      response = clothingCareResponses.algodon
    } else if (text.includes("lana")) {
      response = clothingCareResponses.lana
    } else if (text.includes("lino")) {
      response = clothingCareResponses.lino
    } else if (text.includes("cuero")) {
      response = clothingCareResponses.cuero
    } else if (text.includes("mancha")) {
      response = clothingCareResponses.manchas
    }
    // Respuestas sobre pedidos
    else if (text.includes("pedido") || text.includes("orden")) {
      response =
        "Tu pedido #12345 está actualmente en proceso de secado. Tiempo estimado de finalización: 2 horas. ¿Te gustaría ver el seguimiento completo?"
      type = "order"
      data = {
        orderId: "#12345",
        status: "Secando",
        eta: "2 horas",
        items: ["2 camisas", "1 pantalón"],
      }
    }
    // Respuestas sobre precios
    else if (text.includes("precio") || text.includes("costo") || text.includes("cuanto")) {
      response =
        "Nuestros precios son: Camisa $25, Pantalón $30, Vestido $45, Saco $50, Ropa de cama $35. ¡Tenemos descuentos por volumen y para clientes frecuentes!"
    }
    // Respuestas sobre horarios y delivery
    else if (text.includes("horario") || text.includes("domingo") || text.includes("delivery")) {
      response =
        "Nuestro servicio de delivery funciona de Lunes a Sábado de 8:00 AM a 8:00 PM. Los domingos solo recolectamos pedidos urgentes con recargo del 20%."
    }
    // Respuestas sobre productos
    else if (text.includes("producto") || text.includes("detergente") || text.includes("químico")) {
      response =
        "Usamos productos ecológicos y biodegradables. Para prendas delicadas utilizamos detergentes especializados sin químicos agresivos. Todos nuestros productos son seguros para la piel."
    }
    // Respuesta por defecto
    else {
      response =
        "Entiendo tu consulta. Para brindarte la mejor ayuda, ¿podrías ser más específico? Puedo ayudarte con cuidado de prendas, seguimiento de pedidos, precios, horarios y más."
      type = "suggestion"
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
      type,
      data,
    }
  }

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simular respuesta del bot con delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
  }

  const toggleVoiceRecording = () => {
    setIsListening(!isListening)
    // Aquí se implementaría la funcionalidad de reconocimiento de voz
  }

  const renderMessage = (message: Message) => {
    const isUser = message.sender === "user"

    return (
      <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600"
            }`}
          >
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>

            {/* Order Information Card */}
            {message.type === "order" && message.data && (
              <Card className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs">Pedido {message.data.orderId}</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">{message.data.status}</Badge>
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Package className="h-3 w-3" />
                    <span>{message.data.items.join(", ")}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {message.data.eta}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-2 text-xs" onClick={() => router.push("/cliente/pedidos")}>
                  Ver Seguimiento Completo
                </Button>
              </Card>
            )}

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-800 dark:text-white">Asistente PressTo</h1>
                <p className="text-xs text-green-500">En línea</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.map(renderMessage)}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-2xl px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Preguntas frecuentes:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start text-sm bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceRecording}
            className={isListening ? "bg-red-100 text-red-600" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pregúntame sobre tu ropa, pedidos, cuidados..."
              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              disabled={isTyping}
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={sendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            disabled={!inputText.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isListening && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Escuchando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
