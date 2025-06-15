
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchSupabaseRoadmap(userId: string, userGoal: string, timeCommitment: string) {
  const url = `${supabaseUrl}/rest/v1/user_plans?user_id=eq.${userId}&goal=eq.${encodeURIComponent(userGoal)}&time_commitment=eq.${encodeURIComponent(timeCommitment)}&select=plan&limit=1`;
  const res = await fetch(url, {
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`
    }
  });

  if (!res.ok) return null;
  const plans = await res.json();
  if (plans.length && plans[0].plan?.weeks) return plans[0].plan;
  return null;
}

async function storeSupabaseRoadmap(userId: string, userGoal: string, timeCommitment: string, plan: any) {
  const url = `${supabaseUrl}/rest/v1/user_plans`;
  // Upsert by user-goal-commitment triple (only one plan per user/goal combo)
  const body = [{
    user_id: userId,
    goal: userGoal,
    time_commitment: timeCommitment,
    plan,
    current_week_index: 1 // default
  }];
  await fetch(url, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(body)
  });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, userGoal, timeCommitment } = await req.json();

    // Check for cached roadmap first
    let roadmap = null;
    if (user_id && userGoal && timeCommitment && supabaseUrl && supabaseKey) {
      roadmap = await fetchSupabaseRoadmap(user_id, userGoal, timeCommitment);
    }

    if (!roadmap) {
      // Compose system/user prompts as before
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
      // Robust JSON extraction:
      let text: string = data.choices?.[0]?.message?.content ?? "";
      // Try to extract JSON (between first '{' and last '}')
      let jsonString = "";
      const firstCurly = text.indexOf('{');
      const lastCurly = text.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && firstCurly < lastCurly) {
        jsonString = text.slice(firstCurly, lastCurly + 1);
      } else {
        // Fall back: try to parse directly if it's JSON only
        jsonString = text.trim();
      }

      try {
        roadmap = JSON.parse(jsonString);
      } catch (e) {
        // Try to fix common issues: removing non-JSON leading/trailing text
        try {
          const m = text.match(/\{[\s\S]+\}/);
          if (m) {
            roadmap = JSON.parse(m[0]);
          }
        } catch {
          roadmap = null;
        }
      }

      if (!roadmap || !roadmap.weeks) {
        return new Response(
          JSON.stringify({ error: "Failed to parse roadmap JSON from AI response." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Store in Supabase, ignore errors
      if (user_id && userGoal && timeCommitment && supabaseUrl && supabaseKey) {
        await storeSupabaseRoadmap(user_id, userGoal, timeCommitment, roadmap);
      }
    }

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-or-fetch-roadmap:", error);
    return new Response(
      JSON.stringify({ error: error?.message || String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
