import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import DayDetailView from "@/components/DayDetailView";
import { useWeeklyData } from "@/hooks/useWeeklyData";
import { usePlan } from "@/context/PlanContext";

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
  [weekIdx: number]: Week | undefined;
};

type Props = {
  transformationPlan: { userGoal?: string; timeCommitment?: string; numberOfWeeks?: number } | null;
};

const bgCard = "#F2F2F7";

export default function TransformationPlanCards({ transformationPlan }: Props) {
  const [currentWeekIdx, setCurrentWeekIdx] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const { planId } = usePlan();
  const { weeklyData, fetchWeekData, loading, error } = useWeeklyData(planId);

  const currentWeek = weeklyData[currentWeekIdx];

  useEffect(() => {
    if (transformationPlan?.userGoal && transformationPlan.timeCommitment && !currentWeek && !loading) {
      fetchWeekData(
        currentWeekIdx,
        transformationPlan.userGoal,
        transformationPlan.timeCommitment,
        transformationPlan.numberOfWeeks || 12
      );
    }
  }, [currentWeekIdx, transformationPlan, currentWeek, loading, fetchWeekData]);

  const handlePrev = () => {
    if (currentWeekIdx > 1) setCurrentWeekIdx(i => i - 1);
    setSelectedDay(null);
  };

  const handleNext = () => {
    const maxWeeks = transformationPlan?.numberOfWeeks || 12;
    if (currentWeekIdx < maxWeeks) {
      setCurrentWeekIdx(i => i + 1);
      if (transformationPlan?.userGoal && transformationPlan.timeCommitment) {
        fetchWeekData(
          currentWeekIdx + 1,
          transformationPlan.userGoal,
          transformationPlan.timeCommitment,
          maxWeeks
        );
      }
    }
    setSelectedDay(null);
  };

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

  if (selectedDay) {
    return (
      <div className="flex flex-col gap-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedDay(null)}
          className="self-start"
        >
          ← Back to Week Overview
        </Button>
        <DayDetailView day={selectedDay} planId={planId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mb-8">
      <WeekCard week={currentWeek} onDayClick={setSelectedDay} key={currentWeek.week || currentWeekIdx} />
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="px-4 py-2 rounded-md bg-gray-200 text-primary font-semibold disabled:opacity-50"
          disabled={currentWeekIdx === 1}
          onClick={handlePrev}
        >
          ← Previous
        </button>
        <div className="self-center text-primary font-semibold">
          {`Week ${currentWeekIdx}` + (transformationPlan.numberOfWeeks ? ` of ${transformationPlan.numberOfWeeks}` : "")}
        </div>
        <button
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:opacity-50"
          disabled={transformationPlan.numberOfWeeks ? currentWeekIdx >= transformationPlan.numberOfWeeks : false}
          onClick={handleNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const WeekCard: React.FC<{ week: Week; onDayClick: (day: Day) => void }> = ({ week, onDayClick }) => (
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
        <DayCard day={day} onDayClick={onDayClick} key={i} />
      ))}
    </div>
  </Card>
);

const DayCard: React.FC<{ day: Day; onDayClick: (day: Day) => void }> = ({ day, onDayClick }) => {
  const [habits, setHabits] = useState(Array(day.habits.length).fill(false));
  
  return (
    <div className="bg-white rounded-xl shadow-card p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="font-bold text-primary mb-1">{`${day.day} – ${day.focus}`}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDayClick(day)}
          className="p-1 h-auto"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <div className="font-medium mb-1">📝 Tasks</div>
        <ul className="list-disc ml-5 text-base marker:text-accent/80">
          {day.tasks.slice(0, 2).map((task, i) => (
            <li key={i}>{task}</li>
          ))}
          {day.tasks.length > 2 && (
            <li className="text-gray-500">+ {day.tasks.length - 2} more...</li>
          )}
        </ul>
      </div>
      {day.habits && day.habits.length > 0 && (
        <div>
          <div className="font-medium mb-1">✅ Habits</div>
          <div className="flex flex-col gap-2">
            {day.habits.slice(0, 2).map((h, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-base cursor-pointer select-none">
                <Checkbox checked={habits[i]} onCheckedChange={() => setHabits(prev => {
                  const arr = [...prev];
                  arr[i] = !arr[i];
                  return arr;
                })} />
                <span className={habits[i] ? "line-through text-primary/40" : ""}>{h}</span>
              </label>
            ))}
            {day.habits.length > 2 && (
              <span className="text-sm text-gray-500">+ {day.habits.length - 2} more habits...</span>
            )}
          </div>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDayClick(day)}
        className="mt-2"
      >
        View Day Details
      </Button>
    </div>
  );
};
