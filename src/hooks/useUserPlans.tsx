
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

export type UserPlan = {
  id: string;
  user_id: string;
  goal: string;
  time_commitment: string;
  number_of_weeks: number;
  plan: any;
  current_week_index: number;
  created_at: string;
  updated_at: string;
};

export const useUserPlans = () => {
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchPlans = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: {
    goal: string;
    time_commitment: string;
    number_of_weeks: number;
    plan: any;
  }) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_plans')
        .insert({
          user_id: user.id,
          ...planData,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchPlans();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updatePlanProgress = async (planId: string, weekIndex: number) => {
    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ current_week_index: weekIndex })
        .eq('id', planId);

      if (error) throw error;
      await fetchPlans();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user?.id]);

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlanProgress,
    refetch: fetchPlans,
  };
};
