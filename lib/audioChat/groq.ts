// /lib/audioChat/groq.ts
import Groq from "groq-sdk";

export async function askGroq(systemPrompt: string, userText: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
    ],
  });
  return completion.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function ttsGroq(text: string, voice = "Fritz-PlayAI", format: "wav" | "mp3" = "wav"): Promise<Buffer> {
  const r = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "playai-tts",
      voice,
      input: text,
      response_format: format,
    }),
  });
  if (!r.ok) throw new Error(`Groq TTS failed: ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}
