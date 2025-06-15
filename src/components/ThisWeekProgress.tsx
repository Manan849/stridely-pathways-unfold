
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type WeekData = {
  week: number;
  skills: string[];
  habits: string[];
  milestone: string;
  resources: string[];
};

type Props = {
  currentWeek: WeekData | null;
  currentWeekIndex: number;
  totalWeeks: number;
  persistPrefix: string;
  onWeekComplete?: () => void;
  progressHistory: boolean[];
  setProgressHistory: (v: boolean[]) => void;
};

const getStorageKey = (prefix: string, week: number) =>
  `${prefix}-progress-week-${week}`;

const ThisWeekProgress: React.FC<Props> = ({
  currentWeek,
  currentWeekIndex,
  totalWeeks,
  persistPrefix,
  onWeekComplete,
  progressHistory,
  setProgressHistory,
}) => {
  const [checkedHabits, setCheckedHabits] = useState<boolean[]>([]);
  const [milestoneChecked, setMilestoneChecked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Sync from localStorage on mount/currentWeek change
  useEffect(() => {
    if (!currentWeek) {
      setCheckedHabits([]);
      setMilestoneChecked(false);
      return;
    }
    const habitKey = getStorageKey(persistPrefix, currentWeek.week) + "-habits";
    const milestoneKey = getStorageKey(persistPrefix, currentWeek.week) + "-milestone";
    const storedHabits = localStorage.getItem(habitKey);
    const storedMilestone = localStorage.getItem(milestoneKey);
    setCheckedHabits(
      storedHabits
        ? JSON.parse(storedHabits)
        : Array(currentWeek.habits.length).fill(false)
    );
    setMilestoneChecked(storedMilestone ? JSON.parse(storedMilestone) : false);
  }, [currentWeek, persistPrefix]);

  // Persist on habit/milestone check change
  useEffect(() => {
    if (!currentWeek) return;
    localStorage.setItem(
      getStorageKey(persistPrefix, currentWeek.week) + "-habits",
      JSON.stringify(checkedHabits)
    );
  }, [checkedHabits, currentWeek, persistPrefix]);
  useEffect(() => {
    if (!currentWeek) return;
    localStorage.setItem(
      getStorageKey(persistPrefix, currentWeek.week) + "-milestone",
      JSON.stringify(milestoneChecked)
    );
  }, [milestoneChecked, currentWeek, persistPrefix]);

  // Auto detect completion of week
  useEffect(() => {
    if (!currentWeek) return;
    const allComplete =
      checkedHabits.length === currentWeek.habits.length &&
      checkedHabits.every(Boolean) &&
      milestoneChecked;
    if (allComplete && !progressHistory[currentWeekIndex]) {
      setProgressHistory(
        progressHistory.map((v, idx) => (idx === currentWeekIndex ? true : v))
      );
      setJustCompleted(true);
      if (onWeekComplete) onWeekComplete();
    }
    // eslint-disable-next-line
  }, [checkedHabits, milestoneChecked]);

  // Simple confetti/check animation (minimal for MVP)
  useEffect(() => {
    if (justCompleted) {
      setTimeout(() => setJustCompleted(false), 1400);
    }
  }, [justCompleted]);

  if (!currentWeek) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6 w-full max-w-md mx-auto animate-fade-in">
        <h3 className="font-bold text-xl mb-2 text-primary">
          This Week’s Progress
        </h3>
        <div className="text-primary/60">
          Once your plan is live, you’ll be able to track progress here.
        </div>
      </div>
    );
  }

  // Streak calculation: count consecutive true values in progressHistory
  let streak = 0;
  for (let i = 0; i < progressHistory.length; ++i) {
    if (!progressHistory[i]) break;
    streak++;
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6 w-full max-w-md mx-auto animate-fade-in relative">
      <h3 className="font-bold text-xl mb-2 text-primary flex items-center gap-2">
        This Week’s Progress
      </h3>
      <div className="text-primary/60 text-sm mb-4">
        Week {currentWeekIndex + 1} of {totalWeeks}
      </div>
      {/* Habits */}
      <div className="mb-5">
        <div className="font-semibold mb-1 flex items-center gap-2">
          🧘 Habits to Practice
        </div>
        <div className="flex flex-col gap-2">
          {currentWeek.habits.map((habit, idx) => (
            <label key={idx} className="flex items-center gap-2 text-base cursor-pointer select-none">
              <Checkbox
                checked={!!checkedHabits[idx]}
                onCheckedChange={val => {
                  setCheckedHabits(prev => {
                    const next = [...prev];
                    next[idx] = !!val;
                    return next;
                  });
                }}
              />
              <span className={checkedHabits[idx] ? "line-through text-primary/40" : ""}>{habit}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Milestone */}
      <div className="mb-5">
        <div className="font-semibold mb-1 flex items-center gap-2">
          🎯 Weekly Milestone
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-200 text-primary font-semibold rounded-full px-4 py-2 text-base">
            {currentWeek.milestone}
          </Badge>
          <label className="flex items-center gap-2">
            <Checkbox checked={milestoneChecked} onCheckedChange={setMilestoneChecked} />
            <span className="text-sm text-primary/70 select-none">Mark as done</span>
          </label>
        </div>
      </div>
      {/* CTA + Streak */}
      <Button
        type="button"
        className={`w-full mt-2 font-bold text-lg py-3 rounded-xl transition-all ${
          checkedHabits.every(Boolean) && milestoneChecked
            ? "bg-[#00c853] hover:bg-[#34d06d] text-white"
            : "bg-[#007AFF] hover:bg-[#005bb5] text-white"
        }`}
        disabled={!(checkedHabits.length === currentWeek.habits.length && checkedHabits.every(Boolean) && milestoneChecked)}
        onClick={() => {
          setProgressHistory(
            progressHistory.map((v, idx) => (idx === currentWeekIndex ? true : v))
          );
          setJustCompleted(true);
          if (onWeekComplete) onWeekComplete();
        }}
      >
        Check Off Progress
      </Button>
      <div className="mt-4 flex items-center gap-2 text-base font-semibold">
        <span className="text-2xl">🔥</span>
        Streak: <span className="text-primary">{streak}</span> {streak === 1 ? "week" : "weeks"} completed
      </div>
      {/* confetti/check svg */}
      {justCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <svg width="72" height="72" fill="none">
            <circle cx="36" cy="36" r="34" stroke="#00c853" strokeWidth="4" fill="#e8f5e9" />
            <path d="M25 37.5l10 9 15-18" stroke="#00c853" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ThisWeekProgress;
