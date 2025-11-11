// src/list-anthropic-models.ts
import Anthropic from "@anthropic-ai/sdk";
import { ENV } from "./lib/config/env.js";

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

(async () => {
  try {
    const models = await client.models.list();
    console.log("Available Anthropic models:");
    for (const m of models.data) {
      console.log(`- ${m.id}`);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
})();
