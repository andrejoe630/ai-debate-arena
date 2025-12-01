import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../src/lib/config/env.js";

async function main() {
  if (!ENV.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in your environment.");
  }

  const client = new GoogleGenerativeAI(ENV.GOOGLE_API_KEY);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GOOGLE_API_KEY}`,
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list models: ${response.status} ${text}`);
  }

  const result = (await response.json()) as { models?: any[] };
  const models = result.models ?? [];

  if (models.length === 0) {
    console.log("No Gemini models returned for this API key.");
    return;
  }

  console.log("Models available to this key:\n");
  for (const model of models) {
    const name = model.name ?? "<unnamed>";
    const display = model.displayName ? ` (${model.displayName})` : "";
    const inputToken = model.inputTokenLimit ? ` | input limit: ${model.inputTokenLimit}` : "";
    const outputToken = model.outputTokenLimit ? ` | output limit: ${model.outputTokenLimit}` : "";
    console.log(`- ${name}${display}${inputToken}${outputToken}`);
  }
}

main().catch((err) => {
  console.error("Failed to list Gemini models:", err);
  process.exitCode = 1;
});
