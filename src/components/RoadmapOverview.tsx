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

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-detailed-transformation-plan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userGoal: planMeta.userGoal,
              timeCommitment: planMeta.timeCommitment,
              totalWeeks: planMeta.totalWeeks || 12,
              mode: "overview"
            }),
          }
        );
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch overview.");
        }
        const { weekSummaries } = await res.json();
        setWeekSummaries(weekSummaries || []);
      } catch (e: any) {
        setError(e.message || "Failed to load overview.");
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
      <div className="mb-4 text-xl font-bold text-primary">Roadmap Overview ({weekSummaries.length} weeks)</div>
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
            Loading weeks...
          </div>
        )}
      </div>
    </div>
  );
}
