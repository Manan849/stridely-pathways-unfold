
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/PlanContext";
import TimeDropdown from "@/components/TimeDropdown";
import React from "react";

export default function NextBigGoalCard() {
  const { userGoal, setUserGoal, timeCommitment, setTimeCommitment } = usePlan();

  // This function will eventually trigger AI, but for now just logs the values
  const handleGenerate = () => {
    // Placeholder for AI Action: GenerateTransformationPlan
    // You would call your actual AI action here
    console.log("GenerateTransformationPlan", { userGoal, timeCommitment });
  };

  return (
    <Card className="w-full max-w-lg mx-auto mb-8">
      <CardHeader>
        <CardTitle>Your Next Big Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Goal input */}
          <div>
            <Label htmlFor="user-goal" className="mb-2 block">
              What’s your next big goal?
            </Label>
            <Input
              id="user-goal"
              placeholder="e.g. Launch a startup, become a product designer…"
              value={userGoal}
              onChange={e => setUserGoal(e.target.value)}
            />
          </div>
          {/* Time commitment dropdown */}
          <div>
            <Label htmlFor="hours-dropdown" className="mb-2 block">
              How many hours per week can you commit?
            </Label>
            <TimeDropdown
              value={timeCommitment}
              onChange={setTimeCommitment}
            />
          </div>
          {/* Generate button */}
          <Button className="w-full mt-4" onClick={handleGenerate}>
            Generate My Transformation Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
