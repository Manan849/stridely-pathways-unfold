
// New: Only fetches/generates each week as requested, stores visited weeks in state
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type Day = {
  day: string;
  focus: string;
  tasks: string[];
  habits: string[];
  reflectionPrompt: string;
};

type Week = {
  week: number;
  theme: string;
  summary: string;
  weeklyMilestone: string;
  weeklyReward: string;
  resources: string[];
  days: Day[];
};

type DynamicTransformationPlan = {
  // Only populated weeks
  [weekIdx: number]: Week | undefined;
};

// We start not knowing how many weeks there are until user specifies!
type Props = {
  transformationPlan: { userGoal?: string; timeCommitment?: string; totalWeeks?: number } | null;
};

const bgCard = "#F2F2F7";

export default function TransformationPlanCards({ transformationPlan }: Props) {
  // Store each loaded/generated week's data using a mapping
  const [weeksByIndex, setWeeksByIndex] = useState<DynamicTransformationPlan>({});
  const [currentWeekIdx, setCurrentWeekIdx] = useState(1); // 1-based user-facing
  const [totalWeeks, setTotalWeeks] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to get an initial totalWeeks estimate, then allow user to advance beyond
  useEffect(() => {
    setError(null);
    if (!transformationPlan?.userGoal || !transformationPlan.timeCommitment) return;
    if (Object.keys(weeksByIndex).length === 0 && !loading) {
      fetchWeek(1);
    }
    // eslint-disable-next-line
  }, [transformationPlan]);

  async function fetchWeek(weekNumber: number) {
    if (weeksByIndex[weekNumber]) return; // already fetched
    setLoading(true);
    setError(null);
    try {
      // As totalWeeks might be unknown, fetch totalWeeks from plan or use a fallback (e.g. 12)
      const baseWeeks = transformationPlan?.totalWeeks ?? 12;
      const res = await fetch(
        "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-detailed-transformation-plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userGoal: transformationPlan?.userGoal,
            timeCommitment: transformationPlan?.timeCommitment,
            week: weekNumber,
            totalWeeks: baseWeeks,
          })
        }
      );
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to generate week.");
      }
      const { weekData } = await res.json();
      if (!weekData) throw new Error("No week data found.");
      setWeeksByIndex(prev => ({ ...prev, [weekNumber]: weekData }));
      if (typeof setTotalWeeks === "function" && !totalWeeks && weekData.week && weekData.totalWeeks) {
        setTotalWeeks(weekData.totalWeeks); // Allow for future upgrades
      }
    } catch (e: any) {
      setError(e.message || "Unable to load content for this week.");
    } finally {
      setLoading(false);
    }
  }

  // Navigation logic
  function handlePrev() {
    if (currentWeekIdx > 1) setCurrentWeekIdx(i => i - 1);
  }
  function handleNext() {
    setCurrentWeekIdx(i => i + 1);
    fetchWeek(currentWeekIdx + 1);
  }

  // On currentWeekIdx changed, fetch if not already present
  useEffect(() => {
    if (!weeksByIndex[currentWeekIdx]) {
      fetchWeek(currentWeekIdx);
    }
    // eslint-disable-next-line
  }, [currentWeekIdx]);

  const currentWeek = weeksByIndex[currentWeekIdx];

  // UI rendering -- always only shows one week
  if (!transformationPlan?.userGoal || !transformationPlan.timeCommitment) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg" style={{ background: bgCard }}>
        Enter a goal to receive your personalized transformation roadmap.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-100 shadow-card p-8 text-center text-red-500 font-medium text-lg" style={{ background: bgCard }}>
        {error}
      </div>
    );
  }

  if (loading || !currentWeek) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg animate-pulse" style={{ background: bgCard }}>
        Loading week {currentWeekIdx}...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mb-8">
      <WeekCard week={currentWeek} key={currentWeek.week || currentWeekIdx} />
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="px-4 py-2 rounded-md bg-gray-200 text-primary font-semibold disabled:opacity-50"
          disabled={currentWeekIdx === 1}
          onClick={handlePrev}
        >
          ← Previous
        </button>
        <div className="self-center text-primary font-semibold">
          {`Week ${currentWeekIdx}` + (totalWeeks ? ` of ${totalWeeks}` : "")}
        </div>
        <button
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:opacity-50"
          onClick={handleNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const WeekCard: React.FC<{ week: Week }> = ({ week }) => (
  <Card className="rounded-2xl p-7 md:p-8 bg-section mb-0 flex flex-col gap-6 shadow-card" style={{ background: bgCard }}>
    <div>
      <h2 className="text-2xl font-bold text-primary mb-1">{`Week ${week.week} – ${week.theme}`}</h2>
      <div className="text-primary/80 text-base mb-2">{week.summary}</div>
    </div>
    <div className="flex flex-col gap-2 md:flex-row md:gap-6">
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-semibold flex items-center gap-2">🎯 Milestone: <span className="font-normal">{week.weeklyMilestone}</span></div>
        <div className="font-semibold flex items-center gap-2">🎁 Reward: <span className="font-normal">{week.weeklyReward}</span></div>
        <div className="font-semibold flex items-center gap-2">📚 Resources:
          <span className="font-normal flex flex-col gap-1">
            {week.resources.map((r, i) => {
              const arr = r.split("–").map(x => x.trim());
              if (arr.length >= 2) {
                return (
                  <a key={i} href={arr[1]} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                    {arr[0]}
                  </a>
                );
              }
              return <span key={i}>{r}</span>;
            })}
          </span>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {week.days.map((day, i) => (
        <DayCard day={day} key={i} />
      ))}
    </div>
  </Card>
);

const DayCard: React.FC<{ day: Day }> = ({ day }) => {
  const [habits, setHabits] = useState(Array(day.habits.length).fill(false));
  return (
    <div className="bg-white rounded-xl shadow-card p-4 flex flex-col gap-2">
      <div className="font-bold text-primary mb-1">{`${day.day} – ${day.focus}`}</div>
      <div>
        <div className="font-medium mb-1">📝 Tasks</div>
        <ul className="list-disc ml-5 text-base marker:text-accent/80">
          {day.tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </div>
      {day.habits && day.habits.length > 0 && (
        <div>
          <div className="font-medium mb-1">✅ Habits</div>
          <div className="flex flex-col gap-2">
            {day.habits.map((h, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-base cursor-pointer select-none">
                <Checkbox checked={habits[i]} onCheckedChange={() => setHabits(prev => {
                  const arr = [...prev];
                  arr[i] = !arr[i];
                  return arr;
                })} />
                <span className={habits[i] ? "line-through text-primary/40" : ""}>{h}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <span className="italic text-primary/70">🪞 {day.reflectionPrompt}</span>
      </div>
    </div>
  );
};
