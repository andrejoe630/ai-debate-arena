import OpenAI from "openai";
import { ENV } from "../config/env.js";

const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });
const DEFAULT_MODEL = "gpt-5.1";

export async function askOpenAI(
  prompt: string,
  model?: string,
): Promise<string> {
  try {
    const response = await openai.responses.create({
      model: model ?? DEFAULT_MODEL,
      input: prompt,
    });

    const directText = typeof response.output_text === "string"
      ? response.output_text.trim()
      : "";

    if (directText) {
      return directText;
    }

    const fallback = (response.output ?? [])
      .flatMap((item: any) => item?.content ?? [])
      .map((part: any) =>
        part?.type === "output_text" && typeof part.text === "string"
          ? part.text
          : part?.text ?? "",
      )
      .filter(Boolean)
      .join("")
      .trim();

    return fallback || "[No response received from OpenAI]";
  } catch (error: any) {
    const message = error?.message || "Unknown OpenAI error";
    throw new Error(message);
  }
}

export async function* askOpenAIStream(
  prompt: string,
  model?: string,
): AsyncGenerator<string> {
  const stream = await openai.responses.stream({
    model: model ?? DEFAULT_MODEL,
    input: prompt,
  });

  for await (const rawEvent of stream as any) {
    const event = rawEvent ?? {};

    if (event.type === "error" || event.type === "response.error") {
      const errMsg =
        event.error?.message ?? event.message ?? "Unknown OpenAI stream error";
      throw new Error(errMsg);
    }

    if (event.type === "response.output_text.delta") {
      yield event.delta as string;
    }
  }
}
