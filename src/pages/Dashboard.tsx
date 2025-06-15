
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { quickStats, roadmaps } from '@/data/mockDashboardData';

const Dashboard = () => {
  const { user } = useUser();

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
              <div className="text-2xl font-bold">{quickStats.activeRoadmaps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.currentStreak} weeks 🔥</div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Active Roadmaps Overview */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Active Roadmaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id}>
              <CardHeader>
                <CardTitle className="hover:text-accent transition-colors">
                  <Link to="/plan">{roadmap.name}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">{roadmap.currentPosition}</span>
                    <span className="text-sm font-medium">{roadmap.progress}%</span>
                  </div>
                  <Progress value={roadmap.progress} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Milestone:</p>
                  <p className="font-semibold">{roadmap.nextMilestone}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/plan">Continue Roadmap</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {roadmaps.length === 0 && (
          <div className="rounded-xl bg-section p-8 shadow-card text-center text-primary/60">
            <span>You have no active roadmaps. Go to the Plan page to create one!</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
