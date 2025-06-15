
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";

type PlanGoalFormProps = {
  goal: string;
  setGoal: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
};

const PlanGoalForm = ({
  goal,
  setGoal,
  time,
  setTime,
  loading,
  onSubmit,
  error,
}: PlanGoalFormProps) => (
  <div className="rounded-2xl bg-white shadow-card border border-gray-100 p-8 flex flex-col gap-8">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
        <span role="img" aria-label="target">🎯</span>
        What’s your next big goal?
      </h2>
      <p className="text-primary/65 text-base">
        Let’s plan your next 3–6 months. Dream big!
      </p>
    </div>
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="goal" className="font-medium text-primary mb-1">
          Describe what you want to achieve in the next 3–6 months
        </label>
        <Input
          id="goal"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. Launch a startup, become a product designer, learn to code"
          required
          className="text-base"
          autoComplete="off"
          maxLength={160}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-primary mb-1">
          How many hours per week can you commit?
        </label>
        <TimeDropdown value={time} onChange={setTime} />
      </div>
      <Button
        type="submit"
        className="w-full mt-2 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
        disabled={loading || !goal || !time}
        size="lg"
      >
        {loading ? "Generating..." : "Generate My Transformation Plan"}
      </Button>
    </form>
    {error && (
      <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
    )}
  </div>
);

export default PlanGoalForm;
