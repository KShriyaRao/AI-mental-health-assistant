import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/chat';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];

      tasks.forEach(task => {
        if (
          task.reminderEnabled &&
          !task.completed &&
          task.dueDate === today &&
          task.dueTime === currentTime
        ) {
          toast.info(`Reminder: ${task.title}`, {
            description: task.description || 'Time to complete this task!',
            duration: 10000,
          });

          // Request browser notification
          if (Notification.permission === 'granted') {
            new Notification('Task Reminder', {
              body: task.title,
              icon: '/favicon.ico',
            });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(t => t.dueDate === date);
  }, [tasks]);

  const getTodaysTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getTasksByDate(today);
  }, [getTasksByDate]);

  const getUpcomingTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks
      .filter(t => t.dueDate >= today && !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTodaysTasks,
    getUpcomingTasks,
    requestNotificationPermission,
  };
}
