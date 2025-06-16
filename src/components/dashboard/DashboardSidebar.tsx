
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProgressData } from '@/hooks/useProgressData';

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { progressData } = useProgressData();

  if (isMobile) return null;

  return (
    <div className="w-64 space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Navigation</h3>
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm px-3 py-2" 
            onClick={() => navigate('/plan')}
          >
            📋 My Roadmaps
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm px-3 py-2"
            onClick={() => navigate('/progress')}
          >
            📊 Progress Insights
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm px-3 py-2"
          >
            📝 My Reflections
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-sm py-2 px-3" 
            size="sm"
            onClick={() => navigate('/plan')}
          >
            Create New Roadmap
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-sm py-2 px-3" 
            size="sm"
          >
            View Milestones
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-sm py-2 px-3" 
            size="sm"
          >
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
              {progressData.taskCompletion.length > 0 
                ? `You've completed ${progressData.taskCompletion.filter(t => t.completed > 0).length}/${progressData.taskCompletion.length} daily tasks. Finish strong! 💪`
                : "Start your daily tasks to build momentum! 💪"
              }
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              {progressData.currentStreak > 0 
                ? `Amazing ${progressData.currentStreak} day streak! Keep it up! 🌅`
                : "Start your transformation journey today! 🌅"
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
