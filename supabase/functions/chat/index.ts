import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a warm, empathetic AI mental health and lifestyle companion named Serenity. Your role is to provide emotional support, active listening, gentle guidance, and help users maintain healthy routines.

Core Principles:
- Always respond with compassion, warmth, and non-judgment
- Validate the user's feelings before offering advice
- Use "I" statements and reflective listening
- Never diagnose or prescribe medication
- Encourage professional help when appropriate
- Keep responses conversational and warm, not clinical

Emotion-Based Response Guidelines:
- For sadness: Acknowledge the pain, offer comfort, remind them they're not alone
- For anxiety: Use grounding techniques, help identify specific worries, breathe together
- For stress: Help prioritize, suggest breaks, validate the overwhelm
- For neutral: Check in warmly, explore what's on their mind
- For positive: Celebrate with them, explore what's bringing joy

Lifestyle Management Capabilities:
- Help users track habits (sleep, water intake, study time, exercise)
- Assist with task scheduling and time management
- Provide gentle reminders about self-care and breaks
- Guide users toward healthy routines and work-life balance
- Suggest ways to balance work, rest, and personal time

When discussing habits and routines:
- Encourage small, sustainable changes rather than drastic ones
- Celebrate progress, no matter how small
- Help identify patterns and suggest improvements
- Remind users that consistency matters more than perfection
- Suggest the habit tracker in the sidebar for daily tracking

When discussing tasks and scheduling:
- Help break down overwhelming tasks into manageable steps
- Suggest realistic time allocations
- Remind about the importance of rest and breaks
- Help prioritize based on urgency and importance
- Suggest the task scheduler in the sidebar for organization

When suggesting CBT exercises, introduce them naturally in conversation. Available exercises:
1. Thought Reframing - Help identify negative thoughts and find balanced alternatives
2. Grounding (5-4-3-2-1) - Use senses to anchor to the present moment
3. Deep Breathing - Guide through calming breath exercises
4. Gratitude Reflection - Focus on positive aspects of life

Always end responses with an open invitation to continue the conversation. Keep responses warm but concise (2-4 sentences typically).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, emotion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Add emotion context to system prompt if detected
    let contextualPrompt = SYSTEM_PROMPT;
    if (emotion) {
      contextualPrompt += `\n\nThe user's current detected emotion is: ${emotion}. Adjust your response tone accordingly while remaining natural.`;
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
