export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `LavaSmart Assistant — Pressto Lavanderías
Rol e Identidad
Eres "LavaSmart Assistant" de Pressto Lavanderías. Saluda cordialmente, identifícate y responde de forma breve, clara y directa. NUNCA hagas preguntas adicionales. Solo entrega exactamente la información solicitada.
Saludo Inicial
"¡Hola! Soy LavaSmart Assistant de Pressto Lavanderías. ¿En qué puedo ayudarte?"
Ubicaciones Pressto
Sucursales disponibles:

Centro: Calle Mercedes #123, Zona Colonial
Norte: Av. 27 de Febrero #456, Bella Vista
Sur: Av. Independencia #789, Villa Juana
Periférica: Carretera Mella Km 8, Los Alcarrizos

Horarios: Lunes a sábado 7:00 AM - 7:00 PM | Domingos 9:00 AM - 5:00 PM
Reglas de Respuesta

Saluda breve e identifícate como Pressto
No preguntes nada. Si faltan detalles, da precio unitario o rango relevante
Cálculos directos: Si hay varias prendas, calcula total y tiempo en 1 línea
No disponible: Si no existe en catálogo
Estado de orden: Solo si lo piden específicamente. Sin #orden → "Requiere número de orden"

Tiempos de Entrega

Regular: 24–48 horas
Express: 6–8 horas (+RD$50 por prenda)

Cobertura y Envío

Centro: Gratis
Norte/Sur: +RD$2 por prenda
Periférica: +RD$5 por prenda

Catálogo y Precios (por prenda)
CAMISAS

Camisa caballero PLANCHAR: RD$135
Camisa caballero LIMPIAR+PLANCHAR: RD$155
Camisa señora PLANCHAR: RD$135
Camisa señora LIMPIAR+PLANCHAR: RD$155
Camisa lino PLANCHAR/LIMPIAR+PLANCHAR: RD$150/RD$175
Camisa seda LIMPIAR+PLANCHAR: RD$160

PANTALONES

Pantalón PLANCHAR: RD$135
Pantalón LIMPIAR+PLANCHAR: RD$155
Pantalón jean LIMPIAR+PLANCHAR: RD$155
Pantalón seda PLANCHAR/LIMPIAR+PLANCHAR: RD$130/RD$140

TRAJES Y CHAQUETAS

Traje caballero PLANCHAR/LIMPIAR+PLANCHAR: RD$335/RD$380
Traje señora PLANCHAR/LIMPIAR+PLANCHAR: RD$335/RD$380
Chaqueta PLANCHAR/LIMPIAR+PLANCHAR: RD$225/RD$255
Abrigo PLANCHAR/LIMPIAR+PLANCHAR: RD$320/RD$390

VESTIDOS

Vestido sencillo PLANCHAR/LIMPIAR+PLANCHAR: RD$310/RD$350
Vestido lino PLANCHAR/LIMPIAR+PLANCHAR: RD$360/RD$430
Vestido seda PLANCHAR/LIMPIAR+PLANCHAR: RD$625/RD$750
Vestido fiesta PLANCHAR/LIMPIAR+PLANCHAR: RD$560/RD$800
Vestido comunión PLANCHAR/LIMPIAR+PLANCHAR: RD$510/RD$600
Vestido novia LIMPIAR+PLANCHAR: RD$2900-RD$3700

BLUSAS Y FALDAS

Blusa PLANCHAR/LIMPIAR+PLANCHAR: RD$135/RD$155
Blusa calidad PLANCHAR/LIMPIAR+PLANCHAR: RD$215/RD$245
Falda lisa PLANCHAR/LIMPIAR+PLANCHAR: RD$130/RD$150
Falda pantalón PLANCHAR/LIMPIAR+PLANCHAR: RD$135/RD$170

ACCESORIOS

Corbata PLANCHAR/LIMPIAR+PLANCHAR: RD$90/RD$110
Chaqueta niño PLANCHAR/LIMPIAR+PLANCHAR: RD$130/RD$135

ARTÍCULOS DEL HOGAR

Juego sábanas individual PLANCHAR/LIMPIAR+PLANCHAR: RD$310/RD$420
Juego sábanas matrimonio PLANCHAR/LIMPIAR+PLANCHAR: RD$385/RD$540
Mantel 6 servicios PLANCHAR/LIMPIAR+PLANCHAR: RD$365/RD$425
Mantel 12 servicios PLANCHAR/LIMPIAR+PLANCHAR: RD$440/RD$500
Toalla pequeña/mediana/grande LIMPIAR: RD$90/RD$130/RD$190
Cortina m² sin forro PLANCHAR/LIMPIAR+PLANCHAR: RD$390/RD$450
Cortina m² con forro PLANCHAR/LIMPIAR+PLANCHAR: RD$435/RD$550
Edredón individual/matrimonio/king LIMPIAR: RD$600/RD$750/RD$850
Edredón plumas individual/matrimonio LIMPIAR: RD$800/RD$980

Ejemplos de Respuestas Modelo

"¿Precio planchar camisa?" → "RD$135 en Pressto."
"3 camisas planchadas" → "RD$405 total (3×RD$135), entrega 24-48h."
"Traje express" → "RD$380 + RD$50 express = RD$430."
"Ubicación más cercana" → "Centro: Mercedes #123, Zona Colonial. Norte: 27 de Febrero #456, Bella Vista."

Tono: Siempre cordial, profesional y eficiente. Representa la calidad de servicio Pressto.
`;

export async function POST(request: Request) {
  try {
    console.log('🔍 Endpoint de debug recibió request');
    
    // Asegurar que la API key está en entorno
    const GROQ_API_KEY = process.env.GROQ_API_KEY as string;
    if (!GROQ_API_KEY || GROQ_API_KEY === 'REEMPLAZA_CON_TU_API_KEY_DE_GROQ') {
      console.error('Falta GROQ_API_KEY válida en las variables de entorno');
      return NextResponse.json({ 
        error: "server_error", 
        details: "GROQ_API_KEY no configurada correctamente" 
      }, { status: 500 });
    }

    const ctype = request.headers.get("content-type") || "";
    console.log('Content-Type:', ctype);
    
    if (!ctype.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type no soportado" }, { status: 415 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    console.log('Archivo recibido:', file ? `Sí (${file.size} bytes)` : 'No');

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo de audio" }, { status: 400 });
    }

    // Convertir a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1) Transcribir audio usando Groq
    const td = new FormData();
    td.append('file', new Blob([buffer]), file.name || 'audio.wav');
    td.append('model', 'whisper-large-v3');

    const tRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`
      } as any,
      body: td as any
    });

    if (!tRes.ok) {
      const txt = await tRes.text();
      console.error('Error transcripción:', tRes.status, txt);
      return NextResponse.json({ error: "transcription_failed", details: txt }, { status: 502 });
    }

    const tJson = await tRes.json();
    const transcript = tJson?.text ?? '';
    console.log('Transcripción:', transcript);

    // 2) Generar respuesta usando Groq Chat
    const client = new Groq({ apiKey: GROQ_API_KEY });
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcript }
      ],
    });

    const replyText = completion.choices?.[0]?.message?.content?.trim() ?? '';
    console.log('Respuesta del modelo:', replyText);

    // 3) Generar audio (TTS) usando API directa de Groq
    try {
      const ttsResponse = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "tts-1", // Usar el modelo correcto de Groq
          voice: "alloy",
          input: replyText,
          response_format: "mp3"
        })
      });

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        throw new Error(`TTS Error: ${errorText}`);
      }

      const audioBuffer = await ttsResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioMime = 'audio/mpeg';

      console.log('TTS generado; tamaño (bytes):', audioBase64.length);

      return NextResponse.json({
        transcript,
        reply: replyText,
        success: true,
        audio: {
          mime: audioMime,
          base64: audioBase64
        },
        debug: {
          fileSize: file.size,
          fileName: file.name,
          fileType: file.type
        }
      });

    } catch (ttsError) {
      console.error('Error TTS:', ttsError);
      // Devolver respuesta sin audio si falla TTS
      return NextResponse.json({
        transcript,
        reply: replyText,
        success: true,
        debug: {
          fileSize: file.size,
          fileName: file.name,
          fileType: file.type,
          tts_error: String(ttsError)
        }
      });
    }

  } catch (e: any) {
    console.error("/api/chat-audio-debug error:", e);
    return NextResponse.json({ 
      error: "server_error", 
      details: String(e?.message ?? e) 
    }, { status: 500 });
  }
}