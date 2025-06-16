
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPlans } from '@/hooks/useUserPlans';

export const DetailedProgressTracker = () => {
  const { plans } = useUserPlans();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  
  if (plans.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Progress to Track</h3>
        <p className="text-gray-600">Create a roadmap to start tracking your progress.</p>
      </Card>
    );
  }

  const selectedPlan = plans[selectedPlanIndex];
  const currentWeek = selectedPlan?.plan?.weeks?.[selectedPlan.current_week_index];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Detailed Progress Tracker</h2>
        {plans.length > 1 && (
          <select 
            value={selectedPlanIndex} 
            onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            {plans.map((plan, index) => (
              <option key={plan.id} value={index}>
                {plan.goal.slice(0, 30)}...
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineView plan={selectedPlan} />
        <DailyCheckIn currentWeek={currentWeek} />
      </div>
    </div>
  );
};

const TimelineView = ({ plan }: { plan: any }) => {
  const weeks = Array.from({ length: plan.number_of_weeks }, (_, i) => i + 1);
  
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Timeline View</h3>
      <div className="space-y-2">
        {weeks.slice(0, 8).map((week) => (
          <div 
            key={week}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              week === plan.current_week_index + 1 
                ? 'bg-blue-50 border-2 border-blue-200' 
                : week < plan.current_week_index + 1 
                  ? 'bg-green-50' 
                  : 'bg-gray-50'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${
              week < plan.current_week_index + 1 ? 'bg-green-500' :
              week === plan.current_week_index + 1 ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <span className="font-medium">Week {week}</span>
            {week === plan.current_week_index + 1 && (
              <span className="text-sm text-blue-600 font-medium">← Current</span>
            )}
          </div>
        ))}
        {weeks.length > 8 && (
          <div className="text-sm text-gray-500 text-center">
            ... and {weeks.length - 8} more weeks
          </div>
        )}
      </div>
    </Card>
  );
};

const DailyCheckIn = ({ currentWeek }: { currentWeek: any }) => {
  const [checkedHabits, setCheckedHabits] = useState<boolean[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([]);

  if (!currentWeek) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily Check-in</h3>
        <p className="text-gray-600">No current week data available.</p>
      </Card>
    );
  }

  // Use current day's data if available
  const today = new Date().getDay();
  const currentDay = currentWeek.days?.[today] || currentWeek.days?.[0];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Today's Check-in</h3>
      
      {currentDay?.habits && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Habits ({currentDay.habits.length})</h4>
          <div className="space-y-2">
            {currentDay.habits.slice(0, 3).map((habit: string, index: number) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={checkedHabits[index] || false}
                  onCheckedChange={(checked) => {
                    const newChecked = [...checkedHabits];
                    newChecked[index] = !!checked;
                    setCheckedHabits(newChecked);
                  }}
                />
                <span className={checkedHabits[index] ? 'line-through text-gray-500' : ''}>
                  {habit}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {currentDay?.tasks && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Tasks ({currentDay.tasks.length})</h4>
          <div className="space-y-2">
            {currentDay.tasks.slice(0, 3).map((task: string, index: number) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={checkedTasks[index] || false}
                  onCheckedChange={(checked) => {
                    const newChecked = [...checkedTasks];
                    newChecked[index] = !!checked;
                    setCheckedTasks(newChecked);
                  }}
                />
                <span className={checkedTasks[index] ? 'line-through text-gray-500' : ''}>
                  {task}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button className="w-full mt-4" variant="outline">
        View Reflection Journal
      </Button>
    </Card>
  );
};
