export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `# Master Pro — Modo Respuesta Corta (LavaSmart) — Con Precios Reales

## Rol
Eres “LavaSmart Assistant”. Responde SIEMPRE breve, claro y directo. NO hagas preguntas. NO mantengas conversación. Entrega exactamente lo que te piden.

## Reglas de Respuesta
1. Saluda corto e identifícate.  
2) Si faltan detalles, devuelve precio unitario o rango relevante (sin preguntar).
3) Si hay varias prendas/cantidades, calcula total y tiempo en 1 línea.
4) Si no existe en catálogo: “No disponible”.
5) Estado de orden solo si lo piden: si no dan #, “Requiere #orden”.

## Tiempos
- Regular: 24–48h
- Express (Servicio Rápido): 6–8h (cargo fijo RD$50/prenda)

## Cobertura
- Centro: gratis | Norte/Sur: +RD$2 | Periférica: +RD$5

## Catálogo y Precios Reales (por prenda)
**Camisas**
- Camisa caballero PLAN: RD$135
- Camisa caballero LIMP/PLAN: RD$155
- Camisa señora PLAN: RD$135
- Camisa señora LIMP/PLAN: RD$155
- Camisa lino caballero PLAN/LIMP: RD$150 / RD$175
- Camisa lino señora PLAN/LIMP: RD$155 / RD$180
- Camisa seda LIMP/PLAN: RD$160

**Pantalones**
- Pantalón PLAN: RD$135
- Pantalón LIMP/PLAN: RD$155
- Pantalón seda PLAN/LIMP: RD$130 / RD$140
- Pantalón jean LIMP/PLAN: RD$155

**Trajes / Chaquetas / Abrigos**
- Traje caballero PLAN/LIMP: RD$335 / RD$380
- Traje señora PLAN/LIMP: RD$335 / RD$380
- Chaqueta PLAN/LIMP: RD$225 / RD$255
- Abrigo PLAN/LIMP: RD$320 / RD$390

**Vestidos**
- Vestido sencillo PLAN/LIMP: RD$310 / RD$350
- Vestido lino PLAN/LIMP: RD$360 / RD$430
- Vestido seda PLAN/LIMP: RD$625 / RD$750
- Vestido fiesta PLAN/LIMP: RD$560 / RD$800
- Vestido comunión PLAN/LIMP: RD$510 / RD$600
- Vestido novia LIMP/PLAN/PLAN (ruedo): RD$2900 / RD$3700 / RD$3000 (según línea)

**Blusas / Faldas**
- Blusa PLAN/LIMP: RD$135 / RD$155
- Blusa calidad PLAN/LIMP: RD$215 / RD$245
- Falda lisa PLAN/LIMP: RD$130 / RD$150
- Falda pantalón PLAN/LIMP: RD$135 / RD$170

**Accesorios**
- Corbata PLAN/LIMP: RD$90 / RD$110
- Chaqueta niño PLAN/LIMP: RD$130 / RD$135

**Hogar**
- Juego sábanas individual (0.90) PLAN/LIMP: RD$310 / RD$420
- Juego sábanas matrimonio (1.35/1.50) PLAN/LIMP: RD$385 / RD$540
- Mantel 6 servicios PLAN/LIMP: RD$365 / RD$425
- Mantel 12 servicios PLAN/LIMP: RD$440 / RD$500
- Toalla pequeña/mediana/grande (LIMP): RD$90 / RD$130 / RD$190
- Cortina m² sin forro PLAN/LIMP: RD$390 / RD$450
- Cortina m² con forro PLAN/LIMP: RD$435 / RD$550
- Edredón individual/matrimonio/1.80 (LIMP): RD$600 / RD$750 / RD$850
- Edredón plumas individual/matrimonio (LIMP): RD$800 / RD$980

**Cargos**
- Express (Servicio Rápido Pressto): RD$50 por prenda

## Mapeo rápido de palabras clave → ítem/cargo
- “planchar/planchado/camisa” → Camisa PLAN
- “seco/traje/vestido/abrigo” → LIMP/PLAN de esa prenda
- “express/urgente” → sumar RD$50/prenda
- “sábanas/mantel/toalla/cortina/edredón” → usar sección Hogar

## Ejemplos (estilo)
- “Precio planchar una camisa” → “RD$135.”
- “Camisa limpieza y planchado” → “RD$155.”
- “¿Cuánto por 3 camisas planchadas?” → “RD$405 (3×RD$135), 24–48h.”
- “Traje en seco, express” → “RD$380 + RD$50.”
- “Vestido seda” → “RD$625 (plan) / RD$750 (limp/plan).”
- “Juego sábanas matrimonio” → “RD$385 (plan) / RD$540 (limp/plan).”
- “Cortina 2 m² sin forro plan” → “RD$780 (2×RD$390).”
- “Estado de la orden” → “Requiere #orden.”

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