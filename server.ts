import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// 1. Implement the score-prompt edge function logic
app.post("/api/score-prompt", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Score-prompt error: No API key found in environment variables (GEMINI_API_KEY or GOOGLE_API_KEY)");
    return res.status(500).json({ error: "Gemini API key not configured on server" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using a more stable alias if preview is problematic
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [{
        role: "user",
        parts: [{
          text: `As an AI Prompt Quality Judge, audit the following blueprint for clarity, specificity, and actionability.
          
          PROMPT TO AUDIT:
          ${prompt}
          
          OUTPUT FORMAT (JSON):
          {
            "score": 0-10,
            "metrics": { "clarity": 0-10, "specificity": 0-10, "logic": 0-10 },
            "tips": ["Tip 1", "Tip 2", "Tip 3"],
            "verdict": "Brief professional summary"
          }`
        }]
      }]
    });

    const text = result.text || '';
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    
    res.json(data);
  } catch (error: any) {
    console.error("Score-prompt error details:", {
      message: error.message,
      status: error.status,
      details: error.details,
      keyPrefix: apiKey ? apiKey.substring(0, 4) : 'none'
    });
    res.status(500).json({ 
      error: "Failed to score prompt",
      details: error.message,
      score: 0,
      verdict: "Neural audit failed due to protocol error.",
      metrics: { clarity: 0, specificity: 0, logic: 0 },
      tips: ["Check network synchronization", "Verify API authorization"]
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
