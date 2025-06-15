
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userGoal, timeCommitment } = await req.json();

    const systemPrompt = `You are a structured transformation planner AI.

A user wants to accomplish a major life goal. Based on their input and time commitment, generate a 10–20 week roadmap that includes daily-level tasks, habits, and reflections.

Inputs:
- Goal: {{userGoal}}
- Weekly time commitment: {{timeCommitment}}

Generate weekly breakdowns using this format:

{
  "weeks": [
    {
      "week": 1,
      "theme": "...",
      "summary": "...",
      "days": [
        {
          "day": "Monday",
          "focus": "...",
          "tasks": ["..."],
          "habits": ["..."],
          "reflectionPrompt": "..."
        }
      ],
      "weeklyMilestone": "...",
      "weeklyReward": "...",
      "resources": ["..."]
    }
  ]
}
USE THIS UPDATED PROMPT. Output must be valid JSON, with no additional commentary.`;

    const userPrompt = `Goal: ${userGoal}\nWeekly time commitment: ${timeCommitment}`;

    // Send to OpenAI Chat API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 2200
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    let roadmap = null;
    try {
      // Extract JSON blob in the text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        roadmap = JSON.parse(match[0]);
      } else {
        roadmap = JSON.parse(text);
      }
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Failed to parse roadmap JSON from AI response." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-detailed-transformation-plan:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
