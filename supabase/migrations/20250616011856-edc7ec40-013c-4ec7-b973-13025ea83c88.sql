
-- Add missing column to user_plans table for number_of_weeks
ALTER TABLE public.user_plans ADD COLUMN IF NOT EXISTS number_of_weeks integer NOT NULL DEFAULT 12;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_goal_time ON public.user_plans(user_id, goal, time_commitment, number_of_weeks);
CREATE INDEX IF NOT EXISTS idx_habit_progress_user_plan_week ON public.habit_progress(user_id, plan_id, week);

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own plans" ON public.user_plans;
DROP POLICY IF EXISTS "Users can manage their own plans" ON public.user_plans;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.habit_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.habit_progress;
DROP POLICY IF EXISTS "Users can view their own daily progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Users can manage their own daily progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Users can view their own checkins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Users can manage their own checkins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Users can view their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can manage their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can view their own adaptations" ON public.plan_adaptations;
DROP POLICY IF EXISTS "Users can manage their own adaptations" ON public.plan_adaptations;
DROP POLICY IF EXISTS "Users can view their own insights" ON public.user_insights;
DROP POLICY IF EXISTS "Users can manage their own insights" ON public.user_insights;

-- Create RLS policies for all tables
CREATE POLICY "Users can view their own plans" ON public.user_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own plans" ON public.user_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON public.habit_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own progress" ON public.habit_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily progress" ON public.daily_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own daily progress" ON public.daily_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own checkins" ON public.daily_checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own checkins" ON public.daily_checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reflections" ON public.reflections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own reflections" ON public.reflections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own adaptations" ON public.plan_adaptations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own adaptations" ON public.plan_adaptations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights" ON public.user_insights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own insights" ON public.user_insights
  FOR ALL USING (auth.uid() = user_id);
