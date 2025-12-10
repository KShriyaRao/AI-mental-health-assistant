import { useState, useEffect } from 'react';
import { Habit, HabitType } from '@/types/chat';

const getToday = () => new Date().toISOString().split('T')[0];

const defaultHabits: Omit<Habit, 'id' | 'date'>[] = [
  { type: 'sleep', target: 8, current: 0, unit: 'hours' },
  { type: 'water', target: 8, current: 0, unit: 'glasses' },
  { type: 'study', target: 2, current: 0, unit: 'hours' },
  { type: 'exercise', target: 30, current: 0, unit: 'minutes' },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const today = getToday();
    const stored = localStorage.getItem(`habits-${today}`);
    
    if (stored) {
      setHabits(JSON.parse(stored));
    } else {
      const initialHabits = defaultHabits.map((h, i) => ({
        ...h,
        id: `habit-${i}`,
        date: today,
      }));
      setHabits(initialHabits);
      localStorage.setItem(`habits-${today}`, JSON.stringify(initialHabits));
    }
  }, []);

  const updateHabit = (type: HabitType, amount: number) => {
    setHabits(prev => {
      const updated = prev.map(h => 
        h.type === type 
          ? { ...h, current: Math.max(0, Math.min(h.target * 2, h.current + amount)) }
          : h
      );
      localStorage.setItem(`habits-${getToday()}`, JSON.stringify(updated));
      return updated;
    });
  };

  const resetHabit = (type: HabitType) => {
    setHabits(prev => {
      const updated = prev.map(h => 
        h.type === type ? { ...h, current: 0 } : h
      );
      localStorage.setItem(`habits-${getToday()}`, JSON.stringify(updated));
      return updated;
    });
  };

  const getProgress = (type: HabitType) => {
    const habit = habits.find(h => h.type === type);
    if (!habit) return 0;
    return Math.min(100, (habit.current / habit.target) * 100);
  };

  return { habits, updateHabit, resetHabit, getProgress };
}
