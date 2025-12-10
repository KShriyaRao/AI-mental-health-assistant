import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CBTExercises } from './CBTExercises';
import { MusicPlayer } from './MusicPlayer';
import { Brain, Music, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface AppSidebarProps {
  className?: string;
}

type TabType = 'exercises' | 'music';

export function AppSidebar({ className }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('exercises');

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
          <div className="flex border-b border-border/50">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('exercises')}
              className={cn(
                'flex-1 rounded-none py-4 gap-2 transition-colors',
                activeTab === 'exercises' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Exercises</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('music')}
              className={cn(
                'flex-1 rounded-none py-4 gap-2 transition-colors',
                activeTab === 'music' 
                  ? 'bg-primary/5 border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Sounds</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'exercises' ? (
              <CBTExercises />
            ) : (
              <MusicPlayer />
            )}
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
