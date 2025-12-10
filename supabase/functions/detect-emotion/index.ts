import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMOTION_PROMPT = `You are an emotion detection system. Analyze the user's message and detect their primary emotion.

Return ONLY a JSON object with this exact format:
{
  "emotion": "one of: sad, anxious, stressed, neutral, positive",
  "confidence": 0.0 to 1.0,
  "indicators": ["brief", "keyword", "phrases"]
}

Emotion definitions:
- sad: expressing loss, disappointment, grief, loneliness, hopelessness
- anxious: expressing worry, fear, uncertainty, nervousness, panic
- stressed: expressing overwhelm, pressure, frustration, burnout
- neutral: calm statements, questions, general conversation
- positive: happiness, gratitude, excitement, hope, relief

Be accurate but err on the side of detecting genuine distress if present.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ 
        emotion: "neutral", 
        confidence: 1.0, 
        indicators: [] 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: EMOTION_PROMPT },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Emotion detection error:", await response.text());
      return new Response(JSON.stringify({ 
        emotion: "neutral", 
        confidence: 0.5, 
        indicators: [] 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      emotion: "neutral", 
      confidence: 0.5, 
      indicators: [] 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Emotion detection error:", e);
    return new Response(JSON.stringify({ 
      emotion: "neutral", 
      confidence: 0.5, 
      indicators: [] 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
