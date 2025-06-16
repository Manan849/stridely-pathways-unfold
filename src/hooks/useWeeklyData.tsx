
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

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

export const useWeeklyData = (planId?: string) => {
  const [weeklyData, setWeeklyData] = useState<{ [weekNumber: number]: Week }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchWeekData = async (
    weekNumber: number,
    userGoal: string,
    timeCommitment: string,
    totalWeeks: number
  ): Promise<Week | null> => {
    if (weeklyData[weekNumber]) {
      return weeklyData[weekNumber];
    }

    // First check if we have stored data
    if (user?.id && planId) {
      try {
        const { data, error } = await supabase
          .from('user_plans')
          .select('plan')
          .eq('id', planId)
          .single();

        if (!error && data?.plan?.weeklyDetails?.[weekNumber]) {
          const weekData = data.plan.weeklyDetails[weekNumber];
          setWeeklyData(prev => ({ ...prev, [weekNumber]: weekData }));
          return weekData;
        }
      } catch (err) {
        console.error('Error fetching stored week data:', err);
      }
    }

    // Generate new data if not found
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        "https://iapwbozpkpulkrpxppqy.functions.supabase.co/generate-detailed-transformation-plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userGoal,
            timeCommitment,
            week: weekNumber,
            totalWeeks,
          })
        }
      );

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to generate week.");
      }

      const { weekData } = await res.json();
      if (!weekData) throw new Error("No week data found.");

      // Store the generated data
      if (user?.id && planId) {
        try {
          const { data: currentPlan } = await supabase
            .from('user_plans')
            .select('plan')
            .eq('id', planId)
            .single();

          if (currentPlan) {
            const updatedPlan = {
              ...currentPlan.plan,
              weeklyDetails: {
                ...currentPlan.plan.weeklyDetails,
                [weekNumber]: weekData
              }
            };

            await supabase
              .from('user_plans')
              .update({ plan: updatedPlan })
              .eq('id', planId);
          }
        } catch (err) {
          console.error('Error storing week data:', err);
        }
      }

      setWeeklyData(prev => ({ ...prev, [weekNumber]: weekData }));
      return weekData;
    } catch (e: any) {
      setError(e.message || "Unable to load content for this week.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    weeklyData,
    fetchWeekData,
    loading,
    error,
  };
};
