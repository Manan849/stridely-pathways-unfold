
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type WeekData = {
  week: number;
  skills: string[];
  habits: string[];
  milestone: string;
  resources: string[];
};

type AIResult = {
  encouragement: string;
  nextHabits?: string[];
  nextMilestone?: string;
  nextFocus?: string;
};

type Props = {
  goal: string;
  weekData: WeekData;
  onAccept: (updates: { habits?: string[]; milestone?: string; focus?: string }) => void;
  onSkip: () => void;
  onPlanUpdate?: (result: AIResult) => void;
};

async function fakeAIReflection(
  goal: string,
  weekNumber: number,
  week: WeekData,
  reflection: string
): Promise<AIResult> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        encouragement:
          "Great job reflecting! Every week is a new chance to grow. Keep going strong—progress beats perfection.",
        nextHabits: ["Review your notes every evening", "Practice mindful breathing for 5 min daily"],
        nextMilestone: "Complete the next module and share insights with a friend",
        nextFocus: "Stay consistent with daily review sessions"
      });
    }, 1200);
  });
}

const WeeklyCheckIn: React.FC<Props> = ({ goal, weekData, onAccept, onSkip, onPlanUpdate }) => {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    const result = await fakeAIReflection(goal, weekData.week, weekData, reflection);
    setAiResult(result);
    setLoading(false);
    if (onPlanUpdate) onPlanUpdate(result);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-8 mt-6 max-w-xl mx-auto animate-fade-in">
      <h3 className="font-bold text-xl mb-1 text-primary">Weekly Reflection &amp; Reset</h3>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reflection" className="block font-medium mb-1">
            How did this week go?
          </label>
          <Textarea
            id="reflection"
            className="text-base"
            rows={5}
            placeholder="What went well? What didn’t? What challenges did you face?"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            required
            maxLength={1000}
            disabled={!!aiResult}
          />
        </div>
        {!aiResult ? (
          <Button
            type="submit"
            className="w-full mt-2 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
            disabled={loading || !reflection.trim()}
          >
            {loading ? "Updating..." : "Update My Plan"}
          </Button>
        ) : null}
      </form>
      {/* AI Result */}
      {aiResult && (
        <div className="mt-6 p-4 bg-[#F2F2F7] rounded-xl shadow-inner">
          <div className="mb-2 italic text-primary/80">
            {aiResult.encouragement}
          </div>
          <div className="mb-2 font-semibold">Next Week’s Adjustments</div>
          <ul className="list-disc ml-6 mb-2">
            {aiResult.nextHabits && aiResult.nextHabits.length > 0 && (
              <li>
                <span className="font-medium">Habits: </span>
                <span>{aiResult.nextHabits.join(", ")}</span>
              </li>
            )}
            {aiResult.nextMilestone && (
              <li>
                <span className="font-medium">Milestone: </span>
                <span>{aiResult.nextMilestone}</span>
              </li>
            )}
            {aiResult.nextFocus && (
              <li>
                <span className="font-medium">Focus: </span>
                <span>{aiResult.nextFocus}</span>
              </li>
            )}
          </ul>
          {/* Accept/Skip */}
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-[#007AFF] hover:bg-[#005bb5] text-white font-bold"
              onClick={() => {
                onAccept({
                  habits: aiResult.nextHabits,
                  milestone: aiResult.nextMilestone,
                  focus: aiResult.nextFocus,
                });
              }}
            >
              Accept Updates
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCheckIn;
