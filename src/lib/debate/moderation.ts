// src/moderation.ts
import { askGemini } from "../ai/gemini.js";

// JSON schema (informal) for the checker output
export interface FallacyReport {
  fallacies: Array<{
    debater: "affirmative" | "negative";
    name: string;              // e.g., "Strawman", "Ad Hominem"
    excerpt: string;           // short quote showing the issue
    why: string;               // brief explanation
  }>;
  violations: Array<{
    debater: "affirmative" | "negative";
    type: "MissingCitation" | "OutdatedSource" | "AmbiguousClaim" | "BiasedLanguage";
    excerpt: string;
    fix: string;               // actionable guidance
  }>;
  requests: string[];          // neutral directives to improve next round
  summary: string;             // 2–3 sentence neutral recap
}

// Export analyzeDebate for test-moderation.ts
export async function analyzeDebate(debate: string): Promise<FallacyReport> {
  // Dummy implementation for now, adapt as needed
  return checkFallacies(debate, debate);
}

export async function checkFallacies(affirmative: string, negative: string): Promise<FallacyReport> {
  const prompt = `
You are a strict debate moderator and logic referee.
Given two short debate turns, return a JSON object with this exact shape:
{
  "fallacies": [{"debater":"affirmative|negative","name":"...","excerpt":"...","why":"..."}],
  "violations": [{"debater":"affirmative|negative","type":"MissingCitation|OutdatedSource|AmbiguousClaim|BiasedLanguage","excerpt":"...","fix":"..."}],
  "requests": ["A: do X", "B: do Y"],
  "summary": "2–3 sentences"
}
Rules:
- Only include concrete items you can justify from the text.
- Keep excerpts short (<=200 chars).
- Be specific and actionable in "fix".
- Output JSON only.

Affirmative turn:
---
${affirmative}
---

Negative turn:
---
${negative}
---
`;

  // Ask Gemini to produce JSON; if it returns extra text, try to parse robustly.
  const raw = await askGemini(prompt);
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const json = JSON.parse(raw.slice(start, end + 1));
    return json as FallacyReport;
  } catch {
    // Fallback: minimal empty report
    return { fallacies: [], violations: [], requests: [], summary: "No structured output parsed." };
  }
}
