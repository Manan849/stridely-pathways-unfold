
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProgressData } from '@/hooks/useProgressData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ActiveRoadmapsOverview } from '@/components/dashboard/ActiveRoadmapsOverview';
import { DetailedProgressTracker } from '@/components/dashboard/DetailedProgressTracker';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import DashboardAnalytics from '@/components/DashboardAnalytics';

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { progressData, loading } = useProgressData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-2xl"></div>
            <div className="h-64 bg-white rounded-2xl"></div>
            <div className="h-96 bg-white rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 pt-20 pb-6 px-2 sm:px-4 ${
      isMobile ? 'max-w-full' : 'max-w-7xl mx-auto'
    }`}>
      <div className={`flex gap-6 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {!isMobile && <DashboardSidebar />}
        
        <div className="flex-1 space-y-6">
          <DashboardHeader progressData={progressData} />
          <ActiveRoadmapsOverview />
          <DetailedProgressTracker />
          <DashboardAnalytics />
        </div>
      </div>
    </div>
  );
}
