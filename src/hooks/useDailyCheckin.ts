
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DailyCheckin = {
  id: string;
  user_id: string;
  plan_id: string;
  date: string; // YYYY-MM-DD
  mood: number | null;
  energy: number | null;
  reflection: string | null;
};

export function useDailyCheckins(planId?: string, userId?: string) {
  return useQuery({
    queryKey: ["daily_checkins", planId, userId],
    queryFn: async () => {
      if (!planId || !userId) return [];
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("plan_id", planId)
        .eq("user_id", userId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as DailyCheckin[];
    },
    enabled: !!planId && !!userId,
  });
}

export function useUpsertDailyCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCheckin: Omit<DailyCheckin, "id"> & { id?: string }) => {
      // If id exists: update; else: insert
      const { error, data } = await supabase
        .from("daily_checkins")
        .upsert([newCheckin], { onConflict: "user_id,plan_id,date" })
        .select()
        .single();
      if (error) throw error;
      return data as DailyCheckin;
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ["daily_checkins", v.plan_id, v.user_id] });
    },
  });
}
