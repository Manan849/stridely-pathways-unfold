
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { usePlan } from '@/context/PlanContext';

const DashboardAnalytics = () => {
  const { transformationPlan } = usePlan();

  // Generate real data based on actual plan
  const hasData = transformationPlan.weeks.length > 0;
  
  // Default empty state data
  const emptyHabitData = [
    { name: 'Week 1', consistency: 0 },
    { name: 'Week 2', consistency: 0 },
    { name: 'Week 3', consistency: 0 },
    { name: 'Week 4', consistency: 0 },
    { name: 'Current', consistency: 0 },
  ];

  const emptyTaskData = [
    { name: 'Mon', completed: 0, total: 0, remaining: 0 },
    { name: 'Tue', completed: 0, total: 0, remaining: 0 },
    { name: 'Wed', completed: 0, total: 0, remaining: 0 },
    { name: 'Thu', completed: 0, total: 0, remaining: 0 },
    { name: 'Fri', completed: 0, total: 0, remaining: 0 },
    { name: 'Sat', completed: 0, total: 0, remaining: 0 },
    { name: 'Sun', completed: 0, total: 0, remaining: 0 },
  ];

  // TODO: This will be replaced with real progress tracking data
  const habitConsistencyData = emptyHabitData;
  const taskCompletionData = emptyTaskData;

  const recommendations = hasData ? [
    'Start tracking your daily progress to see insights here.',
    'Complete your first week to unlock detailed analytics.',
    'Your transformation journey begins with the first step!'
  ] : [
    'Create your transformation plan to start tracking progress.',
    'Set up your goals to receive personalized insights.',
    'Your journey to success starts with a plan!'
  ];

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-2xl font-bold text-primary mb-4">Insights & Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>
              {hasData ? 'Your weekly habit performance' : 'Track habits to see progress'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={habitConsistencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consistency" 
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }}
                  strokeWidth={hasData ? 2 : 1}
                  strokeDasharray={hasData ? "0" : "5,5"}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
            <CardDescription>
              {hasData ? 'Completed vs. total tasks this week' : 'Start completing tasks to see data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskCompletionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};

export default DashboardAnalytics;
