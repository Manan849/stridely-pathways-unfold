
import React from "react";
import { PlanProvider, usePlan } from "@/context/PlanContext";
import NextBigGoalCard from "@/components/NextBigGoalCard";
import TransformationPlanCards from "@/components/TransformationPlanCards";

export default function PlanPage() {
  return (
    <PlanProvider>
      <div className="pt-24 max-w-4xl mx-auto px-4 min-h-screen">
        <div className="mb-8">
          <NextBigGoalCard />
        </div>
        <TransformationPlanCardsWrapper />
      </div>
    </PlanProvider>
  );
}

// Updated: supply plan meta as needed for dynamic fetching/generation
function TransformationPlanCardsWrapper() {
  const { userGoal, timeCommitment } = usePlan();

  // Provide the minimal info needed for dynamic content generation
  const planMeta = userGoal && timeCommitment
    ? { userGoal, timeCommitment }
    : null;

  return <TransformationPlanCards transformationPlan={planMeta} />;
}
