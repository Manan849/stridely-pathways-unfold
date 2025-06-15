
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

    const systemPrompt = `You are an AI life transformation planner.

A user has entered a big life goal and a weekly time commitment. Your job is to generate a practical, structured roadmap to help them achieve this goal.

Use the inputs:
- Goal: {{userGoal}}
- Weekly time commitment: {{timeCommitment}}

Generate a roadmap spanning 8–20 weeks depending on the ambition and time input. Each week should include:
- Skills to build
- Habits to adopt
- 1 milestone
- 1–2 helpful resources (tools, videos, links, books)

Use this JSON format in your output:
{
  "weeks": [
    {
      "week": 1,
      "skills": ["Skill A", "Skill B"],
      "habits": ["Daily journaling", "30-min reading"],
      "milestone": "Finish Module 1 of [Course]",
      "resources": [
        "FreeCodeCamp – https://www.freecodecamp.org/",
        "Notion Habit Tracker – https://notion.so/template"
      ]
    },
    ...
  ]
}
Make the output clear, simple, practical, and encouraging.`;

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
    // Extract text answer from OpenAI's response
    const text = data.choices?.[0]?.message?.content;

    let roadmap = null;
    try {
      // Find the JSON blob in the text (if the model says extra stuff)
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        roadmap = JSON.parse(match[0]);
      } else {
        roadmap = JSON.parse(text); // fallback
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
    console.error("Error in generate-roadmap function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
