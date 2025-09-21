export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { processAudio } from "@/lib/audioChat/processAudioSimple";
import { askGroq, ttsGroq } from "@/lib/audioChat/groq";

const SYSTEM_PROMPT = `# LavaSmart Assistant
Responde en frases cortas, claras y directas. Eres un asistente de servicio de lavandería especializado en PressTo.

## Servicios
- **Lavado Regular**: ropa diaria  
- **Lavado Delicado**: seda, lana, cashmere  
- **Lavado en Seco**: trajes, vestidos, abrigos  
- **Lavado Industrial**: uniformes, manteles, sábanas  
- **Lavado Express**: mismo día (+50%)  
- **Extras**: planchado, desmanchado, reparaciones, impermeabilización, almacenamiento  

## Precios Base
- Regular: $3/kg  
- Delicado: $5/kg  
- Seco: $8-15/prenda  
- Planchado: $2/prenda  
- Desmanchado: +$5/prenda  

## Entregas
- Regular: 24-48h  
- Express: 6-8h  
- Seco: 48-72h  

## Reglas de Respuesta
1. Saluda corto e identifícate.  
2. Pregunta solo lo necesario: prendas, cantidad, urgencia, extras, dirección.  
3. Cotiza con desglose breve.  
4. Para seguimiento: pide #orden y da estado rápido.  
5. Problemas: explica en 1-2 frases costo/proceso.  
6. Cierre: total, tiempo, #LAV-XXXX y gracias.  

## Horarios & Cobertura
- Lun-Vie 7-20h, Sáb 8-18h, Dom 9-14h  
- Centro gratis, Norte/Sur +$2, Periférica +$5  
- Políticas: seguro hasta $100/prenda, olvido 30 días, pagos varios  
`;

export async function POST(request: Request) {
  try {
    const ctype = request.headers.get("content-type") || "";
    let transcript: string | undefined;
    let fallbackText = "";
    let mimeFromFile = "";

    if (ctype.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      fallbackText = (form.get("message") as string) || "";
      if (!file && !fallbackText) {
        return NextResponse.json({ error: "falta file o message" }, { status: 400 });
      }
      if (file) {
        const buf = Buffer.from(await file.arrayBuffer());
        mimeFromFile = file.type || "application/octet-stream";
        const out = await processAudio(buf, mimeFromFile, { provider: "openai" });
        transcript = out.transcript;
      }
    } else if (ctype.includes("application/json")) {
      const body = await request.json();
      if (body.audio_url) {
        const r = await fetch(body.audio_url);
        if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 400 });
        const buf = Buffer.from(await r.arrayBuffer());
        const out = await processAudio(buf, r.headers.get("content-type") || undefined, { provider: "openai" });
        transcript = out.transcript;
      } else if (body.audio_base64) {
        const buf = Buffer.from(body.audio_base64, "base64");
        const out = await processAudio(buf, body.mime || "application/octet-stream", { provider: "openai" });
        transcript = out.transcript;
      } else if (body.message) {
        fallbackText = body.message;
      } else {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type no soportado" }, { status: 415 });
    }

    const userText = (transcript ?? fallbackText ?? "").trim();
    if (!userText) return NextResponse.json({ error: "Sin texto para Groq" }, { status: 400 });

    const reply = await askGroq(SYSTEM_PROMPT, userText);
    const audio = await ttsGroq(reply, "Fritz-PlayAI", "wav");

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "X-Transcript": encodeURIComponent(transcript ?? ""),
        "X-Reply-Text": encodeURIComponent(reply),
      },
    });
  } catch (e: any) {
    console.error("/api/chat-audio error:", e);
    return NextResponse.json({ error: "server_error", details: String(e?.message ?? e) }, { status: 500 });
  }
}
