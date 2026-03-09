import { NextRequest } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

import { createClient } from "../../../../supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { characterName, personalityPrompt, userMessage, history = [] } = await req.json();

    // Fetch dynamic settings from database
    const supabase = await createClient();
    const { data: settingsData } = await supabase.from("site_settings").select("*");
    
    let dbProvider = "google";
    let dbModel = "gemini-pro";
    let dbApiKey = "";

    if (settingsData) {
      settingsData.forEach(s => {
        if (s.key === "ai_api_provider") dbProvider = s.value;
        if (s.key === "ai_model") dbModel = s.value;
        if (s.key === "ai_api_key") dbApiKey = s.value;
      });
    }

    let model;
    
    // Choose provider based on DB setting, fallback to env keys if DB keys are empty
    // If DB has no explicit key and openrouter env exists, prioritize OpenRouter since the user's google key is returning 404s.
    if (!dbApiKey && process.env.OPENROUTER_API_KEY) {
      dbProvider = "openrouter";
      if (dbModel === "gemini-pro") dbModel = "openrouter/free";
    }

    // Format history for payload
    const messages = [
      { 
        role: "system" as const, 
        content: `CRITICAL INSTRUCTION: You MUST auto-detect the language the user is speaking (e.g., Urdu, English, South African languages, or any other language) and reply in the EXACT SAME LANGUAGE as the user. Maintain your persona and character traits while speaking their language.\n\n${personalityPrompt || `You are ${characterName}.`}`
      },
      ...history.map((m: any) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content
      })),
      { role: "user" as const, content: userMessage }
    ];

    if (dbProvider === "openrouter") {
      const apiKey = dbApiKey || process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OpenRouter API key missing. Configure it in Admin Settings.");
      
      // Directly fetch from OpenRouter to bypass strict Vercel AI SDK validation issues
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://workhub.com",
          "X-Title": "WorkHub Platform",
        },
        body: JSON.stringify({
          model: dbModel || "openrouter/free",
          messages: messages,
          temperature: 0.8,
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter API error: ${errText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      return Response.json({ message: text });
      
    } else {
      // Default to google using Vercel AI SDK
      const apiKey = dbApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey) throw new Error("Google Gemini API key missing. Configure it in Admin Settings.");
      
      const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      const model = googleProvider(dbModel || "gemini-pro");

      const { text } = await generateText({
        model,
        messages,
        temperature: 0.8,
      });

      return Response.json({ message: text });
    }
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "Failed to generate response: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
