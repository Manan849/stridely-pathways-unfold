
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import DashboardAnalytics from '@/components/DashboardAnalytics';

const Dashboard = () => {
  const { user } = useUser();
  const { transformationPlan } = usePlan();

  // Calculate quick stats from actual plan data
  const activeRoadmaps = transformationPlan.weeks.length > 0 ? 1 : 0;
  const completionRate = 75; // This will be calculated from actual progress data later
  const currentStreak = 5; // This will be calculated from habit tracking data later

  const currentWeek = transformationPlan.weeks[0] || null;
  const progress = currentWeek ? 30 : 0; // This will be calculated from actual progress

  return (
    <div className="pt-20 pb-6 px-2 sm:pt-20 sm:pb-10 sm:px-4 md:pt-24 md:pb-16 md:px-6 max-w-4xl mx-auto min-h-screen">
      {/* Header Section */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'friend'}!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRoadmaps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} weeks 🔥</div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Active Roadmaps Overview */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Active Roadmaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentWeek ? (
            <Card>
              <CardHeader>
                <CardTitle className="hover:text-accent transition-colors">
                  <Link to="/plan">Current Transformation Plan</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Week {currentWeek.week}: {currentWeek.theme}</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Milestone:</p>
                  <p className="font-semibold">{currentWeek.weeklyMilestone}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/plan">Continue Roadmap</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl bg-section p-8 shadow-card text-center text-primary/60">
              <span>You have no active roadmaps. Go to the Plan page to create one!</span>
            </div>
          )}
        </div>
      </section>

      <DashboardAnalytics />
    </div>
  );
};

export default Dashboard;
