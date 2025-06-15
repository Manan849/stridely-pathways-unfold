
import { Button } from "@/components/ui/button";
import ThisWeekProgress from "@/components/ThisWeekProgress";
import WeeklyCheckIn from "@/components/WeeklyCheckIn";

type PlanSidebarProps = {
  roadmap: any;
  currentWeekIndex: number;
  setCurrentWeekIndex: (arg: (i: number) => number) => void;
  progressHistory: boolean[];
  setProgressHistory: (v: boolean[]) => void;
  showWeeklyCheckIn: boolean;
  handleAcceptUpdate: (updates: { habits?: string[], milestone?: string, focus?: string }) => void;
  handleSkipUpdate: () => void;
  goal: string;
};

const PlanSidebar = ({
  roadmap,
  currentWeekIndex,
  setCurrentWeekIndex,
  progressHistory,
  setProgressHistory,
  showWeeklyCheckIn,
  handleAcceptUpdate,
  handleSkipUpdate,
  goal
}: PlanSidebarProps) => (
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
          onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
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
            setCurrentWeekIndex(i =>
              Math.min(roadmap.weeks.length - 1, i + 1)
            )
          }
        >
          Next →
        </Button>
      </div>
    )}
  </div>
);

export default PlanSidebar;
