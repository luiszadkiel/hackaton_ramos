// /lib/audioChat/processAudio.ts
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Configurar FFmpeg con la ruta correcta
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export type STTProvider = "openai" | "deepgram";
type ProcessResult = { transcript: string; mime?: string };

export async function processAudio(
  inputBuffer: Buffer,
  mime: string | undefined,
  opts?: { provider?: STTProvider }
): Promise<ProcessResult> {
  const needsWav =
    !mime || /ogg|webm|opus/i.test(mime);

  const tmpDir = path.join(process.cwd(), ".tmp");
  await fs.mkdir(tmpDir, { recursive: true });

  const inputFile = path.join(tmpDir, `${randomUUID()}`);
  const outputWav = path.join(tmpDir, `${randomUUID()}.wav`);
  await fs.writeFile(inputFile, inputBuffer);

  let fileForSTT = inputFile;
  let finalMime = mime;

  if (needsWav) {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputFile)
        .audioChannels(1)
        .audioFrequency(16000)
        .audioCodec("pcm_s16le")
        .format("wav")
        .output(outputWav)
        .on("end", () => resolve())
        .on("error", reject)
        .run();
    });
    fileForSTT = outputWav;
    finalMime = "audio/wav";
  }

  const provider = opts?.provider ?? "openai";
  const transcript =
    provider === "deepgram"
      ? await sttDeepgram(fileForSTT)
      : await sttOpenAI(fileForSTT);

  // Limpieza
  fs.unlink(inputFile).catch(() => {});
  if (fileForSTT !== inputFile) fs.unlink(fileForSTT).catch(() => {});

  return { transcript, mime: finalMime };
}

// ====== STT PROVIDERS ======
async function sttOpenAI(localPath: string): Promise<string> {
  const file = await fs.readFile(localPath);
  const form = new FormData();
  // @ts-ignore
  form.append("file", new Blob([file], { type: "audio/wav" }), "audio.wav");
  form.append("model", "whisper-1");

  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY!}` },
    body: form as any,
  });
  if (!r.ok) throw new Error(`OpenAI STT failed: ${await r.text()}`);
  const data = await r.json();
  return data.text as string;
}

async function sttDeepgram(localPath: string): Promise<string> {
  const file = await fs.readFile(localPath);
  const r = await fetch("https://api.deepgram.com/v1/listen?model=nova-2", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY!}`,
      "Content-Type": "audio/wav",
    },
    body: file,
  });
  if (!r.ok) throw new Error(`Deepgram STT failed: ${await r.text()}`);
  const data = await r.json();
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
}
