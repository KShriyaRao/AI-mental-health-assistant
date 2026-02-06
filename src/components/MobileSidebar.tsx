import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CBTExercises } from './CBTExercises';
import { MusicPlayer } from './MusicPlayer';
import { HabitTracker } from './HabitTracker';
import { TaskScheduler } from './TaskScheduler';
import { Brain, Music, Target, ListTodo, Menu, Sparkles } from 'lucide-react';

type TabType = 'exercises' | 'music' | 'habits' | 'tasks';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('habits');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 md:hidden"
          aria-label="Open wellness toolkit"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border/50 shrink-0">
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
        <div className="p-4 border-t border-border/50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Your wellness toolkit</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
