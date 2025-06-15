
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DailyProgress = {
  id: string;
  user_id: string;
  plan_id: string;
  date: string;
  habits_completed: boolean[];
  tasks_completed: boolean[];
};

export function useDailyProgress(planId?: string, userId?: string) {
  return useQuery({
    queryKey: ["daily_progress", planId, userId],
    queryFn: async () => {
      if (!planId || !userId) return [];
      const { data, error } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("plan_id", planId)
        .eq("user_id", userId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as DailyProgress[];
    },
    enabled: !!planId && !!userId,
  });
}

export function useUpsertDailyProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (progress: Omit<DailyProgress, "id"> & { id?: string }) => {
      const { error, data } = await supabase
        .from("daily_progress")
        .upsert([progress], { onConflict: "user_id,plan_id,date" })
        .select()
        .single();
      if (error) throw error;
      return data as DailyProgress;
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ["daily_progress", v.plan_id, v.user_id] });
    },
  });
}
