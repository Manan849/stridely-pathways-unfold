
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Brain, CheckCircle2, Circle } from 'lucide-react';

type DayGoal = {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'learning' | 'practice' | 'reflection' | 'habit';
};

type DayDetailProps = {
  day: {
    day: string;
    focus: string;
    tasks: string[];
    habits: string[];
    reflectionPrompt: string;
  };
  dayGoals?: DayGoal[];
};

const DayDetailView: React.FC<DayDetailProps> = ({ day, dayGoals = [] }) => {
  const [goals, setGoals] = useState<DayGoal[]>(dayGoals.length > 0 ? dayGoals : [
    {
      id: '1',
      title: 'Morning Learning Session',
      description: day.tasks[0] || 'Complete daily learning task',
      estimatedTime: '45 min',
      priority: 'high',
      completed: false,
      category: 'learning'
    },
    {
      id: '2',
      title: 'Practice Application',
      description: day.tasks[1] || 'Apply what you learned today',
      estimatedTime: '30 min',
      priority: 'high',
      completed: false,
      category: 'practice'
    },
    {
      id: '3',
      title: 'Evening Reflection',
      description: day.reflectionPrompt,
      estimatedTime: '15 min',
      priority: 'medium',
      completed: false,
      category: 'reflection'
    }
  ]);

  const [habits, setHabits] = useState(day.habits.map((habit, index) => ({
    id: index.toString(),
    name: habit,
    completed: false
  })));

  const toggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const getPriorityColor = (priority: DayGoal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: DayGoal['category']) => {
    switch (category) {
      case 'learning': return <Brain className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'reflection': return <Circle className="w-4 h-4" />;
      case 'habit': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalProgress = (completedGoals + completedHabits) / (goals.length + habits.length) * 100;

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {day.day}
              </CardTitle>
              <p className="text-lg text-accent font-medium mt-1">{day.focus}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(totalProgress)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Daily Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border transition-all ${
                goal.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(goal.category)}
                    <h3 className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-primary'}`}>
                      {goal.title}
                    </h3>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className={`text-sm mb-2 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                    {goal.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {goal.estimatedTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Daily Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habits.map((habit) => (
            <label
              key={habit.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
              />
              <span className={`font-medium ${habit.completed ? 'line-through text-gray-500' : 'text-primary'}`}>
                {habit.name}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-accent/5 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-primary">Today's Progress</h3>
              <p className="text-sm text-gray-600">
                {completedGoals}/{goals.length} goals • {completedHabits}/{habits.length} habits
              </p>
            </div>
            <Button 
              variant={totalProgress === 100 ? "default" : "outline"}
              size="sm"
            >
              {totalProgress === 100 ? "Day Complete! 🎉" : "Keep Going"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayDetailView;
