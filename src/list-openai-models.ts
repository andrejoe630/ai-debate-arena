// List all available OpenAI models
import OpenAI from "openai";
import { ENV } from "./lib/config/env.js";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

async function listModels() {
  try {
    const models = await openai.models.list();
    
    console.log("\n📋 All OpenAI Models:\n");
    const modelIds = models.data
      .map(m => m.id)
      .filter(id => id.includes("gpt"))
      .sort();
    
    console.log("GPT Models:");
    modelIds.forEach(id => console.log(`  - ${id}`));
    
    console.log("\n🔍 Looking for GPT-5:");
    const gpt5Models = modelIds.filter(id => id.includes("5"));
    if (gpt5Models.length > 0) {
      console.log("✅ Found GPT-5 variants:");
      gpt5Models.forEach(id => console.log(`  ✓ ${id}`));
    } else {
      console.log("❌ No GPT-5 models found");
      console.log("\n💡 Try these instead:");
      const latest = modelIds.filter(id => id.includes("gpt-4") || id.includes("turbo"));
      latest.slice(-5).forEach(id => console.log(`  - ${id}`));
    }
  } catch (error: any) {
    console.error("❌ Error listing models:", error.message);
  }
}

listModels();
