
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="w-64 space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Navigation</h3>
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/plan')}
          >
            📋 My Roadmaps
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/progress')}
          >
            📊 Progress Insights
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            📝 My Reflections
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600" 
            size="sm"
            onClick={() => navigate('/plan')}
          >
            Create New Roadmap
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            View Milestones
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Resource Library
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          🔔 Smart Reminders
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              You've completed 3/5 tasks today. Finish strong! 💪
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              Great job on your morning routine! Keep it up! 🌅
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
