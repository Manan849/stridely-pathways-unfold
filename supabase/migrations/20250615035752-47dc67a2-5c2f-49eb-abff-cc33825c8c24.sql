
-- Table for storing a user's plan. 
create table public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal text not null,
  time_commitment text not null,
  plan jsonb not null,
  current_week_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table to track user habit progress per week.
create table public.habit_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id uuid references public.user_plans(id) on delete cascade,
  week integer not null,
  checked_habits boolean[] not null,
  milestone_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id, week)
);

-- Table for storing weekly reflections.
create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id uuid references public.user_plans(id) on delete cascade,
  week integer not null,
  reflection text not null,
  ai_response jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, plan_id, week)
);

-- Enable RLS for each table
alter table public.user_plans enable row level security;
alter table public.habit_progress enable row level security;
alter table public.reflections enable row level security;

-- Policies: each user can only access their own data.
create policy "Users can view their own plans" on public.user_plans
  for select using (auth.uid() = user_id);
create policy "Users can manage their own plans" on public.user_plans
  for all using (auth.uid() = user_id);

create policy "Users can view their own progress" on public.habit_progress
  for select using (auth.uid() = user_id);
create policy "Users can manage their own progress" on public.habit_progress
  for all using (auth.uid() = user_id);

create policy "Users can view their own reflections" on public.reflections
  for select using (auth.uid() = user_id);
create policy "Users can manage their own reflections" on public.reflections
  for all using (auth.uid() = user_id);

-- (Optional) Add an index for faster user lookups.
create index if not exists idx_user_plans_user_id on public.user_plans(user_id);
create index if not exists idx_habit_progress_user_id_plan_id_week on public.habit_progress(user_id, plan_id, week);
create index if not exists idx_reflections_user_id_plan_id_week on public.reflections(user_id, plan_id, week);
