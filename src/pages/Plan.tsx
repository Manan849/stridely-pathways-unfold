
import React from "react";
import { PlanProvider } from "@/context/PlanContext";
import NextBigGoalCard from "@/components/NextBigGoalCard";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PlanPage() {
  const isMobile = useIsMobile();

  return (
    <PlanProvider>
      <div className={`pt-20 pb-6 px-2 sm:pt-20 sm:pb-10 sm:px-4 md:pt-24 md:pb-16 md:px-6 mx-auto min-h-screen ${
        isMobile ? "max-w-full" : "max-w-6xl"
      }`}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Create Your Transformation Roadmap
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Set your goal, commit your time, and let AI create a personalized roadmap to guide your journey.
            </p>
          </div>
          <NextBigGoalCard />
        </div>
      </div>
    </PlanProvider>
  );
}
