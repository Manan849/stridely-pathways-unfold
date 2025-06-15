
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

function TransformationPlanCardsWrapper() {
  const { transformationPlan } = usePlan();
  return <TransformationPlanCards transformationPlan={transformationPlan} />;
}
