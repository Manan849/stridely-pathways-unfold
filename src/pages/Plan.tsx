import { useState, useEffect } from "react";
import PlanGoalForm from "@/components/PlanGoalForm";
import PlanRoadmapList from "@/components/PlanRoadmapList";
import PlanSidebar from "@/components/PlanSidebar";
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

  const [showWeeklyCheckIn, setShowWeeklyCheckIn] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<null | { habits?: string[]; milestone?: string; focus?: string }>(null);

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

  useEffect(() => {
    setCurrentWeekIndex(0);
  }, [roadmap]);

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

  useEffect(() => {
    if (!roadmap?.weeks || !roadmap.weeks[currentWeekIndex]) {
      setShowWeeklyCheckIn(false);
      return;
    }
    const weekProgressKey = `stridely-progress-week-${roadmap.weeks[currentWeekIndex].week}`;
    const checkedHabits = localStorage.getItem(weekProgressKey + "-habits");
    const habitsDone = checkedHabits && JSON.parse(checkedHabits).every(Boolean);
    const milestoneDone = localStorage.getItem(weekProgressKey + "-milestone");
    const isMilestoneDone = milestoneDone && JSON.parse(milestoneDone);
    const today = new Date();
    const isSunday = today.getDay() === 0;

    if ((habitsDone && isMilestoneDone) || isSunday) {
      setShowWeeklyCheckIn(true);
    } else {
      setShowWeeklyCheckIn(false);
    }
  }, [roadmap, currentWeekIndex]);

  const handleAcceptUpdate = (updates: { habits?: string[]; milestone?: string; focus?: string }) => {
    setPendingUpdate(null);
    if (
      roadmap &&
      roadmap.weeks &&
      roadmap.weeks.length > currentWeekIndex + 1
    ) {
      const weeks = [...roadmap.weeks];
      const next = { ...weeks[currentWeekIndex + 1] };
      if (updates.habits) next.habits = updates.habits;
      if (updates.milestone) next.milestone = updates.milestone;
      weeks[currentWeekIndex + 1] = next;
      setRoadmap({ ...roadmap, weeks });
    }
    setShowWeeklyCheckIn(false);
  };

  const handleSkipUpdate = () => {
    setPendingUpdate(null);
    setShowWeeklyCheckIn(false);
  };

  return (
    <div className="pt-28 max-w-4xl mx-auto px-4">
      <div className="mb-12">
        <PlanGoalForm
          goal={goal}
          setGoal={setGoal}
          time={time}
          setTime={setTime}
          loading={loading}
          onSubmit={handleSubmit}
          error={error}
        />
      </div>
      <div className="flex flex-col md:flex-row md:gap-8 items-start">
        <div className="flex-1 w-full">
          <PlanRoadmapList loading={loading} roadmap={roadmap} />
        </div>
        <PlanSidebar
          roadmap={roadmap}
          currentWeekIndex={currentWeekIndex}
          setCurrentWeekIndex={setCurrentWeekIndex}
          progressHistory={progressHistory}
          setProgressHistory={setProgressHistory}
          showWeeklyCheckIn={showWeeklyCheckIn}
          handleAcceptUpdate={handleAcceptUpdate}
          handleSkipUpdate={handleSkipUpdate}
          goal={goal}
        />
      </div>
    </div>
  );
};

export default Plan;
