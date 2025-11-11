import { askClaude } from "../lib/ai/anthropic.js";

async function main() {
  const reply = await askClaude("Say hello from Claude Sonnet 4.5.");
  console.log("Claude says:", reply);
}

main();
