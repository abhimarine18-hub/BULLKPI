import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { kpiName, kpiDescription, target, unit, submittedValue, note } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `You are an AI assistant reviewing a KPI submission. 
KPI Name: ${kpiName}
Target: ${target} ${unit}
Description: ${kpiDescription || "No description provided"}

The user submitted a value of ${submittedValue} ${unit} with the following note: "${note}". 
Briefly assess if this submission looks accurate, complete, or if there are potential issues (e.g., value seems way off target, or note contradicts the value). 
Provide a short, 1-2 sentence suggestion or observation.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.2 }
      })
    });

    const data = await response.json();
    let suggestion = "No suggestion available.";
    
    if (data.candidates && data.candidates.length > 0) {
      suggestion = data.candidates[0].content.parts[0].text.trim();
    }

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
