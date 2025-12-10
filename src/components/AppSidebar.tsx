import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CBTExercises } from './CBTExercises';
import { MusicPlayer } from './MusicPlayer';
import { HabitTracker } from './HabitTracker';
import { TaskScheduler } from './TaskScheduler';
import { Brain, Music, ChevronLeft, ChevronRight, Sparkles, Target, ListTodo } from 'lucide-react';

interface AppSidebarProps {
  className?: string;
}

type TabType = 'exercises' | 'music' | 'habits' | 'tasks';

export function AppSidebar({ className }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('habits');

  return (
    <div 
      className={cn(
        'relative flex flex-col border-l border-border/50 bg-card/50 transition-all duration-300',
        isCollapsed ? 'w-0 overflow-hidden' : 'w-80 lg:w-96',
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -left-4 top-4 z-10 h-8 w-8 rounded-full border border-border/50 bg-card shadow-soft',
          'hover:bg-accent'
        )}
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-border/50 overflow-x-auto">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('habits')}
              className={cn(
                'flex-1 rounded-none py-3 gap-1.5 transition-colors min-w-0',
                activeTab === 'habits' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Target className="w-4 h-4 shrink-0" />
              <span className="text-xs">Habits</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('tasks')}
              className={cn(
                'flex-1 rounded-none py-3 gap-1.5 transition-colors min-w-0',
                activeTab === 'tasks' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ListTodo className="w-4 h-4 shrink-0" />
              <span className="text-xs">Tasks</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('exercises')}
              className={cn(
                'flex-1 rounded-none py-3 gap-1.5 transition-colors min-w-0',
                activeTab === 'exercises' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Brain className="w-4 h-4 shrink-0" />
              <span className="text-xs">CBT</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('music')}
              className={cn(
                'flex-1 rounded-none py-3 gap-1.5 transition-colors min-w-0',
                activeTab === 'music' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span className="text-xs">Music</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'habits' && <HabitTracker />}
            {activeTab === 'tasks' && <TaskScheduler />}
            {activeTab === 'exercises' && <CBTExercises />}
            {activeTab === 'music' && <MusicPlayer />}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>Your wellness toolkit</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
