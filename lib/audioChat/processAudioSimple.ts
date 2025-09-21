// /lib/audioChat/processAudioSimple.ts - Versión simplificada sin FFmpeg
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type STTProvider = "openai" | "deepgram";
type ProcessResult = { transcript: string; mime?: string };

export async function processAudio(
  inputBuffer: Buffer,
  mime: string | undefined,
  opts?: { provider?: STTProvider }
): Promise<ProcessResult> {
  // Para desarrollo, enviamos directamente el audio a OpenAI
  // OpenAI Whisper puede manejar varios formatos sin conversión
  const provider = opts?.provider ?? "openai";
  
  if (provider === "openai") {
    return await sttOpenAIDirect(inputBuffer, mime);
  } else {
    return await sttDeepgramDirect(inputBuffer, mime);
  }
}

// ====== STT PROVIDERS DIRECTOS ======
async function sttOpenAIDirect(buffer: Buffer, mime: string | undefined): Promise<ProcessResult> {
  const form = new FormData();
  
  // Determinar el tipo MIME correcto
  let fileType = "audio/webm";
  if (mime) {
    if (mime.includes("webm")) fileType = "audio/webm";
    else if (mime.includes("ogg")) fileType = "audio/ogg";
    else if (mime.includes("wav")) fileType = "audio/wav";
    else if (mime.includes("mp3")) fileType = "audio/mpeg";
    else if (mime.includes("mp4")) fileType = "audio/mp4";
    else fileType = "audio/webm"; // fallback
  }
  
  // Crear blob con el tipo correcto
  const blob = new Blob([buffer], { type: fileType });
  form.append("file", blob, "audio.webm");
  form.append("model", "whisper-1");

  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY!}` },
    body: form as any,
  });
  
  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`OpenAI STT failed: ${errorText}`);
  }
  
  const data = await r.json();
  return { transcript: data.text as string, mime: fileType };
}

async function sttDeepgramDirect(buffer: Buffer, mime: string | undefined): Promise<ProcessResult> {
  const contentType = mime || "audio/webm";
  
  const r = await fetch("https://api.deepgram.com/v1/listen?model=nova-2", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY!}`,
      "Content-Type": contentType,
    },
    body: buffer,
  });
  
  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Deepgram STT failed: ${errorText}`);
  }
  
  const data = await r.json();
  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  return { transcript, mime: contentType };
}


