
import React, { createContext, useContext, useState } from "react";

type TransformationPlan = {
  weeks: any[];
};

type PlanContextType = {
  transformationPlan: TransformationPlan;
  setTransformationPlan: React.Dispatch<React.SetStateAction<TransformationPlan>>;
  userGoal: string;
  setUserGoal: React.Dispatch<React.SetStateAction<string>>;
  timeCommitment: string;
  setTimeCommitment: React.Dispatch<React.SetStateAction<string>>;
};

const defaultPlan: TransformationPlan = { weeks: [] };

const PlanContext = createContext<PlanContextType>({
  transformationPlan: defaultPlan,
  setTransformationPlan: () => {},
  userGoal: "",
  setUserGoal: () => {},
  timeCommitment: "10 hrs/week",
  setTimeCommitment: () => {},
});

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [transformationPlan, setTransformationPlan] = useState<TransformationPlan>(defaultPlan);
  const [userGoal, setUserGoal] = useState<string>("");
  const [timeCommitment, setTimeCommitment] = useState<string>("10 hrs/week");

  return (
    <PlanContext.Provider value={{
      transformationPlan, setTransformationPlan,
      userGoal, setUserGoal,
      timeCommitment, setTimeCommitment
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
