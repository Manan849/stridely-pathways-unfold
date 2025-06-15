
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";
import WeeklyRoadmapCard from "@/components/WeeklyRoadmapCard";
import ThisWeekProgress from "@/components/ThisWeekProgress";
import WeeklyCheckIn from "@/components/WeeklyCheckIn";
import { toast } from "@/components/ui/use-toast";

const PLAN_PERSIST_KEY = "stridely-plan";
const PROGRESS_KEY = "stridely-progress-history";

const Plan = () => {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [progressHistory, setProgressHistory] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Control for displaying Weekly Check-In:
  const [showWeeklyCheckIn, setShowWeeklyCheckIn] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<null | { habits?: string[]; milestone?: string; focus?: string }>(null);

  // Sync progress history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (roadmap?.weeks && Array.isArray(roadmap.weeks)) {
      setProgressHistory(
        stored
          ? JSON.parse(stored)
          : Array(roadmap.weeks.length).fill(false)
      );
    }
  }, [roadmap]);

  // Reset currentWeekIndex on new plan
  useEffect(() => {
    setCurrentWeekIndex(0);
  }, [roadmap]);

  // Persist progressHistory changes
  useEffect(() => {
    if (progressHistory && roadmap?.weeks?.length) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressHistory));
    }
  }, [progressHistory, roadmap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const res = await fetch(
        "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userGoal: goal,
            timeCommitment: time
          })
        }
      );
      if (!res.ok) {
        let errorMsg = "Failed to generate roadmap.";
        try {
          const { error } = await res.json();
          errorMsg = error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const { roadmap } = await res.json();
      if (!roadmap || !roadmap.weeks) throw new Error("No roadmap data found.");
      setRoadmap(roadmap);
      setProgressHistory(Array(roadmap.weeks.length).fill(false));
      setCurrentWeekIndex(0);
      toast({
        title: "Success!",
        description: "Transformation plan generated."
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to generate roadmap."
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger Weekly Check-In if: all progress is checked/completed for the week
  useEffect(() => {
    if (!roadmap?.weeks || !roadmap.weeks[currentWeekIndex]) {
      setShowWeeklyCheckIn(false);
      return;
    }
    // All habits checked & milestone done
    const weekProgressKey = `stridely-progress-week-${roadmap.weeks[currentWeekIndex].week}`;
    const checkedHabits = localStorage.getItem(weekProgressKey + "-habits");
    const habitsDone = checkedHabits && JSON.parse(checkedHabits).every(Boolean);
    const milestoneDone = localStorage.getItem(weekProgressKey + "-milestone");
    const isMilestoneDone = milestoneDone && JSON.parse(milestoneDone);
    // Or: Plan end of week, e.g., Sunday
    const today = new Date();
    const isSunday = today.getDay() === 0;

    if ((habitsDone && isMilestoneDone) || isSunday) {
      setShowWeeklyCheckIn(true);
    } else {
      setShowWeeklyCheckIn(false);
    }
  }, [roadmap, currentWeekIndex]);

  // Handler: Accept AI's Plan Update
  const handleAcceptUpdate = (updates: { habits?: string[]; milestone?: string; focus?: string }) => {
    setPendingUpdate(null);
    // Mutate *next* week
    if (
      roadmap &&
      roadmap.weeks &&
      roadmap.weeks.length > currentWeekIndex + 1
    ) {
      const weeks = [...roadmap.weeks];
      const next = { ...weeks[currentWeekIndex + 1] };
      if (updates.habits) next.habits = updates.habits;
      if (updates.milestone) next.milestone = updates.milestone;
      // Could also use focus, etc.
      weeks[currentWeekIndex + 1] = next;
      setRoadmap({ ...roadmap, weeks });
    }
    setShowWeeklyCheckIn(false);
  };

  // Handler: skip reflection
  const handleSkipUpdate = () => {
    setPendingUpdate(null);
    setShowWeeklyCheckIn(false);
  };

  return (
    <div className="pt-28 max-w-4xl mx-auto px-4">
      <div className="mb-12">
        <div className="rounded-2xl bg-white shadow-card border border-gray-100 p-8 flex flex-col gap-8">
          {/* Section Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
              <span role="img" aria-label="target">🎯</span>
              What’s your next big goal?
            </h2>
            <p className="text-primary/65 text-base">
              Let’s plan your next 3–6 months. Dream big!
            </p>
          </div>
          {/* Inputs */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Goal field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="goal" className="font-medium text-primary mb-1">Describe what you want to achieve in the next 3–6 months</label>
              <Input
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Launch a startup, become a product designer, learn to code"
                required
                className="text-base"
                autoComplete="off"
                maxLength={160}
              />
            </div>
            {/* Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-primary mb-1">How many hours per week can you commit?</label>
              <TimeDropdown value={time} onChange={setTime} />
            </div>
            {/* CTA Button */}
            <Button
              type="submit"
              className="w-full mt-2 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
              disabled={loading || !goal || !time}
              size="lg"
            >
              {loading ? "Generating..." : "Generate My Transformation Plan"}
            </Button>
          </form>
          {error && (
            <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
          )}
        </div>
      </div>
      {/* Roadmap and Progress Section */}
      <div className="flex flex-col md:flex-row md:gap-8 items-start">
        {/* Main Roadmap (left on desktop, below on mobile) */}
        <div className="flex-1 w-full">
          <div className="flex flex-col gap-6 mb-6">
            {loading ? (
              <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg">
                Generating your personalized roadmap...
              </div>
            ) : roadmap?.weeks && roadmap.weeks.length > 0 ? (
              roadmap.weeks.map((w: any, i: number) => (
                <WeeklyRoadmapCard
                  key={w.week || i}
                  week={w}
                  persistKey={`stridely-wk-habits-${w.week}`}
                />
              ))
            ) : (
              <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg">
                Your roadmap will appear here once you set your next big goal.
              </div>
            )}
          </div>
        </div>
        {/* Progress Sidebar (right on desktop, above on mobile) */}
        <div className="w-full md:w-[350px] shrink-0 md:sticky md:top-28">
          <ThisWeekProgress
            currentWeek={
              roadmap?.weeks && roadmap.weeks.length > 0
                ? roadmap.weeks[currentWeekIndex]
                : null
            }
            currentWeekIndex={currentWeekIndex}
            totalWeeks={roadmap?.weeks?.length || 0}
            persistPrefix={"stridely"}
            progressHistory={progressHistory}
            setProgressHistory={setProgressHistory}
            onWeekComplete={undefined}
          />
          {/* Weekly Check-In section */}
          {showWeeklyCheckIn && roadmap?.weeks && roadmap.weeks[currentWeekIndex] && (
            <WeeklyCheckIn
              goal={goal}
              weekData={roadmap.weeks[currentWeekIndex]}
              onAccept={handleAcceptUpdate}
              onSkip={handleSkipUpdate}
            />
          )}
          {roadmap?.weeks?.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-end">
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                disabled={currentWeekIndex === 0}
                onClick={() => setCurrentWeekIndex((i) => Math.max(0, i - 1))}
              >
                ← Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                disabled={
                  !roadmap?.weeks ||
                  currentWeekIndex >= roadmap.weeks.length - 1
                }
                onClick={() =>
                  setCurrentWeekIndex((i) =>
                    Math.min(roadmap.weeks.length - 1, i + 1)
                  )
                }
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plan;

