export type ModelKey = "openai" | "anthropic" | "gemini";

export type JudgeVerdict = {
  judge: ModelKey;
  winner: "affirmative" | "negative" | "tie";
  reasoning: string;
};

