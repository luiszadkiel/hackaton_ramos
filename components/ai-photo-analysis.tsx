"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, AlertTriangle, CheckCircle, Zap } from "lucide-react"

interface StainAnalysis {
  type: string
  severity: "low" | "medium" | "high"
  treatment: string
  confidence: number
}

export default function AIPhotoAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<StainAnalysis[]>([])

  const mockAnalysis: StainAnalysis[] = [
    {
      type: "Mancha de grasa",
      severity: "medium",
      treatment: "Pre-tratamiento con desengrasante + lavado a 40°C",
      confidence: 92,
    },
    {
      type: "Mancha de sudor",
      severity: "low",
      treatment: "Lavado normal con detergente enzimático",
      confidence: 87,
    },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        analyzeImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)
    setAnalysis([])

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Zap className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Camera className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-slate-800 dark:text-white">Análisis AI de Manchas</h3>
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Beta</Badge>
      </div>

      {!selectedImage ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Sube una foto de la prenda para análisis automático de manchas
          </p>
          <label htmlFor="image-upload">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
              <Camera className="h-4 w-4 mr-2" />
              Subir Foto
            </Button>
          </label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Prenda para análisis"
              className="w-full h-48 object-cover rounded-lg"
            />
            {analysis.length > 0 && (
              <div className="absolute top-2 right-2 space-y-1">
                {analysis.map((stain, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 border-2 border-red-500 rounded-full bg-red-500/20 animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-600 dark:text-slate-300">Analizando imagen con IA...</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800 dark:text-white">Resultados del Análisis:</h4>
              {analysis.map((stain, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(stain.severity)}
                      <span className="font-medium text-slate-800 dark:text-white">{stain.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(stain.severity)}>
                        {stain.severity === "high" ? "Alta" : stain.severity === "medium" ? "Media" : "Baja"}
                      </Badge>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{stain.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <strong>Tratamiento recomendado:</strong> {stain.treatment}
                  </p>
                </div>
              ))}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Recomendación Final</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Basado en el análisis, recomendamos el servicio <strong>Premium Care</strong> con pre-tratamiento
                  especializado. Tiempo estimado: 24-48 horas.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedImage(null)
                setAnalysis([])
              }}
              className="flex-1"
            >
              Nueva Foto
            </Button>
            {analysis.length > 0 && (
              <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">Aplicar Tratamiento</Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
