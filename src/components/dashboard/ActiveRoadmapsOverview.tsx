
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserPlans, UserPlan } from '@/hooks/useUserPlans';
import { useNavigate } from 'react-router-dom';

export const ActiveRoadmapsOverview = () => {
  const { plans, loading } = useUserPlans();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Active Roadmaps</h3>
        <p className="text-gray-600 mb-4">Start your transformation journey by creating your first roadmap.</p>
        <Button onClick={() => navigate('/plan')} className="bg-blue-500 hover:bg-blue-600">
          Create Your First Roadmap
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary mb-4">Active Roadmaps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <RoadmapCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

const RoadmapCard = ({ plan }: { plan: UserPlan }) => {
  const navigate = useNavigate();
  const progressPercentage = Math.round((plan.current_week_index / plan.number_of_weeks) * 100);
  const currentDay = new Date().getDay() || 7; // Sunday = 7
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/plan')}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{plan.goal}</h3>
        <p className="text-sm text-gray-600">{plan.time_commitment}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          Week {plan.current_week_index + 1} of {plan.number_of_weeks}, Day {currentDay}
        </div>
        <div className="text-sm font-medium text-blue-600 mt-1">
          Next: Complete daily habits ✓
        </div>
      </div>
      
      <Button className="w-full bg-blue-500 hover:bg-blue-600" size="sm">
        Continue Roadmap
      </Button>
    </Card>
  );
};
