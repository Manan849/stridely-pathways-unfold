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

A user wants to accomplish a major life goal. Based on their input and time commitment, generate a roadmap that is as long as required to realistically achieve the goal — do not limit the plan length or number of weeks.

Break the roadmap into weekly segments, and break each week into exactly 7 days (Monday–Sunday). For each day, further break down into:

- "focus": The top priority or learning area of the day.
- "tasks": A list containing all actionable steps for that day. Split large actions into multiple fine-grained steps, so a user always knows what to do next.
- "habits": List of recurring habits, plus any habits unique to that day.
- "reflectionPrompt": A short, customized end-of-day reflection prompt.

Inputs:
- Goal: {{userGoal}}
- Weekly time commitment: {{timeCommitment}}

Respond ONLY with valid JSON using this structure:

{
  "weeks": [
    {
      "week": 1,
      "theme": "...",
      "summary": "...",
      "days": [
        {
          "day": "Monday",
          "focus": "...", // Today's main focus (string)
          "tasks": ["..."], // Granular, ordered steps for the day
          "habits": ["..."], // Habits to reinforce today
          "reflectionPrompt": "..." // End-of-day prompt
        }
        // Provide 7 days per week, in order (Monday–Sunday)
      ],
      "weeklyMilestone": "...", // The major achievement/checkpoint for this week
      "weeklyReward": "...",    // Suggested reward after this week's milestone
      "resources": ["..."]      // Relevant links, articles, or resource names
    }
    // Repeat for as many weeks as necessary, without any upper limit
  ]
}

IMPORTANT:
- Do NOT limit the number of weeks. The plan should be as long as needed based on the goal and time commitment.
- Each week MUST include exactly 7 days, always with detailed breakdown for every day.
- Large actions should be split into multiple, clear sub-tasks for each day.
- Only output valid JSON. Do not include any explanations, extra commentary, or formatting besides the JSON itself.`;

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
