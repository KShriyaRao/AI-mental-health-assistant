import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingVisualizerProps {
  isPaused: boolean;
  className?: string;
}

const PHASE_CONFIG: Record<BreathPhase, { duration: number; label: string; scale: number; opacity: number }> = {
  inhale: { duration: 4000, label: 'Breathe in…', scale: 1.4, opacity: 1 },
  hold: { duration: 4000, label: 'Hold…', scale: 1.4, opacity: 0.85 },
  exhale: { duration: 6000, label: 'Breathe out…', scale: 1, opacity: 0.5 },
  rest: { duration: 2000, label: 'Rest…', scale: 1, opacity: 0.4 },
};

const PHASE_ORDER: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];

export function BreathingVisualizer({ isPaused, className }: BreathingVisualizerProps) {
  const [phase, setPhase] = useState<BreathPhase>('rest');
  const [phaseIndex, setPhaseIndex] = useState(3);
  const [textVisible, setTextVisible] = useState(true);

  const advancePhase = useCallback(() => {
    setTextVisible(false);
    setTimeout(() => {
      const next = (phaseIndex + 1) % PHASE_ORDER.length;
      setPhaseIndex(next);
      setPhase(PHASE_ORDER[next]);
      setTimeout(() => setTextVisible(true), 200);
    }, 300);
  }, [phaseIndex]);

  useEffect(() => {
    if (isPaused) return;
    const config = PHASE_CONFIG[phase];
    const timer = setTimeout(advancePhase, config.duration);
    return () => clearTimeout(timer);
  }, [phase, isPaused, advancePhase]);

  // Start on mount
  useEffect(() => {
    if (!isPaused) {
      setPhaseIndex(0);
      setPhase('inhale');
      setTextVisible(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const config = PHASE_CONFIG[phase];

  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      {/* Outer glow rings */}
      <div className="relative flex items-center justify-center">
        {/* Outermost ring */}
        <div
          className="absolute rounded-full bg-[hsl(var(--calm-ocean)/0.06)] blur-2xl transition-all"
          style={{
            width: 280,
            height: 280,
            transform: `scale(${config.scale * 1.1})`,
            opacity: config.opacity * 0.3,
            transitionDuration: `${config.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full bg-[hsl(var(--calm-ocean)/0.1)] blur-xl transition-all"
          style={{
            width: 220,
            height: 220,
            transform: `scale(${config.scale * 1.05})`,
            opacity: config.opacity * 0.5,
            transitionDuration: `${config.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* Core breathing circle */}
        <div
          className="relative rounded-full transition-all"
          style={{
            width: 160,
            height: 160,
            transform: `scale(${config.scale})`,
            opacity: config.opacity,
            transitionDuration: `${config.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            background: `radial-gradient(circle, hsl(var(--calm-ocean) / 0.35) 0%, hsl(var(--calm-mint) / 0.15) 60%, transparent 100%)`,
            boxShadow: `0 0 60px hsl(var(--calm-ocean) / ${config.opacity * 0.3}), 0 0 120px hsl(var(--calm-mint) / ${config.opacity * 0.15})`,
          }}
        >
          {/* Inner shimmer */}
          <div
            className="absolute inset-4 rounded-full transition-all"
            style={{
              background: `radial-gradient(circle, hsl(var(--calm-ocean) / 0.5) 0%, transparent 70%)`,
              transitionDuration: `${config.duration}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: phase === 'inhale' || phase === 'hold' ? 0.8 : 0.3,
            }}
          />
        </div>
      </div>

      {/* Phase label */}
      <p
        className={cn(
          'text-lg font-display font-light text-foreground/80 tracking-wide transition-all duration-500',
          textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      >
        {config.label}
      </p>

      {/* Phase dots */}
      <div className="flex gap-3">
        {PHASE_ORDER.map((p, i) => (
          <div
            key={p}
            className={cn(
              'rounded-full transition-all duration-700',
              i === phaseIndex
                ? 'w-8 h-1.5 bg-[hsl(var(--calm-ocean)/0.6)]'
                : 'w-1.5 h-1.5 bg-foreground/10'
            )}
          />
        ))}
      </div>
    </div>
  );
}
