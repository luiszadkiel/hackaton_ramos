// /lib/audioChat/wsServer.ts
import { WebSocketServer, WebSocket } from "ws";
import { processAudio } from "./processAudio";
import { askGroq, ttsGroq } from "./groq";

type Msg =
  | { type: "start"; mime?: string; system?: string }
  | { type: "chunk"; data: string } // base64 chunk
  | { type: "end" };

export function createAudioChatWSServer(opts: { port?: number; defaultSystemPrompt: string }) {
  const wss = new WebSocketServer({ port: opts.port ?? 8081 });
  console.log(`[WS] audio-chat listo en ws://localhost:${opts.port ?? 8081}`);

  wss.on("connection", (ws: WebSocket) => {
    let chunks: Buffer[] = [];
    let mime = "audio/webm";
    let systemPrompt = opts.defaultSystemPrompt;

    ws.on("message", async (raw) => {
      try {
        const msg: Msg = JSON.parse(raw.toString());

        if (msg.type === "start") {
          mime = msg.mime ?? "audio/webm";
          systemPrompt = msg.system ?? systemPrompt;
          ws.send(JSON.stringify({ type: "ack", stage: "start" }));
        }

        if (msg.type === "chunk") {
          chunks.push(Buffer.from(msg.data, "base64"));
          if (chunks.length % 8 === 0) ws.send(JSON.stringify({ type: "ack", n: chunks.length }));
        }

        if (msg.type === "end") {
          const buf = Buffer.concat(chunks);
          ws.send(JSON.stringify({ type: "status", message: "transcribing" }));
          const { transcript } = await processAudio(buf, mime, { provider: "openai" });

          ws.send(JSON.stringify({ type: "status", message: "asking_groq", transcript }));
          const replyText = await askGroq(systemPrompt, transcript || "(audio sin contenido)");

          ws.send(JSON.stringify({ type: "status", message: "tts" }));
          const audio = await ttsGroq(replyText, "Fritz-PlayAI", "wav");
          ws.send(JSON.stringify({
            type: "result",
            transcript,
            reply: replyText,
            audioFormat: "wav",
            audioBase64: audio.toString("base64"),
          }));
          ws.close();
        }
      } catch (err) {
        console.error("[WS] error:", err);
        try { ws.send(JSON.stringify({ type: "error", message: String(err) })); } catch {}
        ws.close();
      }
    });
  });

  return wss;
}
