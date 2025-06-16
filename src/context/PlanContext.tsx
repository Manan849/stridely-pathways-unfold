import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserPlans } from "@/hooks/useUserPlans";

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
  id?: string;
};

type PlanContextType = {
  transformationPlan: TransformationPlan;
  setTransformationPlan: React.Dispatch<React.SetStateAction<TransformationPlan>>;
  userGoal: string;
  setUserGoal: React.Dispatch<React.SetStateAction<string>>;
  timeCommitment: string;
  setTimeCommitment: React.Dispatch<React.SetStateAction<string>>;
  numberOfWeeks: number;
  setNumberOfWeeks: React.Dispatch<React.SetStateAction<number>>;
  planId?: string;
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
  numberOfWeeks: 12,
  setNumberOfWeeks: () => {},
  planId: undefined,
  userId: undefined,
});

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [transformationPlan, setTransformationPlan] = useState<TransformationPlan>(defaultPlan);
  const [userGoal, setUserGoal] = useState<string>("");
  const [timeCommitment, setTimeCommitment] = useState<string>("10 hrs/week");
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(12);

  const { user } = useUser();
  const { plans, createPlan } = useUserPlans();

  // Load the most recent plan when plans change
  useEffect(() => {
    if (plans.length > 0) {
      const mostRecentPlan = plans[0];
      setUserGoal(mostRecentPlan.goal);
      setTimeCommitment(mostRecentPlan.time_commitment);
      setNumberOfWeeks(mostRecentPlan.number_of_weeks);
      setTransformationPlan(mostRecentPlan.plan);
    }
  }, [plans]);

  // Override setTransformationPlan to also save to database
  const handleSetTransformationPlan = async (plan: TransformationPlan) => {
    setTransformationPlan(plan);
    
    if (user?.id && userGoal && timeCommitment && numberOfWeeks) {
      await createPlan({
        goal: userGoal,
        time_commitment: timeCommitment,
        number_of_weeks: numberOfWeeks,
        plan,
      });
    }
  };

  return (
    <PlanContext.Provider value={{
      transformationPlan, 
      setTransformationPlan: handleSetTransformationPlan,
      userGoal, setUserGoal,
      timeCommitment, setTimeCommitment,
      numberOfWeeks, setNumberOfWeeks,
      planId: plans.length > 0 ? plans[0].id : undefined,
      userId: user?.id,
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
