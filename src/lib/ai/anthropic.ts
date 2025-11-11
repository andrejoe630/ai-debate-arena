import Anthropic from "@anthropic-ai/sdk";
import { ENV } from "../config/env.js";

/**
 * Ask Claude with a prompt. Optionally override the model.
 * Default set to a known-available Sonnet 4.5 snapshot.
 */
export async function askClaude(
  prompt: string,
  model?: string,
): Promise<string> {
  if (!ENV.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in environment.");
  }

  const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

  const modelName = model ?? "claude-sonnet-4-5-20250929";

  const res = await client.messages.create({
    model: modelName,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  // Extract plain text from content blocks
  const parts = Array.isArray(res.content) ? res.content : [];
  const text = parts
    .map((b: any) =>
      b?.type === "text" && typeof b.text === "string" ? b.text : "",
    )
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || "[no text returned]";
}

export async function* askClaudeStream(
  prompt: string,
  model?: string,
): AsyncGenerator<string> {
  if (!ENV.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in environment.");
  }

  const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });
  const modelName = model ?? "claude-sonnet-4-5-20250929";

  const stream = await client.messages.stream({
    model: modelName,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}
