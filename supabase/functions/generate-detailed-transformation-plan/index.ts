
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
          "tasks": ["Task 1 (specific)", "Task 2 (specific)", "Task 3 (optional)"] ,
          "habits": ["Habit 1 (specific, daily recurring)", "Habit 2 (optional)"] ,
          "reflectionPrompt": "[Deeply engaging and reflective question prompting insight and emotional connection]"
        },
        {
          "day": "Tuesday",
          "focus": "[...]",
          "tasks": ["[...]"],
          "habits": ["[...]"],
          "reflectionPrompt": "[...]"
        }
      ]
    }
  ]
}

### 🧩 Instructions for Crafting the Roadmap:
* **Personalization:** Tailor every task, habit, milestone, and reflection prompt specifically to the user's stated goal.
* **Practicality:** Tasks must be realistically achievable within the user’s weekly time commitment.
* **Depth & Clarity:** Tasks and habits must be explicit, detailed, actionable, and unambiguous.
* **Psychological Reinforcement:** Use positive reinforcement techniques in weekly rewards to sustain motivation.
* **Progressive Structure:** Gradually increase complexity and difficulty week-over-week.
* **Reflection and Integration:** Ensure each reflection prompt encourages introspection, self-awareness, emotional intelligence, and cognitive integration.
* **Resource Curation:** Choose highly relevant, credible, and practical resources to support skill-building and knowledge acquisition.
Output JSON ONLY, inside a single code block. Do not add backticks or markdown.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates content based on user prompts.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.6
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("No AI response.");
    }

    // Extract JSON from the AI output (strip code block if present)
    let text = data.choices[0].message.content.trim();
    try {
      if (text.startsWith("```") && text.includes("{")) {
        text = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
      }
      const roadmap = JSON.parse(text);
      return new Response(JSON.stringify({ roadmap }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Parsing error:", err, "AI Text:", text);
      return new Response(JSON.stringify({ error: "AI JSON parsing failed.", raw: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("generate-detailed-transformation-plan error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
