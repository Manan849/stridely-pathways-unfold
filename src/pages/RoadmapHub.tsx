
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUserPlans } from "@/hooks/useUserPlans";
import RoadmapOverview from "@/components/RoadmapOverview";
import TransformationPlanCards from "@/components/TransformationPlanCards";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RoadmapHub() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans, loading } = useUserPlans();
  const [view, setView] = useState<"overview" | "detailed">("overview");
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (plans.length > 0) {
      // Find the specific plan or use the most recent one
      const plan = planId 
        ? plans.find(p => p.id === planId) 
        : plans[0];
      
      if (plan) {
        setCurrentPlan(plan);
      } else if (planId) {
        // Plan not found, redirect to plan creation
        navigate('/plan');
      }
    }
  }, [plans, planId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-2xl"></div>
            <div className="h-64 bg-white rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Card className="p-8">
            <h1 className="text-2xl font-bold mb-4">No Roadmap Found</h1>
            <p className="text-gray-600 mb-6">Create your first roadmap to get started.</p>
            <Button onClick={() => navigate('/plan')} className="bg-blue-500 hover:bg-blue-600">
              Create Roadmap
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const planMeta = {
    userGoal: currentPlan.goal,
    timeCommitment: currentPlan.time_commitment,
    numberOfWeeks: currentPlan.number_of_weeks
  };

  return (
    <div className={`pt-20 pb-6 px-2 sm:pt-20 sm:pb-10 sm:px-4 md:pt-24 md:pb-16 md:px-6 mx-auto min-h-screen ${
      isMobile ? "max-w-full" : "max-w-6xl"
    }`}>
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/progress')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">{currentPlan.goal}</h1>
          <p className="text-gray-600">{currentPlan.time_commitment} • {currentPlan.number_of_weeks} weeks</p>
        </div>
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
        {view === "overview" && <RoadmapOverview planMeta={planMeta} />}
        {view === "detailed" && <TransformationPlanCards transformationPlan={planMeta} />}
      </div>
    </div>
  );
}
