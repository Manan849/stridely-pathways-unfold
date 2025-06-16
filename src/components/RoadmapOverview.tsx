
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/context/PlanContext";
import { useUserPlans } from "@/hooks/useUserPlans";

type WeekSummary = {
  week: number;
  theme: string;
  summary: string;
  weeklyMilestone: string;
};

type PlanMeta = {
  userGoal?: string;
  timeCommitment?: string;
  numberOfWeeks?: number;
};

export default function RoadmapOverview({ planMeta }: { planMeta: PlanMeta | null }) {
  const { transformationPlan } = usePlan();
  const { plans } = useUserPlans();
  const [weekSummaries, setWeekSummaries] = useState<WeekSummary[]>([]);

  useEffect(() => {
    // First try to get data from transformationPlan
    if (transformationPlan?.weeks && transformationPlan.weeks.length > 0) {
      const summaries = transformationPlan.weeks.map(week => ({
        week: week.week,
        theme: week.theme || `Week ${week.week} Focus`,
        summary: week.summary || "Working on core fundamentals",
        weeklyMilestone: week.weeklyMilestone || "Complete weekly goals",
      }));
      setWeekSummaries(summaries);
    } 
    // Fallback to stored plans
    else if (plans.length > 0 && plans[0].plan?.weeks) {
      const storedWeeks = plans[0].plan.weeks;
      const summaries = storedWeeks.map((week: any) => ({
        week: week.week,
        theme: week.theme || `Week ${week.week} Focus`,
        summary: week.summary || "Working on core fundamentals", 
        weeklyMilestone: week.weeklyMilestone || week.milestone || "Complete weekly goals",
      }));
      setWeekSummaries(summaries);
    }
  }, [transformationPlan, plans]);

  if (!planMeta?.userGoal || !planMeta?.timeCommitment) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg">
        Enter a goal above to view your roadmap overview.
      </div>
    );
  }

  if (weekSummaries.length === 0) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg">
        Generate your plan above to see the roadmap overview.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="mb-4 text-xl font-bold text-primary">
        Roadmap Overview ({weekSummaries.length} weeks)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekSummaries.map((w) => (
          <div key={w.week}>
            <Card className="rounded-xl p-4 bg-white">
              <div className="font-semibold text-primary mb-1">
                Week {w.week}: <span className="text-accent">{w.theme}</span>
              </div>
              <div className="mb-2 text-primary/80">{w.summary}</div>
              <div className="text-sm">
                <span className="font-medium">Milestone:</span> {w.weeklyMilestone}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
