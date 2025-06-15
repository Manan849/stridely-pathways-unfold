
import React, { useState } from "react";
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

type TransformationPlan = {
  weeks?: Week[];
};

type Props = {
  transformationPlan: TransformationPlan | null;
};

const bgCard = "#F2F2F7";

export default function TransformationPlanCards({ transformationPlan }: Props) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  if (!transformationPlan?.weeks || transformationPlan.weeks.length === 0) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg" style={{ background: bgCard }}>
        Enter a goal to receive your personalized transformation roadmap.
      </div>
    );
  }

  const weeks = transformationPlan.weeks;
  const currentWeek = weeks[currentWeekIndex];

  return (
    <div className="flex flex-col gap-8 mb-8">
      <WeekCard week={currentWeek} key={currentWeek.week || currentWeekIndex} />
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="px-4 py-2 rounded-md bg-gray-200 text-primary font-semibold disabled:opacity-50"
          disabled={currentWeekIndex === 0}
          onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
        >
          ← Previous
        </button>
        <div className="self-center text-primary font-semibold">{`Week ${currentWeek.week} of ${weeks.length}`}</div>
        <button
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:opacity-50"
          disabled={currentWeekIndex === weeks.length - 1}
          onClick={() => setCurrentWeekIndex(i => Math.min(weeks.length - 1, i + 1))}
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
              // Try to split as "title – url"
              const arr = r.split("–").map(x => x.trim());
              if (arr.length >= 2) {
                return (
                  <a key={i} href={arr[1]} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                    {arr[0]}
                  </a>
                );
              }
              return (
                <span key={i}>{r}</span>
              );
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
