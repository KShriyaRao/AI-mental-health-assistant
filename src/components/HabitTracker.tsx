import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Moon, Droplets, BookOpen, Dumbbell, Plus, Minus, RotateCcw } from 'lucide-react';
import { HabitType } from '@/types/chat';
import { cn } from '@/lib/utils';

const habitConfig: Record<HabitType, { icon: typeof Moon; label: string; color: string }> = {
  sleep: { icon: Moon, label: 'Sleep', color: 'text-lavender' },
  water: { icon: Droplets, label: 'Water', color: 'text-ocean' },
  study: { icon: BookOpen, label: 'Study', color: 'text-sage' },
  exercise: { icon: Dumbbell, label: 'Exercise', color: 'text-primary' },
};

export function HabitTracker() {
  const { habits, updateHabit, resetHabit, getProgress } = useHabits();

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium text-foreground mb-2">Today's Habits</div>
      
      {habits.map(habit => {
        const config = habitConfig[habit.type];
        const Icon = config.icon;
        const progress = getProgress(habit.type);
        const isComplete = progress >= 100;

        return (
          <div 
            key={habit.id}
            className={cn(
              'p-4 rounded-xl bg-card/80 border border-border/50 space-y-3 transition-all',
              isComplete && 'bg-primary/5 border-primary/20'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg bg-muted/50', config.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {habit.current} / {habit.target} {habit.unit}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateHabit(habit.type, -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateHabit(habit.type, 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => resetHabit(habit.type)}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {isComplete && (
              <div className="text-xs text-primary font-medium flex items-center gap-1">
                ✨ Goal achieved!
              </div>
            )}
          </div>
        );
      })}

      <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
        Track your daily habits to build healthy routines. Your progress resets each day.
      </div>
    </div>
  );
}
