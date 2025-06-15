import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";
import React, { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { toast } from "@/hooks/use-toast";

export default function NextBigGoalCard() {
  const { userGoal, setUserGoal, timeCommitment, setTimeCommitment, setTransformationPlan, userId } = usePlan();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-or-fetch-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            userGoal,
            timeCommitment
          })
        }
      );
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to generate roadmap.");
      }
      const { roadmap } = await res.json();
      if (!roadmap?.weeks) {
        throw new Error("No roadmap data found.");
      }
      setTransformationPlan(roadmap);
      toast({
        title: "Success!",
        description: "Transformation plan generated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating plan",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mb-8 bg-white shadow-card border border-gray-100 rounded-2xl">
      <CardHeader>
        <CardTitle>Your Next Big Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div>
            <Label htmlFor="user-goal" className="mb-2 block font-semibold">
              What’s your next big goal?
            </Label>
            <Input
              id="user-goal"
              placeholder="e.g. Build a startup, become a designer"
              value={userGoal}
              onChange={e => setUserGoal(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="hours-dropdown" className="mb-2 block font-semibold">
              How many hours/week can you commit?
            </Label>
            <TimeDropdown
              value={timeCommitment}
              onChange={setTimeCommitment}
            />
          </div>
          <Button
            className="w-full mt-4 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
            onClick={handleGenerate}
            disabled={loading || !userGoal || !timeCommitment}
            size="lg"
          >
            {loading ? "Generating..." : "Generate My Transformation Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
