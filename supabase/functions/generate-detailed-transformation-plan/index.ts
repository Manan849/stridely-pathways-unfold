
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userGoal, timeCommitment } = await req.json();

    const prompt = `
You are a structured transformation planner AI.

A user has a life goal and a weekly time commitment. Generate a personalized roadmap to help them reach their goal in 10–20 weeks. Each week should be structured and broken down by day.

Input:
- Goal: ${userGoal}
- Weekly Time: ${timeCommitment}

For each week return the following fields:
- week (number)
- theme (short motivational label)
- summary (1-sentence weekly goal)
- weeklyMilestone (one achievement for the week)
- weeklyReward (fun reward for motivation)
- resources (1–2 relevant links, output as "Title – URL")
- days (7 days per week, array)

Each day object must have:
- day (e.g. Monday)
- focus (1-sentence day goal)
- tasks (2–3 to-dos, short, <45 min each)
- habits (small actions to track, 1–3)
- reflectionPrompt (a sentence to reflect on)

Output the response as JSON structured like:

{
  "weeks": [
    {
      "week": 1,
      "theme": "...",
      "summary": "...",
      "weeklyMilestone": "...",
      "weeklyReward": "...",
      "resources": ["..."],
      "days": [
        {
          "day": "Monday",
          "focus": "...",
          "tasks": ["...", "..."],
          "habits": ["...", "..."],
          "reflectionPrompt": "..."
        }
      ]
    }
  ]
}

DO NOT LIMIT TO EXACTLY 10–20 WEEKS — use as many weeks as are required to logically reach the goal. Each week must contain exactly 7 days with unique, practical content.
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: "system", content: "You are a structured roadmap planning assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await aiRes.json();

    // Extract code block, in case the AI escapes JSON
    let plan;
    try {
      // Try best to extract JSON from possible code block etc.
      const content = data.choices?.[0]?.message?.content;
      const jsonMatch = content.match(/```json([\s\S]*?)```/);
      plan = JSON.parse(jsonMatch ? jsonMatch[1] : content);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse AI response." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
