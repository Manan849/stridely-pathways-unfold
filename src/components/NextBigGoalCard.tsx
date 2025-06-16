import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";
import React, { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHdib3pwa3B1bGtycHhwcHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTg0MjQsImV4cCI6MjA2NTUzNDQyNH0.Y4Gx54vceTvlnbG31z6gnskXsNUCaXobjhOPZo6Oa_E";

export default function NextBigGoalCard() {
  const {
    userGoal,
    setUserGoal,
    timeCommitment,
    setTimeCommitment,
    setTransformationPlan,
    userId,
    numberOfWeeks,
    setNumberOfWeeks,
  } = usePlan();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-or-fetch-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            userGoal,
            timeCommitment,
            numberOfWeeks,
          }),
        }
      );
      if (!res.ok) {
        let message = "Failed to generate roadmap.";
        try {
          const { error } = await res.json();
          message = error || message;
        } catch {}
        throw new Error(message);
      }
      const { roadmap } = await res.json();
      if (!roadmap?.weeks) {
        throw new Error("No roadmap data found.");
      }
      
      // This will now save to database via the updated context
      await setTransformationPlan(roadmap);
      
      toast({
        title: "Success!",
        description: "Transformation plan generated and saved.",
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
              What's your next big goal?
            </Label>
            <Input
              id="user-goal"
              placeholder="e.g. Build a startup, become a designer"
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="hours-dropdown" className="mb-2 block font-semibold">
              How many hours/week can you commit?
            </Label>
            <TimeDropdown value={timeCommitment} onChange={setTimeCommitment} />
          </div>
          <div>
            <Label htmlFor="weeks-input" className="mb-2 block font-semibold">
              How many weeks for your plan?
            </Label>
            <Input
              id="weeks-input"
              type="number"
              placeholder="e.g. 12"
              value={numberOfWeeks}
              onChange={(e) => setNumberOfWeeks(parseInt(e.target.value) || 12)}
              disabled={loading}
              min="4"
              max="52"
            />
          </div>
          <Button
            className="w-full mt-4 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
            onClick={handleGenerate}
            disabled={loading || !userGoal || !timeCommitment || !numberOfWeeks}
            size="lg"
          >
            {loading ? "Generating..." : "Generate My Transformation Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
