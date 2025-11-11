import { analyzeDebate } from "../lib/debate/moderation.js";

async function main() {
  const sampleDebate = `
Affirmative: Anyone who disagrees clearly doesn't care about the environment or their neighbors' health.
Negative: They aren’t nearly as bad as cars or airplanes, so it’s pointless to talk about banning them.
`;

  const report = await analyzeDebate(sampleDebate);
  console.log("🧩 Fallacy Report:");
  console.dir(report, { depth: null });
}

main();
