
import React, { useState } from "react";

type Week = {
  week: number;
  skills: string[];
  habits: string[];
  milestone: string;
  resources: string[];
};

type TransformationPlan = {
  weeks?: Week[];
};

type Props = {
  transformationPlan: TransformationPlan | null;
};

const bgCard = "#F2F2F7";

const TransformationPlanCards: React.FC<Props> = ({ transformationPlan }) => {
  if (!transformationPlan?.weeks || transformationPlan.weeks.length === 0) {
    return (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg" style={{ background: bgCard }}>
        Your roadmap will appear here after you generate a plan.
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

const WeekCard: React.FC<{ week: Week }> = ({ week }) => {
  const [habitsState, setHabitsState] = useState<boolean[]>(() =>
    week.habits ? Array(week.habits.length).fill(false) : []
  ); // Local state for checkboxes

  return (
    <div
      className="rounded-2xl p-7 md:p-8 mb-0 flex flex-col gap-6 shadow-card"
      style={{ background: bgCard }}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-primary mb-2">{`Week ${week.week}`}</h2>

      {/* Skills to Build */}
      <div>
        <div className="font-medium mb-1">Skills to Build</div>
        <ul className="list-disc ml-5 text-base marker:text-accent/80">
          {week.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Habits */}
      <div>
        <div className="font-medium mb-1">Habits</div>
        <div className="flex flex-col gap-2">
          {week.habits.map((habit, i) => (
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
          ))}
        </div>
      </div>

      {/* Milestone */}
      <div>
        <div className="font-medium mb-1">Milestone</div>
        <span className="inline-block px-3 py-1 rounded-full text-gray-700 text-sm font-semibold bg-gray-200">{week.milestone}</span>
      </div>

      {/* Resources */}
      <div>
        <div className="font-medium mb-1">Resources</div>
        <ul className="flex flex-col gap-2 ml-1">
          {week.resources.map((r, i) => {
            // Extract link if present
            const urlRegex = /https?:\/\/[^\s]+/;
            const match = r.match(urlRegex);
            let title = r;
            let url;
            if (match) {
              url = match[0];
              title = r.replace(urlRegex, "").replace(/\s*[-–—:]\s*$/, "").trim();
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
    </div>
  );
};

export default TransformationPlanCards;
