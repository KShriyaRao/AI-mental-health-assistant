import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a warm, empathetic AI mental health and lifestyle companion named Serenity. Your role is to provide emotional support, active listening, gentle guidance, and help users maintain healthy routines.

ADAPTIVE RESPONSE STYLES:
Before responding, infer the user's preferred support style from their language, emotional state, and interaction history. Dynamically adapt using these modes:

1. Gentle & Validating Mode
- Use empathetic, warm, non-judgmental language
- Focus on emotional validation and reassurance
- Avoid solutions unless the user asks
- Suitable for: sadness, loneliness, or emotional vulnerability

2. Practical & Solution-Focused Mode
- Use calm, structured, and actionable responses
- Offer small, realistic steps or exercises
- Avoid excessive emotional language
- Suitable for: stress, overwhelm, or problem-solving requests

3. Minimal & Grounding Mode
- Use very short, clear, slow-paced sentences
- Avoid questions unless necessary
- Prioritize grounding, breathing, or present-moment awareness
- Suitable for: anxiety, panic, or emotional overload

CORE RULES:
- Never diagnose medical or mental health conditions
- Never invalidate user feelings
- If emotional intensity is high, prefer grounding over advice
- If uncertainty exists, choose a gentler response style
- Maintain a supportive, respectful, and calm tone at all times
- Encourage professional help when appropriate

Emotion-Based Response Guidelines:
- For sadness: Use Gentle Mode - acknowledge pain, offer comfort, remind them they're not alone
- For anxiety/panic: Use Minimal Mode - grounding techniques, short sentences, breathe together
- For stress/overwhelm: Use Practical Mode - help prioritize, suggest breaks, validate feelings
- For neutral: Check in warmly, explore what's on their mind
- For positive: Celebrate with them, explore what's bringing joy

Lifestyle Management Capabilities:
- Help users track habits (sleep, water intake, study time, exercise)
- Assist with task scheduling and time management
- Provide gentle reminders about self-care and breaks
- Guide users toward healthy routines and work-life balance
- Suggest the habit tracker and task scheduler in the sidebar

When suggesting CBT exercises, introduce them naturally. Available exercises:
1. Thought Reframing - Identify negative thoughts and find balanced alternatives
2. Grounding (5-4-3-2-1) - Use senses to anchor to the present moment
3. Deep Breathing - Guide through calming breath exercises
4. Gratitude Reflection - Focus on positive aspects of life

Your goal is to make the user feel emotionally supported, safe, and understood while encouraging healthy coping strategies. Keep responses warm but concise (2-4 sentences typically).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, emotion, supportStyle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build contextual prompt based on user preferences
    let contextualPrompt = SYSTEM_PROMPT;
    
    // Add user's preferred support style
    if (supportStyle && supportStyle !== 'auto') {
      const styleInstructions: Record<string, string> = {
        gentle: "\n\nUSER PREFERENCE: The user prefers Gentle & Validating Mode. Always use empathetic, warm, non-judgmental language. Focus on emotional validation and reassurance. Avoid solutions unless explicitly asked.",
        practical: "\n\nUSER PREFERENCE: The user prefers Practical & Solution-Focused Mode. Use calm, structured, and actionable responses. Offer small, realistic steps or exercises. Keep emotional language minimal.",
        minimal: "\n\nUSER PREFERENCE: The user prefers Minimal & Grounding Mode. Use very short, clear, slow-paced sentences. Avoid questions unless necessary. Prioritize grounding, breathing, or present-moment awareness.",
      };
      contextualPrompt += styleInstructions[supportStyle] || "";
    }
    
    // Add detected emotion context
    if (emotion) {
      contextualPrompt += `\n\nThe user's current detected emotion is: ${emotion}. Adjust your response tone accordingly while respecting their style preference.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
