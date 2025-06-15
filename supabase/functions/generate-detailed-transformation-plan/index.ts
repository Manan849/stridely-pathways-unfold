
// Upgrade: Accept week number and return one week at a time, with no arbitrary week limits

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
    const { userGoal, timeCommitment, week, totalWeeks } = await req.json();

    // This prompt still asks for a total number of weeks for contextual motivational logic 
    const prompt = `
A user wants to achieve the following goal: "${userGoal}".
They can spend about "${timeCommitment}" each week.
Their transformation roadmap should last a total of ${totalWeeks} weeks, broken into motivational weekly segments, each with unique focus and tasks.

You are to ONLY generate the content for **WEEK ${week}** out of ${totalWeeks} (not all weeks at once). 

**Output each week's JSON exactly as follows:**
\`\`\`json
{
    "week": ${week},
    "theme": "[Weekly Theme]",
    "summary": "[Brief motivational sentence summarizing week's focus and intent]",
    "weeklyMilestone": "[Clear and measurable achievement by week's end]",
    "weeklyReward": "[Reward]",
    "resources": ["Resource Name – URL", ...],
    "days": [
      {
        "day": "Monday",
        "focus": "[Focus]",
        "tasks": ["Task 1", "Task 2", "..."],
        "habits": ["Habit 1", "..."],
        "reflectionPrompt": "[Question or reflective statement]"
      }
      // (6 more days)
    ]
}
\`\`\`

Make sure to adjust the week's challenge based on its position (week 1 easy, ${totalWeeks} hardest, progressive structure). Only return the JSON for this week, nothing else.
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
          { role: "system", content: "You are a highly structured AI transformation plan assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await aiRes.json();
    let weekData;
    try {
      const content = data.choices?.[0]?.message?.content || "";
      // Extract JSON from AI completion (code block or direct)
      let match = content.match(/```json\s*([\s\S]*?)```/);
      let jsonText = (match && match[1]) || content;
      // If JSON isn't in code block, attempt to extract { ... } region
      if (!match) {
        const firstBrace = content.indexOf("{");
        const lastBrace = content.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          jsonText = content.substring(firstBrace, lastBrace + 1);
        }
      }
      jsonText = jsonText.trim().replace(/^`{1,3}(json)?/, "").replace(/`{1,3}$/, "");
      jsonText = jsonText.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
      weekData = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse AI response for week:", e, data.choices?.[0]?.message?.content || "");
      return new Response(JSON.stringify({ error: "Failed to parse AI response for week." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ weekData }), {
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

