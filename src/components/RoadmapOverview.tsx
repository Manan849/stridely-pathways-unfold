
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/context/PlanContext";

type WeekSummary = {
  week: number;
  theme: string;
  summary: string;
  weeklyMilestone: string;
};

type PlanMeta = {
  userGoal?: string;
  timeCommitment?: string;
  totalWeeks?: number;
};

const DEFAULT_TOTAL_WEEKS = 12; // Fallback if cannot infer

export default function RoadmapOverview({ planMeta }: { planMeta: PlanMeta | null }) {
  const [weekSummaries, setWeekSummaries] = useState<WeekSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalWeeks, setTotalWeeks] = useState<number>(DEFAULT_TOTAL_WEEKS);

  useEffect(() => {
    if (!planMeta?.userGoal || !planMeta?.timeCommitment) return;
    setWeekSummaries([]);
    setError(null);
    setLoading(false);

    // Fetch week 1 to infer totalWeeks if needed, then fetch remaining weeks summaries
    (async () => {
      setLoading(true);
      const summaries: WeekSummary[] = [];
      let N = planMeta.totalWeeks || DEFAULT_TOTAL_WEEKS;
      for (let w = 1; w <= N; w++) {
        try {
          const res = await fetch(
            "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-detailed-transformation-plan",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userGoal: planMeta.userGoal,
                timeCommitment: planMeta.timeCommitment,
                week: w,
                totalWeeks: N,
              }),
            }
          );
          if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error || "Failed to fetch week.");
          }
          const { weekData } = await res.json();
          if (w === 1 && weekData?.totalWeeks && weekData.totalWeeks > 1) {
            setTotalWeeks(weekData.totalWeeks);
            N = weekData.totalWeeks;
          }
          summaries.push({
            week: weekData.week,
            theme: weekData.theme,
            summary: weekData.summary,
            weeklyMilestone: weekData.weeklyMilestone,
          });
          setWeekSummaries([...summaries]); // so UI updates as they arrive
        } catch (e: any) {
          setError(e.message || "Failed to load a week.");
          break;
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [planMeta?.userGoal, planMeta?.timeCommitment]);

  if (!planMeta?.userGoal || !planMeta?.timeCommitment) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg">
        Enter a goal above to view your roadmap overview.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-100 shadow-card p-8 text-center text-red-500 font-medium text-lg">
        {error}
      </div>
    );
  }

  if (loading && weekSummaries.length === 0) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg animate-pulse">
        Loading roadmap overview...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="mb-4 text-xl font-bold text-primary">Roadmap Overview ({totalWeeks} weeks)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekSummaries.map((w) => (
          <div key={w.week}>
            <Card className="rounded-xl p-4 bg-white">
              <div className="font-semibold text-primary mb-1">
                Week {w.week}: <span className="text-accent">{w.theme}</span>
              </div>
              <div className="mb-2 text-primary/80">{w.summary}</div>
              <div className="text-sm"><span className="font-medium">Milestone:</span> {w.weeklyMilestone}</div>
            </Card>
          </div>
        ))}
        {loading && (
          <div className="col-span-full text-center text-primary/60">
            Loading more weeks...
          </div>
        )}
      </div>
    </div>
  );
}
