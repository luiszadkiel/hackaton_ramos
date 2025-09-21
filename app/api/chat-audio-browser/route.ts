export const runtime = 'nodejs';

import { NextResponse } from "next/server";

// Función para obtener respuesta del agente de chat
async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chat-text`, {
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
    const body = await request.json();
    const { transcript } = body;
    
    if (!transcript) {
      return NextResponse.json({ error: "No se proporcionó transcripción" }, { status: 400 });
    }

    // Obtener respuesta del agente usando la transcripción real
    const replyText = await getChatResponse(transcript);
    
    return NextResponse.json({
      transcript: transcript,
      reply: replyText,
      success: true
    });

  } catch (e: any) {
    console.error("/api/chat-audio-browser error:", e);
    return NextResponse.json({ 
      error: "server_error", 
      details: String(e?.message ?? e) 
    }, { status: 500 });
  }
}
