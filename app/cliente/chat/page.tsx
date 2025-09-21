"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Bot, User, Camera, Mic, MicOff, ImageIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useTextToSpeech } from "@/hooks/useTextToSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { AudioMessage } from "@/components/audio-message"
import { TextMessage } from "@/components/text-message"

interface Message {
  id: string
  text?: string
  audioUrl?: string
  sender: "user" | "bot"
  timestamp: Date
  transcript?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    formatTime,
  } = useAudioRecorder()

  const { speak, stop: stopTTS } = useTextToSpeech()
  
  const {
    isListening: isTranscribing,
    transcript: speechTranscript,
    isSupported: speechSupported,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    resetTranscript: resetSpeechTranscript,
  } = useSpeechRecognition()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Sin polling: ahora usamos /api/chat (Groq)

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    try {
      const res = await fetch("/api/chat-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      })
      if (res.ok) {
        const data = await res.json()
        const botMessage: Message = {
          id: `${Date.now()}`,
          text: data?.message ?? "",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        
        // NO usar TTS automático para mensajes de texto
      }
    } catch (e) {
      console.error("Error llamando /api/chat:", e)
    }
  }

  const sendAudioMessage = async () => {
    if (!audioBlob) return

    setIsProcessingAudio(true)
    
    // Crear una copia del audio URL para el mensaje del usuario
    const userAudioUrl = audioUrl ? URL.createObjectURL(audioBlob) : undefined
    
    const userMessage: Message = {
      id: Date.now().toString(),
      audioUrl: userAudioUrl,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    resetRecording()

    try {
      // Usar el endpoint simple que funciona
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')

      console.log('Enviando audio al servidor...')
      const res = await fetch("/api/chat-audio-debug", {
        method: "POST",
        body: formData,
      })

      console.log('Respuesta del servidor:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Datos recibidos:', data)
        
        const transcript = data.transcript || ''
        const replyText = data.reply || ''
        
        console.log('Transcripción:', transcript)
        console.log('Respuesta del bot:', replyText)

        // Mostrar la transcripción del audio del usuario
        const userTranscriptMessage: Message = {
          id: `${Date.now()}-transcript`,
          text: `🎤 ${transcript}`,
          sender: "user",
          timestamp: new Date(),
        }

        console.log('Agregando mensaje de transcripción:', userTranscriptMessage)

        const botMessage: Message = {
          id: `${Date.now()}`,
          text: replyText,
          sender: "bot",
          timestamp: new Date(),
          transcript: transcript,
        }
        
        console.log('Agregando mensaje del bot:', botMessage)
        
        setMessages((prev) => {
          console.log('Mensajes anteriores:', prev.length)
          const newMessages = [...prev, userTranscriptMessage, botMessage]
          console.log('Nuevos mensajes:', newMessages.length)
          return newMessages
        })
        
        // Usar TTS del navegador para reproducir la respuesta
        if (replyText) {
          console.log('Reproduciendo TTS:', replyText)
          speak(replyText, { rate: 0.9, pitch: 1, volume: 1 })
        } else {
          console.log('No hay texto para reproducir')
        }
      } else {
        const errorText = await res.text()
        console.error('Error del servidor:', errorText)
        
        // Si hay error, mostrar mensaje de error
        const errorMessage: Message = {
          id: `${Date.now()}`,
          text: `Error del servidor: ${res.status}. ${errorText}`,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error: any) {
      console.error("Error enviando audio:", error)
      const errorMessage: Message = {
        id: `${Date.now()}`,
        text: `Error de conexión: ${error.message}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessingAudio(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
  }

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      try {
        await startRecording()
      } catch (error) {
        console.error('Error starting recording:', error)
        alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.')
      }
    }
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
          <div className="flex flex-col space-y-1">
            {message.audioUrl && isUser ? (
              <AudioMessage 
                audioUrl={message.audioUrl}
                isUser={isUser}
                timestamp={message.timestamp}
                transcript={message.transcript}
              />
            ) : (
              <TextMessage
                text={message.text || ""}
                isUser={isUser}
                timestamp={message.timestamp}
                onSpeak={!isUser ? (text) => speak(text, { rate: 0.9, pitch: 1, volume: 1 }) : undefined}
                onStop={!isUser ? stopTTS : undefined}
              />
            )}
            
            <div className="flex items-center justify-between">
              <span className={`text-xs opacity-70 ${isUser ? "text-right" : "text-left"}`}>
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

        

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        {/* Audio Recording Preview */}
        {audioUrl && (
          <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Grabación de audio</p>
                  <p className="text-xs text-slate-500">{formatTime(recordingTime)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetRecording}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={sendAudioMessage}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isProcessingAudio}
                >
                  {isProcessingAudio ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceRecording}
            className={isRecording ? "bg-red-100 text-red-600" : ""}
            disabled={isProcessingAudio}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pregúntame sobre tu ropa, pedidos, cuidados..."
              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              disabled={isProcessingAudio}
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={sendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            disabled={!inputText.trim() || isProcessingAudio}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isRecording && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Grabando... {formatTime(recordingTime)}</span>
            </div>
          </div>
        )}

        {isProcessingAudio && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Procesando audio...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
