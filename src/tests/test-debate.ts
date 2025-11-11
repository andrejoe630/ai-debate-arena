import { runDebateWithModels } from "../lib/debate/debate-controller.js";

// You can change this topic anytime
const TOPIC = "Resolved: Cities should ban gasoline leaf blowers.";

// CLI usage examples (PowerShell):
//   node dist/tests/test-debate.js openai anthropic
//   node dist/tests/test-debate.js anthropic anthropic   // same model both sides
//   node dist/tests/test-debate.js openai                // will mirror to both
//
// Supported keys (based on your mapping): "openai" | "anthropic" | "gemini"
type SideModelKey = "openai" | "anthropic" | "gemini";

const args = process.argv.slice(2);
const affirmative = (args[0] ?? "openai") as SideModelKey;
const negative = (args[1] ?? affirmative) as SideModelKey;

(async () => {
  const result = await runDebateWithModels(TOPIC, affirmative, negative);
  console.log(`\n🧠 Debate topic: ${result.topic}\n`);
  console.log(`⚙️  Affirmative = ${result.affirmativeModel} | Negative = ${result.negativeModel} | Moderator = Claude (claude-sonnet-4-5-20250929)\n`);
  console.log("🔹 Round 1\n");
  console.log(`🗣️ Affirmative (${result.affirmativeModel}): ${result.affirmativeText}\n`);
  console.log(`🤖 Negative (${result.negativeModel}): ${result.negativeText}\n`);
  console.log(`🧩 Moderator (Claude 4.5 Sonnet): ${result.moderatorSummary}\n`);
  console.log("🧑‍⚖️ Judges:");
  for (const v of result.verdicts) {
    console.log(`- ${v.judge}: ${v.winner.toUpperCase()} — ${v.reasoning}`);
  }
})();
