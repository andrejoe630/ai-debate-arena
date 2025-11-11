// src/lib/debate/judging.ts
import type { JudgeVerdict } from "./judging.types.js";
import { askOpenAI } from "../ai/openai.js";
import { askClaude } from "../ai/anthropic.js";
import { askGemini } from "../ai/gemini.js";

const JUDGE_PROMPT = (topic: string, aff: string, neg: string): string => `You are a debate judge.
Resolution: ${topic}

Affirmative:
---
${aff}
---

Negative:
---
${neg}
---

Judge using the following criteria, weighing each equally:
- Use of evidence and warrants
- Responsiveness and clash
- Impact analysis and comparative reasoning
- Clarity and structure

Return ONLY a JSON object with:
{
  "winner": "affirmative" | "negative" | "tie",
  "reasoning": "one concise paragraph (80-150 words) explaining your decision"
}`;

function parseWinner(raw: string): { winner: "affirmative" | "negative" | "tie"; reasoning: string } {
  // Try to find and parse JSON object - be more flexible with whitespace
  const jsonMatch = raw.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const obj = JSON.parse(jsonMatch[0]);
      const w = obj.winner === "affirmative" || obj.winner === "negative" || obj.winner === "tie"
        ? obj.winner
        : "tie";
      const r = typeof obj.reasoning === "string" ? obj.reasoning.trim() : "";
      if (r) {
        return { winner: w, reasoning: r };
      }
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", raw.slice(0, 200));
    }
  }
  
  // Fallback: try to extract structured info from raw text
  const lowerRaw = raw.toLowerCase();
  let winner: "affirmative" | "negative" | "tie" = "tie";
  
  if (lowerRaw.includes("affirmative") && lowerRaw.includes("win")) {
    winner = "affirmative";
  } else if (lowerRaw.includes("negative") && lowerRaw.includes("win")) {
    winner = "negative";
  }
  
  return { winner, reasoning: raw.trim().slice(0, 600) };
}

export async function runJudges(input: {
  topic: string;
  affirmativeText: string;
  negativeText: string;
}): Promise<JudgeVerdict[]> {
  const prompt = JUDGE_PROMPT(input.topic, input.affirmativeText, input.negativeText);
  const [oaiRaw, claudeRaw, geminiRaw] = await Promise.all([
    askOpenAI(prompt),
    askClaude(prompt),
    askGemini(prompt),
  ]);
  const oai = parseWinner(oaiRaw);
  const claude = parseWinner(claudeRaw);
  const gemini = parseWinner(geminiRaw);
  const verdicts: JudgeVerdict[] = [
    { judge: "openai", winner: oai.winner, reasoning: oai.reasoning },
    { judge: "anthropic", winner: claude.winner, reasoning: claude.reasoning },
    { judge: "gemini", winner: gemini.winner, reasoning: gemini.reasoning },
  ];
  return verdicts;
}