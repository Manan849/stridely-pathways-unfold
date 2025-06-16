
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

export type ProgressData = {
  totalPlans: number;
  completedWeeks: number;
  weeklyCompletionRate: number;
  currentStreak: number;
  habitConsistency: Array<{ name: string; consistency: number }>;
  taskCompletion: Array<{ name: string; completed: number; total: number; remaining: number }>;
};

export const useProgressData = () => {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalPlans: 0,
    completedWeeks: 0,
    weeklyCompletionRate: 0,
    currentStreak: 0,
    habitConsistency: [],
    taskCompletion: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchProgressData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch user plans
      const { data: plans } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id);

      // Fetch habit progress
      const { data: habitProgress } = await supabase
        .from('habit_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: true });

      // Fetch daily progress
      const { data: dailyProgress } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Calculate metrics
      const totalPlans = plans?.length || 0;
      const completedWeeks = habitProgress?.filter(p => p.milestone_completed).length || 0;
      
      // Calculate weekly completion rate
      const totalWeeks = plans?.reduce((sum, plan) => sum + plan.number_of_weeks, 0) || 0;
      const weeklyCompletionRate = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

      // Calculate current streak
      const sortedProgress = habitProgress?.sort((a, b) => b.week - a.week) || [];
      let currentStreak = 0;
      for (const progress of sortedProgress) {
        if (progress.milestone_completed) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Generate habit consistency data
      const habitConsistency = Array.from({ length: 5 }, (_, i) => ({
        name: `Week ${i + 1}`,
        consistency: Math.max(0, weeklyCompletionRate - Math.random() * 20),
      }));

      // Generate task completion data for current week
      const taskCompletion = [
        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
      ].map(day => {
        const total = 3 + Math.floor(Math.random() * 3);
        const completed = Math.floor(Math.random() * total);
        return {
          name: day,
          completed,
          total,
          remaining: total - completed,
        };
      });

      setProgressData({
        totalPlans,
        completedWeeks,
        weeklyCompletionRate,
        currentStreak,
        habitConsistency,
        taskCompletion,
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [user?.id]);

  return { progressData, loading, refetch: fetchProgressData };
};
