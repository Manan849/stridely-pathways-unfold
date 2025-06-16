import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";
import React, { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper: get the ANON key from the client file as a constant.
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHdib3pwa3B1bGtycHhwcHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTg0MjQsImV4cCI6MjA2NTUzNDQyNH0.Y4Gx54vceTvlnbG31z6gnskXsNUCaXobjhOPZo6Oa_E";
export default function NextBigGoalCard() {
  const {
    userGoal,
    setUserGoal,
    timeCommitment,
    setTimeCommitment,
    setTransformationPlan,
    userId
  } = usePlan();
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-or-fetch-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON_KEY}`
        },
        body: JSON.stringify({
          user_id: userId,
          userGoal,
          timeCommitment
        })
      });
      if (!res.ok) {
        let message = "Failed to generate roadmap.";
        try {
          const {
            error
          } = await res.json();
          message = error || message;
        } catch {}
        throw new Error(message);
      }
      const {
        roadmap
      } = await res.json();
      if (!roadmap?.weeks) {
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
        description: error.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };
  return;
}