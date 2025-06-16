
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchSupabaseRoadmap(userId: string, userGoal: string, timeCommitment: string, numberOfWeeks: number) {
  const url = `${supabaseUrl}/rest/v1/user_plans?user_id=eq.${userId}&goal=eq.${encodeURIComponent(userGoal)}&time_commitment=eq.${encodeURIComponent(timeCommitment)}&number_of_weeks=eq.${numberOfWeeks}&select=plan&limit=1`;
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

async function storeSupabaseRoadmap(userId: string, userGoal: string, timeCommitment: string, numberOfWeeks: number, plan: any) {
  const url = `${supabaseUrl}/rest/v1/user_plans`;
  const body = [{
    user_id: userId,
    goal: userGoal,
    time_commitment: timeCommitment,
    number_of_weeks: numberOfWeeks,
    plan,
    current_week_index: 1
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, userGoal, timeCommitment, numberOfWeeks = 12 } = await req.json();

    console.log("Generating roadmap for:", { userGoal, timeCommitment, numberOfWeeks });

    let roadmap = null;
    if (user_id && userGoal && timeCommitment && supabaseUrl && supabaseKey) {
      roadmap = await fetchSupabaseRoadmap(user_id, userGoal, timeCommitment, numberOfWeeks);
    }

    if (!roadmap) {
      const systemPrompt = `You are an AI life transformation planner.

A user has entered a big life goal and a weekly time commitment. Your job is to generate a practical, structured roadmap to help them achieve this goal.

Use the inputs:
- Goal: {{userGoal}}
- Weekly time commitment: {{timeCommitment}}
- Number of weeks: {{numberOfWeeks}}

Generate a roadmap spanning EXACTLY ${numberOfWeeks} weeks. Each week should include:
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
Make the output clear, simple, practical, and encouraging. Ensure you provide exactly ${numberOfWeeks} weeks.`;

      const userPrompt = `Goal: ${userGoal}\nWeekly time commitment: ${timeCommitment}\nNumber of weeks: ${numberOfWeeks}`;
      
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
          max_tokens: 3000
        }),
      });

      const data = await response.json();
      let text: string = data.choices?.[0]?.message?.content ?? "";
      
      let jsonString = "";
      const firstCurly = text.indexOf('{');
      const lastCurly = text.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && firstCurly < lastCurly) {
        jsonString = text.slice(firstCurly, lastCurly + 1);
      } else {
        jsonString = text.trim();
      }

      try {
        roadmap = JSON.parse(jsonString);
      } catch (e) {
        try {
          const m = text.match(/\{[\s\S]+\}/);
          if (m) {
            roadmap = JSON.parse(m[0]);
          }
        } catch {
          roadmap = null;
        }
      }

      if (!roadmap || !roadmap.weeks || roadmap.weeks.length !== numberOfWeeks) {
        console.error("Invalid roadmap generated:", roadmap);
        return new Response(
          JSON.stringify({ error: `Failed to generate ${numberOfWeeks}-week roadmap.` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (user_id && userGoal && timeCommitment && supabaseUrl && supabaseKey) {
        await storeSupabaseRoadmap(user_id, userGoal, timeCommitment, numberOfWeeks, roadmap);
      }
    }

    console.log("Roadmap generated successfully:", roadmap.weeks.length, "weeks");
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
