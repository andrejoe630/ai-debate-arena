import { askOpenAI } from "./openai.js";
import { askClaude } from "./anthropic.js";
import { askGemini } from "./gemini.js";

export type ModelKey = "openai" | "anthropic" | "gemini";

/**
 * Returns a function to call the chosen model.
 * Signature: (prompt: string) => Promise<string>
 */
export function getModelClient(model: ModelKey) {
  switch (model) {
    case "openai":
      return askOpenAI;
    case "anthropic":
      return askClaude;
    case "gemini":
      return askGemini;
    default:
      throw new Error(`Unsupported model key: ${model}`);
  }
}

/** Human-readable labels for logs/UI. */
export function labelFor(model: ModelKey): string {
  switch (model) {
    case "openai":
      return "OpenAI (GPT-5)";
    case "anthropic":
      return "Claude 4.5 Sonnet";
    case "gemini":
      return "Gemini 2.5 Pro";
    default:
      return model;
  }
}
