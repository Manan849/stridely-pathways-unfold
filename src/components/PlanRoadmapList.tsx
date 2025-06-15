import WeeklyRoadmapCard from "@/components/WeeklyRoadmapCard";
import TransformationPlanCards from "./TransformationPlanCards";

type PlanRoadmapListProps = {
  loading: boolean;
  roadmap: any;
};

const PlanRoadmapList = ({ loading, roadmap }: PlanRoadmapListProps) => (
  <div>
    {loading ? (
      <div className="rounded-2xl bg-section shadow-card p-8 text-center text-primary/60 font-medium text-lg" style={{ background: "#F2F2F7" }}>
        Generating your personalized roadmap...
      </div>
    ) : (
      <TransformationPlanCards transformationPlan={roadmap} />
    )}
  </div>
);

export default PlanRoadmapList;
