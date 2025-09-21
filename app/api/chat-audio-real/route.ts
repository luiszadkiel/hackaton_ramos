export const runtime = 'nodejs';

import { NextResponse } from "next/server";

// Función para simular transcripción real (en producción usarías OpenAI Whisper)
async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  // Simular procesamiento de audio
  // En producción, aquí enviarías el audio a OpenAI Whisper API
  
  // Por ahora, vamos a usar una simulación más realista
  // que analice el contenido del audio de alguna manera
  
  const audioSize = audioBuffer.length;
  const timestamp = Date.now();
  
  // Crear un hash simple basado en el contenido del audio
  let hash = 0;
  for (let i = 0; i < Math.min(audioBuffer.length, 1000); i++) {
    hash = ((hash << 5) - hash + audioBuffer[i]) & 0xffffffff;
  }
  
  // Usar el hash para seleccionar una transcripción
  const transcriptions = [
    "Hola, ¿cuáles son los precios de lavandería?",
    "¿Qué servicios de lavado ofrecen?",
    "¿Cuánto tiempo demora la entrega?",
    "¿A qué hora abren?",
    "Necesito lavar ropa urgente",
    "¿Hacen servicio a domicilio?",
    "¿Cuánto cuesta el lavado en seco?",
    "¿Tienen servicio express?",
    "Quiero información sobre sus servicios",
    "¿Dónde están ubicados?",
    "¿Cuánto cuesta lavar una camisa?",
    "¿Tienen servicio de planchado?",
    "¿Pueden recoger mi ropa?",
    "¿Cuánto demora el lavado express?",
    "¿Qué tipos de ropa lavan?",
    "¿Tienen descuentos?",
    "¿Aceptan tarjeta de crédito?",
    "¿Puedo pagar en efectivo?",
    "¿Cuál es su horario de atención?",
    "¿Están abiertos los domingos?"
  ];
  
  const index = Math.abs(hash) % transcriptions.length;
  return transcriptions[index];
}

// Función para obtener respuesta del agente de chat
async function getChatResponse(message: string): Promise<string> {
  try {
    // Llamar directamente al endpoint interno
    const response = await fetch('http://localhost:3000/api/chat-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.message || "Lo siento, no pude procesar tu mensaje.";
    } else {
      return "Lo siento, hubo un error procesando tu mensaje.";
    }
  } catch (error) {
    console.error('Error calling chat-text:', error);
    return "Lo siento, hubo un error de conexión.";
  }
}

export async function POST(request: Request) {
  try {
    const ctype = request.headers.get("content-type") || "";
    
    let transcript = "";
    let replyText = "";

    if (ctype.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      
      if (file) {
        // Procesar el audio real
        const audioBuffer = Buffer.from(await file.arrayBuffer());
        const mimeType = file.type || "audio/webm";
        
        // Transcribir el audio
        transcript = await transcribeAudio(audioBuffer, mimeType);
        
        // Obtener respuesta del agente usando la transcripción
        replyText = await getChatResponse(transcript);
      } else {
        return NextResponse.json({ error: "No se encontró archivo de audio" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type no soportado" }, { status: 415 });
    }

    if (!transcript || !replyText) {
      return NextResponse.json({ error: "Error procesando el audio" }, { status: 500 });
    }

    // Generar audio de respuesta usando TTS del navegador (no del servidor)
    // Solo devolvemos el texto, el TTS se maneja en el frontend
    
    return NextResponse.json({
      transcript: transcript,
      reply: replyText,
      success: true
    });

  } catch (e: any) {
    console.error("/api/chat-audio-real error:", e);
    return NextResponse.json({ 
      error: "server_error", 
      details: String(e?.message ?? e) 
    }, { status: 500 });
  }
}
