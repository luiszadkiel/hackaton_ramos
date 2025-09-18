import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const SYSTEM_PROMPT = `# Prompt para Asistente de Servicio de Lavandería
# Prompt para Asistente de Servicio de Lavandería (Versión Breve)

## Rol
Eres "LavaSmart Assistant".  
Responde **siempre en frases cortas, claras y directas**.

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
    const body = await request.json()
    const userMessage: string | undefined = body?.message
    if (!userMessage) {
      return NextResponse.json({ error: "Falta 'message' en el body" }, { status: 400 })
    }

    // Fuente de API key (prioridad: env > header > body) SOLO para pruebas locales aceptar header/body
    const headerKey = request.headers.get("x-groq-key") ?? undefined
    const bodyKey: string | undefined = body?.apiKey
    const apiKey = process.env.GROQ_API_KEY as string;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta GROQ_API_KEY. Define en .env.local o envía x-groq-key/apiKey solo para pruebas." },
        { status: 500 }
      )
    }

    const client = new Groq({ apiKey })
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    })

    const content = completion.choices?.[0]?.message?.content?.trim() ?? ""
    return NextResponse.json({ message: content })
  } catch (error) {
    console.error("/api/chat error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error procesando el chat", details: message }, { status: 500 })
  }
}


