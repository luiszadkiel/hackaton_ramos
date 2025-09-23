# Configuración del Chat con Audio

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# API Keys para el sistema de chat con audio
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Opcional: Deepgram para STT alternativo
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

## Solución de ProblemasARDAD

### Error de FFmpeg en Windows
Si encuentras el error `spawn ffmpeg.exe ENOENT`, el sistema ahora usa una versión simplificada que envía el audio directamente a OpenAI sin conversión FFmpeg. Esto es más compatible con Windows y funciona para la mayoría de casos de uso.

### Archivos de Configuración
- **Desarrollo**: Usa `processAudioSimple.ts` (sin FFmpeg)
- **Producción**: Puedes usar `processAudio.ts` (con FFmpeg) si necesitas conversión de formatos específicos

## Cómo Obtener las API Keys

### 1. GROQ API Key
- Ve a [console.groq.com](https://console.groq.com)
- Crea una cuenta o inicia sesión
- Ve a "API Keys" y crea una nueva key
- Copia la key y pégala en `GROQ_API_KEY`

### 2. OpenAI API Key
- Ve a [platform.openai.com](https://platform.openai.com)
- Crea una cuenta o inicia sesión
- Ve a "API Keys" y crea una nueva key
- Copia la key y pégala en `OPENAI_API_KEY`

### 3. Deepgram API Key (Opcional)
- Ve a [deepgram.com](https://deepgram.com)
- Crea una cuenta o inicia sesión
- Ve a "API Keys" y crea una nueva key
- Copia la key y pégala en `DEEPGRAM_API_KEY`

## Funcionalidades Implementadas

### ✅ Grabación de Audio
- Grabación en tiempo real con el micrófono
- Formato WebM/Opus para máxima compatibilidad
- Visualización del tiempo de grabación
- Botones para pausar, reanudar y cancelar

### ✅ Procesamiento de Audio
- Conversión automática de WebM/Opus a WAV 16kHz mono
- Transcripción usando OpenAI Whisper
- Procesamiento con FFmpeg para compatibilidad

### ✅ Respuesta de Audio
- Generación de audio de respuesta usando Groq TTS
- Reproducción de audio con controles (play/pause/mute)
- Visualización del transcript del audio

### ✅ Interfaz de Usuario
- Componente de mensaje de audio con controles
- Preview de grabación antes de enviar
- Estados de carga y procesamiento
- Diseño responsive y accesible

## Uso

1. **Grabar Audio**: Haz clic en el botón del micrófono para empezar a grabar
2. **Enviar Audio**: Una vez grabado, haz clic en "Enviar" para procesar el audio
3. **Escuchar Respuesta**: El bot responderá con audio que puedes reproducir

## Estructura de Archivos

```
lib/audioChat/
├── processAudio.ts    # Procesamiento y transcripción de audio
├── groq.ts           # Integración con Groq para chat y TTS
└── wsServer.ts       # Servidor WebSocket (opcional)

app/api/chat-audio/
└── route.ts          # Endpoint HTTP para chat con audio

hooks/
└── useAudioRecorder.ts # Hook para manejo de grabación

components/
└── audio-message.tsx  # Componente para mostrar mensajes de audio
```

## Comandos de Prueba

### cURL - Multipart
```bash
curl -X POST http://localhost:3000/api/chat-audio \
  -F "file=@audio.webm" \
  --output reply.wav
```

### cURL - JSON con URL
```bash
curl -X POST http://localhost:3000/api/chat-audio \
  -H "Content-Type: application/json" \
  -d '{"audio_url":"https://example.com/audio.ogg"}' \
  --output reply.wav
```

## Notas Técnicas

- El sistema usa FFmpeg para conversión de audio
- OpenAI Whisper para transcripción de voz
- Groq TTS para generación de audio de respuesta
- Formato de audio optimizado para web (WebM/WAV)
- Manejo de errores y estados de carga
- Compatible con navegadores modernos
