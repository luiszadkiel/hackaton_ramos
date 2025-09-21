export const runtime = 'nodejs';

import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessage: string | undefined = body?.message;
    
    if (!userMessage) {
      return NextResponse.json({ error: "Falta 'message' en el body" }, { status: 400 });
    }

    const reply = generateDynamicResponse(userMessage);
    
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("/api/chat-text error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Error procesando el chat", details: message }, { status: 500 });
  }
}
