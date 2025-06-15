
import React from "react";
import NextBigGoalCard from "@/components/NextBigGoalCard";
import TransformationPlanCards from "@/components/TransformationPlanCards";
import { usePlan } from "@/context/PlanContext";

const Plan = () => {
  const { transformationPlan } = usePlan();

  return (
    <main className="bg-white min-h-screen pt-24 pb-12 px-3 md:px-0 flex flex-col gap-10">
      <NextBigGoalCard />
      <div className="w-full max-w-3xl mx-auto">
        <TransformationPlanCards transformationPlan={transformationPlan} />
      </div>
    </main>
  );
};

export default Plan;
