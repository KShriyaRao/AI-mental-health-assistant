import { Emotion } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Heart, CloudRain, Zap, Smile, Meh } from 'lucide-react';

interface EmotionIndicatorProps {
  emotion: Emotion;
  className?: string;
  showLabel?: boolean;
}

const emotionConfig: Record<Emotion, { 
  label: string; 
  icon: typeof Heart; 
  colorClass: string;
  bgClass: string;
}> = {
  positive: { 
    label: 'Positive', 
    icon: Smile, 
    colorClass: 'text-emotion-positive',
    bgClass: 'bg-emotion-positive/10',
  },
  neutral: { 
    label: 'Neutral', 
    icon: Meh, 
    colorClass: 'text-emotion-neutral',
    bgClass: 'bg-emotion-neutral/10',
  },
  sad: { 
    label: 'Sad', 
    icon: CloudRain, 
    colorClass: 'text-emotion-sad',
    bgClass: 'bg-emotion-sad/10',
  },
  anxious: { 
    label: 'Anxious', 
    icon: Zap, 
    colorClass: 'text-emotion-anxious',
    bgClass: 'bg-emotion-anxious/10',
  },
  stressed: { 
    label: 'Stressed', 
    icon: Heart, 
    colorClass: 'text-emotion-stressed',
    bgClass: 'bg-emotion-stressed/10',
  },
};

export function EmotionIndicator({ emotion, className, showLabel = true }: EmotionIndicatorProps) {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300',
        config.bgClass,
        className
      )}
    >
      <Icon className={cn('w-4 h-4', config.colorClass)} />
      {showLabel && (
        <span className={cn('text-sm font-medium', config.colorClass)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
