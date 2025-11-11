import OpenAI from "openai";
import { ENV } from "../config/env.js";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export async function askOpenAI(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
  });

  // Safely handle undefined responses
  const message = completion?.choices?.[0]?.message?.content;
  return message ?? "[No response received from OpenAI]";
}

export async function* askOpenAIStream(prompt: string): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
