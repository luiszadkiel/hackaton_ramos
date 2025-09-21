export const runtime = 'nodejs';

import { NextResponse } from "next/server";

// Función para generar audio TTS usando un servicio gratuito
async function generateTTSAudio(text: string): Promise<ArrayBuffer> {
  try {
    // Usar Google Translate TTS (gratuito)
    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodedText}`;
    
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      return await response.arrayBuffer();
    } else {
      throw new Error('TTS service failed');
    }
  } catch (error) {
    console.error('Error generating TTS:', error);
    // Fallback: crear un audio de tono simple
    return generateToneAudio(text.length * 0.1); // Duración basada en longitud del texto
  }
}

// Función de fallback para generar un tono simple
function generateToneAudio(durationSeconds: number): ArrayBuffer {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // Generar un tono simple (440Hz - nota A)
  const frequency = 440;
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1; // Volumen bajo
    view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
  }
  
  return buffer;
}

// Función para generar respuestas dinámicas basadas en el contenido
function generateDynamicResponse(userText: string): string {
  const text = userText.toLowerCase();
  
  // Respuestas específicas para diferentes consultas
  if (text.includes('hola') || text.includes('buenos días') || text.includes('buenas tardes')) {
    return "¡Hola! Soy LavaSmart Assistant, tu asistente de lavandería. ¿En qué puedo ayudarte hoy?";
  }
  
  if (text.includes('precio') || text.includes('costo') || text.includes('cuánto cuesta')) {
    return "Nuestros precios son: Lavado regular 3 dólares por kilo, lavado delicado 5 dólares por kilo, y lavado en seco de 8 a 15 dólares por prenda. ¿Te interesa algún servicio específico?";
  }
  
  if (text.includes('servicio') || text.includes('lavado') || text.includes('lavandería')) {
    return "Ofrecemos lavado regular, delicado, en seco, industrial y express. También tenemos servicios adicionales como planchado, desmanchado y reparaciones. ¿Cuál te interesa?";
  }
  
  if (text.includes('tiempo') || text.includes('entrega') || text.includes('cuándo')) {
    return "Los tiempos de entrega son: lavado regular 24 a 48 horas, express 6 a 8 horas, y lavado en seco 48 a 72 horas. ¿Necesitas servicio express?";
  }
  
  if (text.includes('horario') || text.includes('hora') || text.includes('abierto')) {
    return "Estamos abiertos de lunes a viernes de 7 a 20 horas, sábados de 8 a 18 horas, y domingos de 9 a 14 horas. ¿En qué horario te conviene?";
  }
  
  if (text.includes('dirección') || text.includes('ubicación') || text.includes('dónde')) {
    return "Ofrecemos recogida y entrega a domicilio. El centro es gratis, norte y sur tienen costo adicional de 2 dólares, y periférica 5 dólares. ¿Cuál es tu zona?";
  }
  
  if (text.includes('pedido') || text.includes('orden') || text.includes('seguimiento')) {
    return "Para hacer seguimiento de tu pedido, necesito el número de orden. ¿Tienes el número de tu pedido?";
  }
  
  if (text.includes('gracias') || text.includes('muchas gracias')) {
    return "¡De nada! Estoy aquí para ayudarte con todos tus servicios de lavandería. ¿Hay algo más en lo que pueda asistirte?";
  }
  
  if (text.includes('adiós') || text.includes('hasta luego') || text.includes('chao')) {
    return "¡Hasta luego! Que tengas un excelente día. Recuerda que estoy aquí cuando necesites servicios de lavandería.";
  }
  
  // Respuesta por defecto
  return `Entiendo que dices: "${userText}". Como asistente de lavandería, puedo ayudarte con información sobre precios, servicios, horarios, entregas y seguimiento de pedidos. ¿Sobre qué te gustaría saber más?`;
}

// Endpoint de prueba que simula respuestas sin usar API keys reales
export async function POST(request: Request) {
  try {
    const ctype = request.headers.get("content-type") || "";
    
    let transcript = "";
    let fallbackText = "";

    if (ctype.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      fallbackText = (form.get("message") as string) || "";
      
      if (file) {
        // Simular transcripción basada en el tamaño del archivo y timestamp
        // En un sistema real, aquí se procesaría el audio con STT
        const fileSize = file.size;
        const timestamp = Date.now();
        
        // Generar transcripciones variadas basadas en el tamaño del archivo
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
          "¿Dónde están ubicados?"
        ];
        
        // Usar el tamaño del archivo para seleccionar una transcripción
        const index = Math.floor((fileSize + timestamp) % transcriptions.length);
        transcript = transcriptions[index];
      }
    } else if (ctype.includes("application/json")) {
      const body = await request.json();
      if (body.message) {
        fallbackText = body.message;
      }
    }

    const userText = (transcript || fallbackText || "Hola").trim();
    
    // Generar respuesta dinámica basada en el contenido
    const reply = generateDynamicResponse(userText);

    // Generar audio usando un servicio TTS gratuito
    const audioBuffer = await generateTTSAudio(reply);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "X-Transcript": encodeURIComponent(transcript),
        "X-Reply-Text": encodeURIComponent(reply),
      },
    });
  } catch (e: any) {
    console.error("/api/chat-audio-test error:", e);
    return NextResponse.json({ error: "server_error", details: String(e?.message ?? e) }, { status: 500 });
  }
}
