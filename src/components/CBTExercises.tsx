import { useState, useEffect } from 'react';
import { CBTExercise } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Wind, Heart, Sparkles, ChevronRight, X, Check, Pause, Play } from 'lucide-react';

const exercises: CBTExercise[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Calm your nervous system with guided breathing',
    icon: 'wind',
    duration: '3 min',
    steps: [
      'Find a comfortable position and gently close your eyes.',
      'Breathe in slowly through your nose… 1… 2… 3… 4…',
      'Hold your breath gently… 1… 2… 3… 4…',
      'Exhale slowly through your mouth… 1… 2… 3… 4… 5… 6…',
      'Repeat this cycle. Feel your body softening with each breath.',
      'Notice the calm settling in. You are safe here.',
    ],
  },
  {
    id: '2',
    title: 'Grounding (5-4-3-2-1)',
    description: 'Use your senses to anchor to the present',
    icon: 'heart',
    duration: '5 min',
    steps: [
      'Settle into this moment. Take one slow breath.',
      'Look around and name 5 things you can see.',
      'Reach out and notice 4 things you can touch.',
      'Listen carefully for 3 sounds around you.',
      'Identify 2 things you can smell right now.',
      'Notice 1 thing you can taste. You are here. You are present.',
    ],
  },
  {
    id: '3',
    title: 'Thought Reframing',
    description: 'Challenge negative thoughts with balanced thinking',
    icon: 'brain',
    duration: '10 min',
    steps: [
      'Bring to mind one thought that has been weighing on you.',
      'What evidence supports this thought being true?',
      'Now, what evidence suggests it might not be entirely true?',
      'What would you say to a dear friend having this thought?',
      'Create a more balanced, compassionate version of this thought.',
      'Notice how this new perspective feels in your body.',
    ],
  },
  {
    id: '4',
    title: 'Gratitude Reflection',
    description: 'Focus on positive aspects of your life',
    icon: 'sparkles',
    duration: '5 min',
    steps: [
      'Take a slow breath and let your shoulders drop.',
      'Think of one thing you are grateful for today.',
      'Let yourself truly feel that gratitude in your heart.',
      'Now think of a second thing. Let warmth fill you.',
      'And a third. Smile gently as you hold these close.',
      'Carry this warmth with you. You have so much good in your life.',
    ],
  },
];

const iconMap: Record<string, typeof Brain> = {
  brain: Brain,
  wind: Wind,
  heart: Heart,
  sparkles: Sparkles,
};

const exerciseThemes: Record<string, { gradient: string; accent: string; glow: string }> = {
  '1': {
    gradient: 'from-[hsl(var(--calm-ocean-light))] to-[hsl(var(--calm-mint))]',
    accent: 'bg-[hsl(var(--calm-ocean)/0.15)]',
    glow: 'shadow-[0_0_40px_hsl(var(--calm-ocean)/0.2)]',
  },
  '2': {
    gradient: 'from-[hsl(var(--calm-sage-light))] to-[hsl(var(--calm-sand))]',
    accent: 'bg-[hsl(var(--calm-sage)/0.15)]',
    glow: 'shadow-[0_0_40px_hsl(var(--calm-sage)/0.2)]',
  },
  '3': {
    gradient: 'from-[hsl(var(--calm-lavender-light))] to-[hsl(var(--calm-rose))]',
    accent: 'bg-[hsl(var(--calm-lavender)/0.15)]',
    glow: 'shadow-[0_0_40px_hsl(var(--calm-lavender)/0.2)]',
  },
  '4': {
    gradient: 'from-[hsl(var(--calm-sand))] to-[hsl(var(--calm-rose))]',
    accent: 'bg-[hsl(var(--calm-rose)/0.15)]',
    glow: 'shadow-[0_0_40px_hsl(var(--calm-rose)/0.2)]',
  },
};

interface CBTExercisesProps {
  onStartExercise?: (exercise: CBTExercise) => void;
}

export function CBTExercises({ onStartExercise }: CBTExercisesProps) {
  const [activeExercise, setActiveExercise] = useState<CBTExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!activeExercise || isPaused) return;
    const interval = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [activeExercise, isPaused]);

  const handleStart = (exercise: CBTExercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setSecondsElapsed(0);
    setIsPaused(false);
    setIsTransitioning(false);
    onStartExercise?.(exercise);
  };

  const handleNext = () => {
    if (!activeExercise) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep < activeExercise.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
      setIsTransitioning(false);
    }, 400);
  };

  const handleComplete = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveExercise(null);
      setCurrentStep(0);
      setSecondsElapsed(0);
      setIsTransitioning(false);
    }, 400);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (activeExercise) {
    const Icon = iconMap[activeExercise.icon];
    const isLastStep = currentStep === activeExercise.steps.length - 1;
    const theme = exerciseThemes[activeExercise.id];
    const progress = ((currentStep + 1) / activeExercise.steps.length) * 100;

    return (
      <div className="flex flex-col h-full">
        {/* Immersive exercise view */}
        <div className={cn(
          'flex-1 flex flex-col items-center justify-between p-6 relative overflow-hidden',
          'bg-gradient-to-b', theme.gradient,
          'transition-all duration-700'
        )}>
          {/* Ambient breathing circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              'w-64 h-64 rounded-full opacity-20 blur-3xl',
              theme.accent,
              activeExercise.icon === 'wind' ? 'animate-breathe' : 'animate-pulse-soft'
            )} />
          </div>

          {/* Top bar */}
          <div className="w-full flex items-center justify-between z-10">
            <button
              onClick={handleComplete}
              className="p-2 rounded-full hover:bg-background/30 transition-colors"
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                {formatTime(secondsElapsed)}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 rounded-full hover:bg-background/30 transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4 text-foreground/70" /> : <Pause className="w-4 h-4 text-foreground/70" />}
              </button>
            </div>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center z-10 max-w-md mx-auto text-center space-y-8">
            {/* Exercise icon with glow */}
            <div className={cn(
              'p-5 rounded-full transition-all duration-700',
              theme.accent, theme.glow,
              activeExercise.icon === 'wind' && 'animate-breathe'
            )}>
              <Icon className="w-8 h-8 text-primary" />
            </div>

            {/* Step text */}
            <div className={cn(
              'transition-all duration-500',
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}>
              <p className="text-lg sm:text-xl leading-relaxed font-display font-light text-foreground/90">
                {activeExercise.steps[currentStep]}
              </p>
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-2">
              {activeExercise.steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full transition-all duration-500',
                    i === currentStep
                      ? 'w-6 h-2 bg-primary'
                      : i < currentStep
                        ? 'w-2 h-2 bg-primary/50'
                        : 'w-2 h-2 bg-foreground/15'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Bottom action */}
          <div className="w-full z-10">
            {/* Progress line */}
            <div className="w-full h-0.5 bg-foreground/10 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {activeExercise.steps.length}
              </span>
              <Button
                onClick={isLastStep ? handleComplete : handleNext}
                variant={isLastStep ? 'default' : 'ghost'}
                className={cn(
                  'gap-2 rounded-full px-6',
                  isLastStep && 'bg-primary text-primary-foreground'
                )}
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Complete
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exercise list view
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1 px-1">
        <h3 className="text-lg font-display font-medium text-foreground">
          Wellness Exercises
        </h3>
        <p className="text-sm text-muted-foreground">
          Take a moment for yourself
        </p>
      </div>

      <div className="grid gap-3">
        {exercises.map((exercise, index) => {
          const Icon = iconMap[exercise.icon];
          const theme = exerciseThemes[exercise.id];
          return (
            <Card
              key={exercise.id}
              className={cn(
                'border-border/30 overflow-hidden cursor-pointer group',
                'hover:border-primary/20 transition-all duration-500',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handleStart(exercise)}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Colored accent strip */}
                  <div className={cn(
                    'w-1.5 bg-gradient-to-b shrink-0',
                    theme.gradient
                  )} />
                  
                  <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
                    <div className={cn(
                      'p-3 rounded-2xl shrink-0 transition-all duration-500',
                      theme.accent,
                      'group-hover:scale-110'
                    )}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{exercise.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {exercise.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {exercise.duration}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
