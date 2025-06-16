
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { ProgressData } from '@/hooks/useProgressData';

type DashboardHeaderProps = {
  progressData: ProgressData;
};

export const DashboardHeader = ({ progressData }: DashboardHeaderProps) => {
  const { user } = useUser();
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
        Hello, {user?.user_metadata?.full_name || 'there'}! 👋
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{progressData.totalPlans}</div>
          <div className="text-sm text-gray-600">Active Roadmaps</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{progressData.weeklyCompletionRate}%</div>
          <div className="text-sm text-gray-600">Weekly Completion Rate</div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
            {progressData.currentStreak} 🔥
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
      </div>
    </div>
  );
};
