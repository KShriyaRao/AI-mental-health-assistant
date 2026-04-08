import { cn } from '@/lib/utils';
import { Brain, Sparkles } from 'lucide-react';

interface ExerciseVisualizerProps {
  exerciseId: string;
  icon: string;
  currentStep: number;
  totalSteps: number;
  isTransitioning: boolean;
  className?: string;
}

export function ExerciseVisualizer({
  exerciseId,
  icon,
  currentStep,
  totalSteps,
  isTransitioning,
  className,
}: ExerciseVisualizerProps) {
  const isThought = exerciseId === '3';
  const isGratitude = exerciseId === '4';

  const Icon = isThought ? Brain : Sparkles;
  const color = isThought ? '--calm-lavender' : '--calm-rose';

  return (
    <div className={cn('flex flex-col items-center justify-center gap-6', className)}>
      {/* Floating orbs */}
      <div className="relative flex items-center justify-center">
        {isGratitude && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: 8 + i * 4,
                  height: 8 + i * 4,
                  background: `hsl(var(${color}) / ${0.2 + i * 0.1})`,
                  animationDelay: `${i * 1.5}s`,
                  top: `${20 + i * 25}%`,
                  left: `${30 + i * 15}%`,
                }}
              />
            ))}
          </>
        )}

        {/* Glow */}
        <div
          className="absolute rounded-full blur-2xl transition-all duration-1000"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle, hsl(var(${color}) / 0.15) 0%, transparent 70%)`,
            opacity: isTransitioning ? 0.3 : 0.7,
          }}
        />

        {/* Central icon with orbiting ring */}
        <div
          className={cn(
            'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700',
            isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
          )}
          style={{
            background: `radial-gradient(circle, hsl(var(${color}) / 0.12) 0%, transparent 100%)`,
            boxShadow: `0 0 50px hsl(var(${color}) / 0.15)`,
          }}
        >
          <Icon
            className="w-8 h-8 transition-all duration-500"
            style={{ color: `hsl(var(${color}))` }}
          />
        </div>

        {/* Orbit ring */}
        <div
          className="absolute rounded-full border border-[hsl(var(--foreground)/0.05)] transition-all duration-1000"
          style={{
            width: 160,
            height: 160,
            animation: 'spin 20s linear infinite',
          }}
        >
          <div
            className="absolute w-2 h-2 rounded-full -top-1 left-1/2 -translate-x-1/2"
            style={{ background: `hsl(var(${color}) / 0.4)` }}
          />
        </div>
      </div>

      {/* Step counter */}
      <div
        className={cn(
          'text-sm text-muted-foreground/60 font-light tracking-widest transition-all duration-500',
          isTransitioning ? 'opacity-0' : 'opacity-100',
        )}
      >
        {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
}
