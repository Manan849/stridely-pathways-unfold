import React from "react";
import { PlanProvider, usePlan } from "@/context/PlanContext";
import NextBigGoalCard from "@/components/NextBigGoalCard";
import TransformationPlanCards from "@/components/TransformationPlanCards";
import RoadmapOverview from "@/components/RoadmapOverview";

export default function PlanPage() {
  const [view, setView] = useState<"overview" | "detailed">("overview");

  return (
    <PlanProvider>
      <div className="pt-24 max-w-4xl mx-auto px-4 min-h-screen">
        <div className="mb-8">
          <NextBigGoalCard />
        </div>

        {/* Tab toggle */}
        <div className="flex gap-3 mb-5 justify-center">
          <button
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              view === "overview"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-primary hover:bg-gray-200"
            }`}
            onClick={() => setView("overview")}
          >
            📋 Overview
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              view === "detailed"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-primary hover:bg-gray-200"
            }`}
            onClick={() => setView("detailed")}
          >
            🔎 Detailed
          </button>
        </div>

        {/* Conditionally render Overview or Detailed */}
        {view === "overview" && <TransformationPlanOverviewWrapper />}
        {view === "detailed" && <TransformationPlanCardsWrapper />}
      </div>
    </PlanProvider>
  );
}

// Pulls plan meta for RoadmapOverview
function TransformationPlanOverviewWrapper() {
  const { userGoal, timeCommitment } = usePlan();

  const planMeta = userGoal && timeCommitment
    ? { userGoal, timeCommitment }
    : null;

  return <RoadmapOverview planMeta={planMeta} />;
}

function TransformationPlanCardsWrapper() {
  const { userGoal, timeCommitment } = usePlan();

  const planMeta = userGoal && timeCommitment
    ? { userGoal, timeCommitment }
    : null;

  return <TransformationPlanCards transformationPlan={planMeta} />;
}
