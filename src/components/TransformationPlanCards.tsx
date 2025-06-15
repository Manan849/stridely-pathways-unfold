
import React, { useState } from "react";

type DayPlan = {
  day: string;
  focus: string;
  tasks: string[];
  habits: string[];
  reflectionPrompt: string;
};

type WeekPlan = {
  week: number;
  theme: string;
  summary: string;
  weeklyMilestone: string;
  weeklyReward: string;
  resources: string[];
  days: DayPlan[];
};

type TransformationPlan = {
  weeks?: WeekPlan[];
};

type Props = {
  transformationPlan: TransformationPlan | null;
};

const bgCard = "#F2F2F7";
const bgWhite = "#FFFFFF";

const TransformationPlanCards: React.FC<Props> = ({ transformationPlan }) => {
  if (!transformationPlan?.weeks || transformationPlan.weeks.length === 0) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg" style={{ background: bgWhite }}>
        Enter a goal to receive your personalized transformation roadmap.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mb-6">
      {transformationPlan.weeks.map((week, idx) => (
        <WeekCard week={week} key={week.week || idx} />
      ))}
    </div>
  );
};

const WeekCard: React.FC<{ week: WeekPlan }> = ({ week }) => {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 mb-0 flex flex-col gap-5 shadow-card"
      style={{ background: bgCard }}
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-1">
          Week {week.week} – {week.theme}
        </h2>
        <div className="text-primary/70 mb-2">{week.summary}</div>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-8 mb-2">
        <span className="font-medium flex items-center gap-2"><span role="img" aria-label="Milestone">🎯</span>Milestone:&nbsp;<span className="font-normal">{week.weeklyMilestone}</span></span>
        <span className="font-medium flex items-center gap-2"><span role="img" aria-label="Reward">🎁</span>Reward:&nbsp;<span className="font-normal">{week.weeklyReward}</span></span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-medium flex items-center gap-2"><span role="img" aria-label="Resources">📚</span>Resources:</span>
        <ul className="list-disc ml-5 text-base marker:text-accent/80">
          {week.resources.map((resource, i) => {
            // Extract link if possible
            const urlRegex = /https?:\/\/[^\s]+/;
            const match = resource.match(urlRegex);
            let title = resource;
            let url;
            if (match) {
              url = match[0];
              title = resource.replace(urlRegex, "").replace(/\s*[-–—:]\s*$/, "").trim();
            }
            return (
              <li key={i}>
                {url ? (
                  <a
                    href={url}
                    className="text-[#007AFF] underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {title ? `${title} – ` : ""}{url.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span>{title}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {/* Days list */}
      <div className="flex flex-col gap-4 mt-2">
        {week.days.map((day, i) => (
          <DayCard day={day} weekIndex={week.week} key={i} />
        ))}
      </div>
    </div>
  );
};

const DayCard: React.FC<{ day: DayPlan, weekIndex: number }> = ({ day }) => {
  const [habitsState, setHabitsState] = useState<boolean[]>(() =>
    day.habits ? Array(day.habits.length).fill(false) : []
  );

  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-inner flex flex-col gap-2 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="font-semibold text-base">
          {day.day} – {day.focus}
        </span>
      </div>
      <div>
        <div className="font-medium mt-1">📝 Tasks:</div>
        <ul className="list-disc ml-5 text-primary/95 marker:text-accent">
          {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
        </ul>
      </div>
      <div>
        <div className="font-medium mt-1">✅ Habits:</div>
        <div className="flex flex-col gap-2 mt-1">
          {day.habits && day.habits.length > 0 ? (
            day.habits.map((habit, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-base cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={habitsState[i] || false}
                  onChange={() =>
                    setHabitsState(prev => {
                      const arr = [...prev];
                      arr[i] = !arr[i];
                      return arr;
                    })
                  }
                  className="form-checkbox rounded text-blue-600 accent-blue-500 focus:ring-blue-400"
                />
                <span className={habitsState[i] ? "line-through text-primary/40" : ""}>{habit}</span>
              </label>
            ))
          ) : (
            <span className="text-primary/60 italic">No habits today</span>
          )}
        </div>
      </div>
      <div>
        <div className="font-medium mt-1">🪞 Reflection Prompt:</div>
        <span className="italic text-primary/80">{day.reflectionPrompt}</span>
      </div>
    </div>
  );
};

export default TransformationPlanCards;
