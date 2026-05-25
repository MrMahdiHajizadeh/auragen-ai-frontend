import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy-initialized Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not set. Offline backup prompt generation is active.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // 1. Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 2. Suggest Prompt API Endpoint (powered by Gemini AI)
  app.post("/api/suggest-prompt", async (req, res) => {
    const { modelName, style, currentPrompt } = req.body;
    
    // Offline pre-baked fallbacks
    const fallbackPrompts: Record<string, string[]> = {
      "Cyberpunk": [
        "A cyberpunk explorer looking out over Neo-Tokyo, rain-slicked asphalt, neon billboards reflecting electric indigo and digital cyan, highly detailed volumetric smoke, cinematic composition, 8k resolution, photorealistic rendering.",
        "Synthesized holographic cyborg in a dense data cluster, cascading binary streams, vibrant magenta and purple hues, high contrast cybernetic details, editorial aesthetic."
      ],
      "Professional": [
        "A professional studio business portrait of a modern executive, soft corporate rim lighting, neutral concrete gray background, high-end photography, 85mm lens, corporate confidence.",
        "Highly polished headshot of a creative director in studio, warm gold fill lights, sharp depth of field, elegant and editorial composition."
      ],
      "Anime": [
        "A breathtaking anime portrait of a futuristic street racer with bioluminescent turquoise streaks in their hair, neon-lit rainy Tokyo alleyways, cel-shaded high-fidelity illustration.",
        "High-fidelity anime masterpiece of an mechanical engineer working on glowing holographic interfaces, Ghibli colors, beautiful cinematic framing."
      ],
      "3D Render": [
        "Surreal abstract 3D render, glowing metallic crystalline formations reflecting deep space galaxies, volumetric clouds, glassmorphism prisms, octane render, beautiful architectural geometry.",
        "Cinematic 3D render of a sacred quantum geometry, glowing brass and liquid chrome mechanics, electric blue plasma orb floating in the center."
      ]
    };

    const styleKey = style || "Cyberpunk";
    const group = fallbackPrompts[styleKey] || fallbackPrompts["Cyberpunk"];
    const offlineFallback = group[Math.floor(Math.random() * group.length)];

    const ai = getGeminiClient();
    if (!ai) {
      // Return offline suggestion immediately if key is missing
      return res.json({
        prompt: offlineFallback,
        source: "offline-cache",
        note: "Add your GEMINI_API_KEY in Settings to unlock real-time custom prompts!"
      });
    }

    try {
      const modelToUse = "gemini-3.5-flash";
      const userContextInput = currentPrompt 
        ? `The user already wrote this starting draft: "${currentPrompt}". Enhance it.` 
        : `Start a brand new prompt.`;

      const promptText = `You are a cinematic AI prompt engineering expert for the AuraGen AI platform.
We need to generate a single, highly detailed, visually stunning image generation prompt.
Target style category: "${styleKey}" (for example: Cyberpunk, Professional Headshots, Anime, or Surreal 3D Render).
Model details: "${modelName || "Neural Headshot model"}".
User starting context: ${userContextInput}

Produce EXACTLY ONE premium, descriptive prompt written in English. Ensure it describes:
1. Clear subject matter (e.g. realistic portraits or majestic structures)
2. Professional cinematic lighting (e.g. electric indigo rim lights, soft studio diffuser, or sunset flares)
3. Background and color palette matching the style (e.g. rain-slicked digital cyan street, minimalist concrete, or dark nebula)
4. Editorial technical terms (e.g. 85mm lens, volumetric smoke, octane render, 8k resolution)

Return ONLY the plain text of the suggested prompt in your response, with no quotes, no markdown wrappers, and no header prefixes. Do not add explanations. Keep it under 60 words.`;

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: promptText,
        config: {
          temperature: 0.85,
          topP: 0.9,
        }
      });

      const generatedPrompt = response.text ? response.text.trim().replace(/^['"]|['"]$/g, '') : offlineFallback;
      return res.json({
        prompt: generatedPrompt,
        source: "gemini-ai"
      });
    } catch (err: any) {
      console.error("Gemini API suggestion failed:", err);
      return res.json({
        prompt: offlineFallback,
        source: "offline-fail-safe",
        error: err.message
      });
    }
  });

  // 3. Vite middleware for asset serving or bundling static Client SPA
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
    console.log(`Express full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
