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
    const { edited_video_drive_link, title, customer_info } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `You are a professional video production coordinator reviewing a newly edited campaign video submission.
Video Title: ${title}
Customer / Shoots Info: ${customer_info || "No notes provided"}
Edited Video Drive Link: ${edited_video_drive_link}

Generate two separate pieces of content returned as a JSON structure with keys "suggestion" and "flagged_issues".
- "suggestion": Provide 1-2 constructive, friendly sentences of production/editing suggestions based on the customer info/objectives.
- "flagged_issues": List any potential checklist items to double-check (e.g. check audio alignment, video resolution, logo sizing, correct spelling of names from notes, verify Google Drive share permissions) as a short bulleted list.

Response MUST be a valid JSON object matching this schema:
{
  "suggestion": "friendly feedback here",
  "flagged_issues": "bullet points or none here"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          responseMimeType: "application/json",
          maxOutputTokens: 350, 
          temperature: 0.2 
        }
      })
    });

    const data = await response.json();
    let result = { suggestion: "No suggestion generated.", flagged_issues: "None." };
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text.trim();
      try {
        result = JSON.parse(text);
      } catch (e) {
        result.suggestion = text;
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
