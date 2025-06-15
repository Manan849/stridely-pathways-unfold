
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/PlanContext";
import TimeDropdown from "@/components/TimeDropdown";
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function NextBigGoalCard() {
  const { userGoal, setUserGoal, timeCommitment, setTimeCommitment, setTransformationPlan } = usePlan();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-roadmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
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
      if (!roadmap || !roadmap.weeks) {
        throw new Error("No roadmap data found.");
      }
      setTransformationPlan(roadmap);
      toast({
        title: "Success!",
        description: "Transformation plan generated."
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
              disabled={loading}
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
          <Button className="w-full mt-4" onClick={handleGenerate} disabled={loading || !userGoal || !timeCommitment}>
            {loading ? "Generating..." : "Generate My Transformation Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
