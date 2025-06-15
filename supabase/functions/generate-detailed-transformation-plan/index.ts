
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

    // --- NEW ARCHITECTURAL PROMPT BELOW ---
    const prompt = `
### 🚀 Comprehensive Roadmap Generation Architecture

**Purpose:**
To generate a deeply personalized, actionable, structured, and psychologically engaging transformation roadmap to guide users from setting a life goal to achieving measurable success over a period of 10–20 weeks.

### 📐 Roadmap Architectural Overview:

**1. Weekly Breakdown:**
* Clearly numbered (Week 1, Week 2, ...).
* Each week has a specific motivational **theme**.
* Includes a concise and motivational **weekly summary**.
* Defines one major **weekly milestone** (clear, actionable outcome).
* Suggests one appealing **weekly reward** for completing all activities (psychological reinforcement).
* Provides curated **resources** (1–2 links, videos, books, tools).

**2. Daily Breakdown:**
Each week comprises 7 clearly structured daily segments. Each day includes:
* **Day name** (Monday, Tuesday, etc.).
* **Daily focus**: Clear one-line description of the day's primary objective.
* **Tasks**: 2–3 short, specific tasks (<45 minutes each), realistic for the chosen time commitment.
* **Habits**: 1–3 clearly defined habits aligned with the weekly theme, consistently trackable.
* **Reflection Prompt**: Thought-provoking question designed to deepen understanding and solidify learning.

### 🌟 Psychological Considerations:
* Ensure progressive difficulty (week 1 easier, gradually more challenging).
* Balance cognitive, practical, and emotional elements in tasks and habits.
* Introduce periodic days focused on rest, reflection, and consolidation of learning (e.g., Sundays).

### 🎯 Detailed AI Prompt for Comprehensive Roadmap Generation:

**You are a highly structured, personalized AI-driven transformation planner.**
A user has shared their ambitious life goal and their weekly available time commitment. Your role is to create a deeply engaging and meticulously structured transformation roadmap to empower them to achieve significant measurable progress within a timeframe of 10–20 weeks.

**Inputs:**
* **User Goal:** ${userGoal}
* **Weekly Available Time:** ${timeCommitment}

Based on these inputs, construct a highly detailed roadmap following this exact structure:

**Overall JSON Output Format:**

\`\`\`json
{
  "weeks": [
    {
      "week": 1,
      "theme": "[Motivational Weekly Theme]",
      "summary": "[Brief motivational sentence summarizing week's focus and intent]",
      "weeklyMilestone": "[Clear and measurable achievement by week's end]",
      "weeklyReward": "[Enjoyable, psychologically appealing reward]",
      "resources": ["Resource Name – URL", "Resource Name – URL"],
      "days": [
        {
          "day": "Monday",
          "focus": "[Brief daily goal summary]",
          "tasks": ["Task 1 (specific)", "Task 2 (specific)", "Task 3 (optional)"],
          "habits": ["Habit 1 (specific, daily recurring)", "Habit 2 (optional)"],
          "reflectionPrompt": "[Deeply engaging and reflective question prompting insight and emotional connection]"
        }
      ]
    }
  ]
}
\`\`\`

### 🧩 Instructions for Crafting the Roadmap:
* **Personalization:** Tailor every task, habit, milestone, and reflection prompt specifically to the user's stated goal.
* **Practicality:** Tasks must be realistically achievable within the user’s weekly time commitment.
* **Depth & Clarity:** Tasks and habits must be explicit, detailed, actionable, and unambiguous.
* **Psychological Reinforcement:** Use positive reinforcement techniques in weekly rewards to sustain motivation.
* **Progressive Structure:** Gradually increase complexity and difficulty week-over-week.
* **Reflection and Integration:** Ensure each reflection prompt encourages introspection, self-awareness, emotional intelligence, and cognitive integration.
* **Resource Curation:** Choose highly relevant, credible, and practical resources to support skill-building and knowledge acquisition.

The final output should feel like a personalized blueprint guiding the user clearly, motivating them consistently, and deeply engaging their mind and emotions, ultimately transforming their ambition into reality.
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
