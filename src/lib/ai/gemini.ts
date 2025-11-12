// src/lib/ai/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";

/**
 * Ask Gemini with an optional model override.
 * Default model: gemini-pro (access tier that works on most keys)
 */
export async function askGemini(
  prompt: string,
  modelId: string = "gemini-pro",
): Promise<string> {
  if (!ENV.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in your environment (.env).");
  }

  const genAI = new GoogleGenerativeAI(ENV.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    }
  });

  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // Prefer the stable helper, fall back for older responses
  const text =
    (res.response as any)?.text?.() ??
    (res.response as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";

  return String(text).trim();
}

export async function* askGeminiStream(
  prompt: string,
  modelId: string = "gemini-pro",
): AsyncGenerator<string> {
  if (!ENV.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in your environment (.env).");
  }

  const genAI = new GoogleGenerativeAI(ENV.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    }
  });

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}
