// Debate controller: runs Affirmative vs Negative, then asks the judges.

import { askOpenAI } from "../ai/openai.js";
import { askClaude } from "../ai/anthropic.js";
import { askGemini } from "../ai/gemini.js";

import { runJudges } from "./judging.js";
import type { JudgeVerdict } from "./judging.types.js";

// Types
export type SideModelKey = "openai" | "anthropic" | "gemini";

type ModelCaller = (prompt: string) => Promise<string>;

const CALLERS: Record<SideModelKey, ModelCaller> = {
  openai: async (prompt) => askOpenAI(prompt),
  anthropic: async (prompt) => askClaude(prompt),
  gemini: async (prompt) => askGemini(prompt),
};

function buildAffirmativePrompt(topic: string): string {
  return `You are the Affirmative debater.\n
Resolution: ${topic}\n
Write a concise, well-structured constructive case (350-550 words). Include:
- Clear framework/value
- 3-5 contentions with warranted reasoning
- Anticipate 2 common objections and pre-empt them\n`;
}

function buildNegativePrompt(topic: string): string {
  return `You are the Negative debater.\n
Resolution: ${topic}\n
Write a concise, well-structured opposition case (350-550 words). Include:
- Clear thesis
- 3-5 counter-contentions with warranted reasoning
- Direct clash on the most likely Affirmative claims
- Offer better policy alternatives than a full ban, if relevant\n`;
}

function buildModeratorPrompt(topic: string, affirmative: string, negative: string): string {
  return `You are the moderator. Summarize and critique both sides fairly.
Resolution: ${topic}

Affirmative says:
---
${affirmative}
---

Negative says:
---
${negative}
---

Tasks:
1) Summarize the strongest points from each side.
2) Identify major weaknesses and logical gaps on each side.
3) Provide a short persuasiveness snapshot (who is ahead and why) without declaring a winner. Keep to 250-400 words.`;
}

/**
 * Runs a single debate: Affirmative vs Negative using the chosen model keys,
 * then asks the judges to vote. Returns the transcript and verdicts.
 */
export async function runDebateWithModels(
  topic: string,
  affirmativeModel: SideModelKey,
  negativeModel: SideModelKey
): Promise<{
  topic: string;
  affirmativeModel: SideModelKey;
  negativeModel: SideModelKey;
  affirmativeText: string;
  negativeText: string;
  moderatorSummary: string;
  verdicts: JudgeVerdict[];
}> {
  const affCaller = CALLERS[affirmativeModel];
  const negCaller = CALLERS[negativeModel];

  if (!affCaller) throw new Error(`Unknown affirmative model key: ${affirmativeModel}`);
  if (!negCaller) throw new Error(`Unknown negative model key: ${negativeModel}`);

  // Round 1 speeches
  const [affirmativeText, negativeText] = await Promise.all([
    affCaller(buildAffirmativePrompt(topic)),
    negCaller(buildNegativePrompt(topic)),
  ]);

  // Moderator is always Claude Sonnet 4.5 (handled inside askClaude selection)
  const moderatorSummary = await askClaude(buildModeratorPrompt(topic, affirmativeText, negativeText));

  // Run the three-judge panel (OpenAI, Claude, Gemini)
  const verdicts = await runJudges({
    topic,
    affirmativeText,
    negativeText,
  });

  return {
    topic,
    affirmativeModel,
    negativeModel,
    affirmativeText,
    negativeText,
    moderatorSummary,
    verdicts,
  };
}
