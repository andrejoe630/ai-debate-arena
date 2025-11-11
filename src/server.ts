import express from "express";
import cors from "cors";
import { runDebateWithModelsV2 } from "./lib/debate/debate-controller-v2.js";
import { runDiscussion } from "./lib/debate/discussion-controller.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.post("/run-debate", async (req, res) => {
  try {
    const { topic, affirmativeModel, negativeModel, rounds } = req.body;

    if (!topic || !affirmativeModel || !negativeModel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Starting debate:", topic);
    console.log("Aff:", affirmativeModel, "| Neg:", negativeModel);
    console.log("Rounds:", rounds || 3);

    const result = await runDebateWithModelsV2(
      topic,
      affirmativeModel,
      negativeModel,
      rounds || 3,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Debate error:", error);
    res.status(500).json({ error: error.message || "Debate failed" });
  }
});

app.post("/run-debate-stream", async (req, res) => {
  try {
    const { topic, affirmativeModel, negativeModel, rounds } = req.body;

    if (!topic || !affirmativeModel || !negativeModel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Starting streaming debate:", topic);
    console.log("Aff:", affirmativeModel, "| Neg:", negativeModel);
    console.log("Rounds:", rounds || 3);

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const result = await runDebateWithModelsV2(
        topic,
        affirmativeModel,
        negativeModel,
        rounds || 3,
        (status: string, data?: any) => {
          if (status === "message") {
            sendEvent("message", data);
          } else if (status === "chunk") {
            sendEvent("chunk", data);
          } else {
            sendEvent("progress", { status, ...data });
          }
        },
      );

      sendEvent("complete", result);
      res.end();
    } catch (error: any) {
      console.error("Streaming debate error:", error);
      sendEvent("error", { message: error.message || "Debate failed" });
      res.end();
    }
  } catch (error: any) {
    console.error("Debate setup error:", error);
    res.status(500).json({ error: error.message || "Debate failed" });
  }
});

app.post("/run-discussion-stream", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Missing topic" });
    }

    console.log("Starting discussion mode:", topic);

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const result = await runDiscussion(
        topic,
        (status: string, data?: any) => {
          if (status === "message") {
            sendEvent("message", data);
          } else if (status === "chunk") {
            sendEvent("chunk", data);
          } else {
            sendEvent("progress", { status, ...data });
          }
        },
      );

      sendEvent("complete", result);
      res.end();
    } catch (error: any) {
      console.error("Discussion error:", error);
      sendEvent("error", { message: error.message || "Discussion failed" });
      res.end();
    }
  } catch (error: any) {
    console.error("Discussion setup error:", error);
    res.status(500).json({ error: error.message || "Discussion failed" });
  }
});

app.listen(PORT, () => {
  console.log("Debate API running on http://localhost:" + PORT);
});
