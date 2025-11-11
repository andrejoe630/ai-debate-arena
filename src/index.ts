// src/index.ts
import { ENV } from "./lib/config/env.js";

function mask(k: string) {
  return typeof k === "string" && k.length >= 6 ? k.slice(0, 6) + "..." : "(missing)";
}

console.log("Env ok:");
console.log({
  OPENAI_API_KEY: mask(ENV.OPENAI_API_KEY),
  ANTHROPIC_API_KEY: mask(ENV.ANTHROPIC_API_KEY),
  GOOGLE_API_KEY: mask(ENV.GOOGLE_API_KEY),
});
