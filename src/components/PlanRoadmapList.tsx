
import WeeklyRoadmapCard from "@/components/WeeklyRoadmapCard";

type PlanRoadmapListProps = {
  loading: boolean;
  roadmap: any;
};

const PlanRoadmapList = ({ loading, roadmap }: PlanRoadmapListProps) => (
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
);

export default PlanRoadmapList;
