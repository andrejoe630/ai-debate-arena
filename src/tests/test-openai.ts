import { askOpenAI } from "../lib/ai/openai.js";

async function main() {
  const reply = await askOpenAI("Say hello from GPT-5.");
  console.log("GPT-5 says:", reply);
}

main();
