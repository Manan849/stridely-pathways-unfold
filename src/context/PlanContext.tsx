import React, { createContext, useContext, useState } from "react";
import { useUser } from "@/hooks/useUser";

type Day = {
  day: string;
  focus: string;
  tasks: string[];
  habits: string[];
  reflectionPrompt: string;
};

type Week = {
  week: number;
  theme: string;
  summary: string;
  weeklyMilestone: string;
  weeklyReward: string;
  resources: string[];
  days: Day[];
};

type TransformationPlan = {
  weeks: Week[];
  id?: string; // Optionally track plan id here if loaded from db
};

type PlanContextType = {
  transformationPlan: TransformationPlan;
  setTransformationPlan: React.Dispatch<React.SetStateAction<TransformationPlan>>;
  userGoal: string;
  setUserGoal: React.Dispatch<React.SetStateAction<string>>;
  timeCommitment: string;
  setTimeCommitment: React.Dispatch<React.SetStateAction<string>>;
  planId?: string; // populated if loaded from db
  userId?: string;
};

const defaultPlan: TransformationPlan = { weeks: [] };

const PlanContext = createContext<PlanContextType>({
  transformationPlan: defaultPlan,
  setTransformationPlan: () => {},
  userGoal: "",
  setUserGoal: () => {},
  timeCommitment: "10 hrs/week",
  setTimeCommitment: () => {},
  planId: undefined,
  userId: undefined,
});

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [transformationPlan, setTransformationPlan] = useState<TransformationPlan>(defaultPlan);
  const [userGoal, setUserGoal] = useState<string>("");
  const [timeCommitment, setTimeCommitment] = useState<string>("10 hrs/week");

  // If a plan is loaded from Supabase, you could set the planId here.
  // For now, we add a userId context value so hooks can use it conveniently.
  const { user } = useUser();

  return (
    <PlanContext.Provider value={{
      transformationPlan, setTransformationPlan,
      userGoal, setUserGoal,
      timeCommitment, setTimeCommitment,
      planId: (transformationPlan as any).id, // for db-backed plans
      userId: user?.id,
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
