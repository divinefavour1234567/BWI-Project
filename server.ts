import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));

  // Initialize server-side Gemini client securely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is missing or carries placeholder value. Model calls will fail back gracefully.");
  }

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Proxy Endpoint for Gemini Requests
  app.post("/api/gemini", async (req, res) => {
    try {
      const { prompt, systemInstruction, stream = false } = req.body;
      
      if (!ai) {
        // Fallback static responses for local testing if API key is not yet set
        return res.json({
          text: `### AIG Sovereign Core Engine [Offline/No-Key Fallback]\n\nIt looks like your **GEMINI_API_KEY** is not configured, or is currently empty.\n\n* **Infrastructure Analytics**: Directing system via automated rules.\n* **Simulation Status**: Active in simulated sandbox mode.\n\n**To enable fully-qualified dynamic AI insights:** Paste a valid Gemini API key inside the **Settings > Secrets** panel of AI Studio!`,
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are the AIG Sovereign Command Engine, an elite African multi-agent AI system designed to manage and optimize national security, flood routing, grid loading, public funds auditing, health diagnostics, and logistics across Nigeria and broader Africa.",
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Critical Gemini API proxy failure:", err);
      res.status(500).json({ error: err.message || "An unidentified error occurred within the AIG Sovereign agent." });
    }
  });

  // Serve Single Page Application assets and routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AIG OPERATING SYSTEM] Initiated on routing interface http://0.0.0.0:${PORT}`);
  });
}

startServer();
