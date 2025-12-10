import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Bell, 
  Trash2,
  Briefcase,
  Coffee,
  Heart,
  Activity
} from 'lucide-react';
import { Task } from '@/types/chat';
import { cn } from '@/lib/utils';

const categoryConfig = {
  work: { icon: Briefcase, label: 'Work', color: 'text-ocean' },
  rest: { icon: Coffee, label: 'Rest', color: 'text-lavender' },
  personal: { icon: Heart, label: 'Personal', color: 'text-rose-400' },
  health: { icon: Activity, label: 'Health', color: 'text-sage' },
};

export function TaskScheduler() {
  const { 
    addTask, 
    deleteTask, 
    toggleComplete, 
    getTodaysTasks, 
    getUpcomingTasks,
    requestNotificationPermission 
  } = useTasks();

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    category: 'personal' as Task['category'],
    reminderEnabled: true,
  });

  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks().filter(t => 
    t.dueDate !== new Date().toISOString().split('T')[0]
  );

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    addTask({
      ...newTask,
      completed: false,
      description: '',
    });
    
    setNewTask({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      category: 'personal',
      reminderEnabled: true,
    });
    setIsAdding(false);
    requestNotificationPermission();
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const config = categoryConfig[task.category];
    const Icon = config.icon;

    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-card/60 border border-border/30 group transition-all',
        task.completed && 'opacity-60'
      )}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleComplete(task.id)}
          className="border-border/50"
        />
        
        <div className={cn('p-1.5 rounded-md bg-muted/50', config.color)}>
          <Icon className="w-3 h-3" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-sm font-medium truncate',
            task.completed && 'line-through text-muted-foreground'
          )}>
            {task.title}
          </div>
          {task.dueTime && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.dueTime}
              {task.reminderEnabled && <Bell className="w-3 h-3 ml-1" />}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Add Task Button/Form */}
      {isAdding ? (
        <div className="p-4 rounded-xl bg-card/80 border border-border/50 space-y-3">
          <Input
            placeholder="Task title..."
            value={newTask.title}
            onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="bg-background/50"
            autoFocus
          />
          
          <div className="flex gap-2">
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="bg-background/50 flex-1"
            />
            <Input
              type="time"
              value={newTask.dueTime}
              onChange={e => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
              className="bg-background/50 w-28"
            />
          </div>
          
          <div className="flex gap-2">
            {(Object.keys(categoryConfig) as Task['category'][]).map(cat => {
              const config = categoryConfig[cat];
              const Icon = config.icon;
              return (
                <Button
                  key={cat}
                  variant={newTask.category === cat ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setNewTask(prev => ({ ...prev, category: cat }))}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox
                checked={newTask.reminderEnabled}
                onCheckedChange={(checked) => 
                  setNewTask(prev => ({ ...prev, reminderEnabled: checked as boolean }))
                }
              />
              <Bell className="w-3 h-3" />
              Remind me
            </label>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddTask}>
                Add Task
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-dashed"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4" />
          Add new task
        </Button>
      )}

      {/* Today's Tasks */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Today
        </div>
        {todaysTasks.length > 0 ? (
          <div className="space-y-2">
            {todaysTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
            No tasks for today. Enjoy your day! 🌿
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Upcoming</div>
          <div className="space-y-2">
            {upcomingTasks.slice(0, 5).map(task => (
              <div key={task.id} className="relative">
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <TaskItem task={task} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
        Set reminders to stay on track. Balance work, rest, and personal time for a healthier lifestyle.
      </div>
    </div>
  );
}
