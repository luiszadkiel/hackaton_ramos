export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log('🔍 Endpoint de debug recibió request');
    
    const ctype = request.headers.get("content-type") || "";
    console.log('Content-Type:', ctype);
    
    if (ctype.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      
      console.log('Archivo recibido:', file ? `Sí (${file.size} bytes)` : 'No');
      
      if (file) {
        // Respuesta fija para debug
        const transcript = "¿Cuánto tiempo demora la entrega?";
        const replyText = "Los tiempos de entrega son: lavado regular 24 a 48 horas, express 6 a 8 horas, y lavado en seco 48 a 72 horas. ¿Necesitas servicio express?";
        
        console.log('Devolviendo respuesta:', { transcript, replyText });
        
        return NextResponse.json({
          transcript: transcript,
          reply: replyText,
          success: true,
          debug: {
            fileSize: file.size,
            fileName: file.name,
            fileType: file.type
          }
        });
      } else {
        return NextResponse.json({ error: "No se encontró archivo de audio" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type no soportado" }, { status: 415 });
    }

  } catch (e: any) {
    console.error("/api/chat-audio-debug error:", e);
    return NextResponse.json({ 
      error: "server_error", 
      details: String(e?.message ?? e) 
    }, { status: 500 });
  }
}
