
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as LinkIcon } from "lucide-react";

type WeekData = {
  week: number;
  skills: string[];
  habits: string[];
  milestone: string;
  resources: string[];
};

type Props = {
  week: WeekData;
  persistKey: string;
};

const WeeklyRoadmapCard: React.FC<Props> = ({ week, persistKey }) => {
  // Persisted state for completed habits (per week)
  const [checkedHabits, setCheckedHabits] = useState<boolean[]>(() => {
    const stored = localStorage.getItem(persistKey);
    return stored ? JSON.parse(stored) : Array(week.habits.length).fill(false);
  });

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(checkedHabits));
  }, [checkedHabits, persistKey]);

  // If num habits changes between renders (unlikely but possible)
  useEffect(() => {
    if (checkedHabits.length !== week.habits.length) {
      setCheckedHabits(Array(week.habits.length).fill(false));
    }
    // eslint-disable-next-line
  }, [week.habits.length]);

  // Helper to try to extract a URL from a resource string
  const extractLink = (text: string): { title: string; url?: string } => {
    const urlRegex = /https?:\/\/[^\s]+/;
    const match = text.match(urlRegex);
    if (match) {
      return {
        title: text.replace(urlRegex, "").replace(/\s*[-–—:]\s*$/, "").trim(),
        url: match[0],
      };
    }
    return { title: text };
  };

  return (
    <div className="bg-section rounded-2xl shadow-card p-6 md:p-8 mb-6 last:mb-0 flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-primary mb-2">{`Week ${week.week}`}</h2>
      {/* Skills */}
      <div>
        <div className="font-medium mb-1 flex items-center gap-2">
          <span role="img" aria-label="brain">🧠</span> Skills to Build
        </div>
        <ul className="list-disc ml-5 text-base marker:text-accent/80">
          {week.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
      {/* Habits */}
      <div>
        <div className="font-medium mb-1 flex items-center gap-2">
          <span role="img" aria-label="person">🧘</span> Habits to Practice
        </div>
        <div className="flex flex-col gap-2">
          {week.habits.map((habit, i) => (
            <label key={i} className="inline-flex items-center gap-2 text-base cursor-pointer select-none">
              <Checkbox
                checked={checkedHabits[i] || false}
                onCheckedChange={(val) =>
                  setCheckedHabits((prev) => {
                    const arr = [...prev];
                    arr[i] = !!val;
                    return arr;
                  })
                }
              />
              <span className={checkedHabits[i] ? "line-through text-primary/40" : ""}>
                {habit}
              </span>
            </label>
          ))}
        </div>
      </div>
      {/* Milestone */}
      <div>
        <div className="font-medium mb-1 flex items-center gap-2">
          <span role="img" aria-label="target">🎯</span> Weekly Milestone
        </div>
        <Badge variant="outline" className="bg-gray-200 text-primary font-semibold rounded-full px-3 py-1">
          {week.milestone}
        </Badge>
      </div>
      {/* Resources */}
      <div>
        <div className="font-medium mb-1 flex items-center gap-2">
          <span role="img" aria-label="link">🔗</span> Resources
        </div>
        <ul className="flex flex-col gap-2 ml-1">
          {week.resources.map((r, i) => {
            const item = extractLink(r);
            return (
              <li key={i}>
                {item.url ? (
                  <a
                    className="text-accent font-medium flex items-center gap-1 hover:underline"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon size={16} className="inline-block" />
                    {item.title ? `${item.title} – ` : ""}
                    {item.url.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyRoadmapCard;
