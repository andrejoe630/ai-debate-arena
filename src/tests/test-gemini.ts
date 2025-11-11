import { askGemini } from "../lib/ai/gemini.js";

async function main() {
  const reply = await askGemini("Say hello from Gemini 2.5 Pro.");
  console.log("Gemini says:", reply);
}

main();
