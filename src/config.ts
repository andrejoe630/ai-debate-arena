// src/config.ts

// Which model plays which role (names map to the adapters you already have)
export type DebaterRole = "openai" | "claude";
export type ModeratorRole = "gemini";

export interface DebateConfig {
  topic: string;
  rounds: number;
  debaterA: DebaterRole; // affirmative
  debaterB: DebaterRole; // negative
  moderator: ModeratorRole;
}

export const CONFIG: DebateConfig = {
  topic: "Resolved: Cities should ban gasoline leaf blowers.",
  rounds: 2,
  debaterA: "openai",   // GPT-5
  debaterB: "claude",   // Sonnet 4.5
  moderator: "gemini"   // Gemini 2.5 Pro
};
