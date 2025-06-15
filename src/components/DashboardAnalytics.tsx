
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

// This will eventually come from real data
const habitConsistencyData = [
  { name: 'W1', consistency: 80 },
  { name: 'W2', consistency: 75 },
  { name: 'W3', consistency: 90 },
  { name: 'W4', consistency: 85 },
  { name: 'Current', consistency: 78 },
];

const taskCompletionData = [
  { name: 'Mon', completed: 5, total: 7 },
  { name: 'Tue', completed: 6, total: 6 },
  { name: 'Wed', completed: 4, total: 5 },
  { name: 'Thu', completed: 7, total: 8 },
  { name: 'Fri', completed: 5, total: 5 },
  { name: 'Sat', completed: 3, total: 4 },
  { name: 'Sun', completed: 2, total: 2 },
];

const DashboardAnalytics = () => {
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

export default DashboardAnalytics;
