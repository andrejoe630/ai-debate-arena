import OpenAI from "openai";
import { ENV } from "../config/env.js";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export async function askOpenAI(prompt: string): Promise<string> {
  try {
    console.log("askOpenAI: Starting request with prompt length:", prompt.length);
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("askOpenAI: Received completion:", completion ? "yes" : "no");
    // Safely handle undefined responses
    const message = completion?.choices?.[0]?.message?.content;
    console.log("askOpenAI: Extracted message:", message ? "yes" : "no");
    return message ?? "[No response received from OpenAI]";
  } catch (error) {
    console.error("askOpenAI: Error occurred:", error);
    throw error;
  }
}

export async function* askOpenAIStream(prompt: string): AsyncGenerator<string> {
  try {
    console.log("askOpenAIStream: Starting streaming request with prompt length:", prompt.length);
    const stream = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    console.log("askOpenAIStream: Stream created successfully");
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
    console.log("askOpenAIStream: Streaming completed successfully");
  } catch (error: any) {
    console.error("askOpenAIStream: Error occurred:", error);

    // Handle organization verification error specifically
    if (error?.status === 400 && error?.message?.includes("organization must be verified")) {
      throw new Error("OpenAI organization verification required. Please visit https://platform.openai.com/settings/organization/general and click 'Verify Organization'. This may take up to 15 minutes to propagate.");
    }

    // Handle other API errors
    if (error?.status === 401) {
      throw new Error("OpenAI API key is invalid or expired. Please check your OPENAI_API_KEY environment variable.");
    }

    if (error?.status === 429) {
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    }

    // Re-throw the original error if it's not one of the handled cases
    throw error;
  }
}
