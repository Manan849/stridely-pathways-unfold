
import React, { useState } from "react";
import { PlanProvider, usePlan } from "@/context/PlanContext";
import NextBigGoalCard from "@/components/NextBigGoalCard";
import TransformationPlanCards from "@/components/TransformationPlanCards";
import RoadmapOverview from "@/components/RoadmapOverview";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PlanPage() {
  const [view, setView] = useState<"overview" | "detailed">("overview");
  const isMobile = useIsMobile();

  return (
    <PlanProvider>
      <div className={`pt-20 pb-6 px-2 sm:pt-20 sm:pb-10 sm:px-4 md:pt-24 md:pb-16 md:px-6 mx-auto min-h-screen ${
        isMobile ? "max-w-full" : "max-w-6xl"
      }`}>
        <div className="mb-6 sm:mb-8">
          <NextBigGoalCard />
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5 justify-center">
          <button
            className={`px-4 sm:px-5 py-2 rounded-full font-semibold transition-all ${
              view === "overview"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-primary hover:bg-gray-200"
            }`}
            onClick={() => setView("overview")}
          >
            📋 Overview
          </button>
          <button
            className={`px-4 sm:px-5 py-2 rounded-full font-semibold transition-all ${
              view === "detailed"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-primary hover:bg-gray-200"
            }`}
            onClick={() => setView("detailed")}
          >
            🔎 Detailed
          </button>
        </div>

        <div className="w-full">
          {view === "overview" && <TransformationPlanOverviewWrapper />}
          {view === "detailed" && <TransformationPlanCardsWrapper />}
        </div>
      </div>
    </PlanProvider>
  );
}

function TransformationPlanOverviewWrapper() {
  const { userGoal, timeCommitment, numberOfWeeks } = usePlan();

  const planMeta = userGoal && timeCommitment
    ? { userGoal, timeCommitment, numberOfWeeks }
    : null;

  return <RoadmapOverview planMeta={planMeta} />;
}

function TransformationPlanCardsWrapper() {
  const { userGoal, timeCommitment, numberOfWeeks } = usePlan();

  const planMeta = userGoal && timeCommitment
    ? { userGoal, timeCommitment, numberOfWeeks }
    : null;

  return <TransformationPlanCards transformationPlan={planMeta} />;
}
