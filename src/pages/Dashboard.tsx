
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { quickStats, roadmaps, habitConsistencyData, taskCompletionData } from '@/data/mockDashboardData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsSection = () => {
  const processedTaskData = taskCompletionData.map((d) => ({
    ...d,
    remaining: d.total - d.completed,
  }));

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-2xl font-bold text-primary mb-4">Insights & Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>Your weekly habit performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={habitConsistencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consistency" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
            <CardDescription>Completed vs. total tasks this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={processedTaskData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--primary))" name="Completed" />
                <Bar dataKey="remaining" stackId="a" fill="hsl(var(--secondary))" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actionable Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-primary/80">
            <li>Your habit consistency is trending upwards. Keep up the great work!</li>
            <li>You had a perfect score on Tuesday and Friday for tasks. Analyze what went right on those days.</li>
            <li>Consider planning lighter tasks on Wednesday to avoid feeling overwhelmed.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};


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

      <AnalyticsSection />
    </div>
  );
};

export default Dashboard;
