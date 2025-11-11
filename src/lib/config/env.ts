import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(10, "OPENAI_API_KEY missing"),
  ANTHROPIC_API_KEY: z.string().min(10, "ANTHROPIC_API_KEY missing"),
  GOOGLE_API_KEY: z.string().min(10, "GOOGLE_API_KEY missing"),
});

export const ENV = EnvSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
});
