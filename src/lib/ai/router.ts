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
      return "OpenAI (GPT-5.1)";
    case "anthropic":
      return "Claude Sonnet 4.5";
    case "gemini":
      return "Gemini 3";
    default:
      return model;
  }
}
