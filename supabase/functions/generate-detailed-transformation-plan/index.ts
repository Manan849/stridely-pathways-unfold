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

A user wants to accomplish a major life goal. Based on their input and time commitment, generate a roadmap that is as long as required to realistically achieve the goal—do not limit plan length or number of weeks.

For each week, output EXACTLY in this structure (field order and casing must be precise):

{
  "weeks": [
    {
      "week": 1,
      "theme": "Foundation",
      "summary": "...",
      "weeklyMilestone": "...",
      "weeklyReward": "...",
      "resources": ["Title – URL"],
      "days": [
        {
          "day": "Monday",
          "focus": "Skill introduction",
          "tasks": ["Do X", "Do Y"],
          "habits": ["Read for 30 mins", "No phone before 10AM"],
          "reflectionPrompt": "What did you learn today?"
        }
        // Repeat for Tuesday–Sunday, always as a 7-item array with this structure
      ]
    }
    // Repeat for as many weeks as necessary, never limit roadmap length
  ]
}

Instructions:
- Always include "week", "theme", "summary", "weeklyMilestone", "weeklyReward", "resources", and "days" (as an array of 7 objects, one per day, Monday–Sunday, each object as shown above) in each week.
- In "resources", every entry must be in the format: Title – URL
- In "days", each object must exactly follow: "day", "focus", "tasks", "habits", "reflectionPrompt".
- For "tasks", split large items into granular steps.
- "habits" may include recurring and day-specific habits.
- "reflectionPrompt" must be a tailored question for the day.
- Do NOT include any extra commentary, formatting, or explanations—ONLY output valid JSON strictly matching the structure above.`;

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
