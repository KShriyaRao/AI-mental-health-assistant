export type Emotion = 'sad' | 'anxious' | 'stressed' | 'neutral' | 'positive';

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
  indicators: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: Emotion;
}

export interface CBTExercise {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: string[];
  duration: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  duration: string;
  url: string;
  cover: string;
}

export type HabitType = 'sleep' | 'water' | 'study' | 'exercise';

export interface Habit {
  id: string;
  type: HabitType;
  target: number;
  current: number;
  unit: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  completed: boolean;
  category: 'work' | 'rest' | 'personal' | 'health';
  reminderEnabled: boolean;
}
