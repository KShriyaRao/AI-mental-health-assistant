import { cn } from '@/lib/utils';
import { Eye, Hand, Ear, Wind, Coffee } from 'lucide-react';

interface GroundingVisualizerProps {
  currentStep: number;
  isTransitioning: boolean;
  className?: string;
}

const SENSE_CONFIG = [
  { icon: null, label: 'Begin', color: '--calm-sage', count: '' },
  { icon: Eye, label: 'See', color: '--calm-ocean', count: '5' },
  { icon: Hand, label: 'Touch', color: '--calm-sage', count: '4' },
  { icon: Ear, label: 'Hear', color: '--calm-lavender', count: '3' },
  { icon: Wind, label: 'Smell', color: '--calm-mint', count: '2' },
  { icon: Coffee, label: 'Taste', color: '--calm-rose', count: '1' },
];

export function GroundingVisualizer({ currentStep, isTransitioning, className }: GroundingVisualizerProps) {
  const sense = SENSE_CONFIG[currentStep] || SENSE_CONFIG[0];
  const Icon = sense.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-6', className)}>
      {/* Central sense indicator */}
      <div className="relative flex items-center justify-center">
        {/* Ripple rings for touch step */}
        {currentStep === 2 && (
          <>
            <div
              className="absolute rounded-full border border-[hsl(var(--calm-sage)/0.15)]"
              style={{
                width: 200, height: 200,
                animation: 'ripple 3s ease-out infinite',
              }}
            />
            <div
              className="absolute rounded-full border border-[hsl(var(--calm-sage)/0.1)]"
              style={{
                width: 200, height: 200,
                animation: 'ripple 3s ease-out infinite 1s',
              }}
            />
          </>
        )}

        {/* Waveform bars for sound step */}
        {currentStep === 3 && (
          <div className="absolute flex items-center gap-1" style={{ width: 200 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-[hsl(var(--calm-lavender)/0.2)]"
                style={{
                  animation: `wave ${0.8 + Math.random() * 0.6}s ease-in-out infinite`,
                  animationDelay: `${i * 0.08}s`,
                  height: 40,
                }}
              />
            ))}
          </div>
        )}

        {/* Glow background */}
        <div
          className={cn(
            'absolute rounded-full blur-2xl transition-all duration-1000',
          )}
          style={{
            width: 160, height: 160,
            background: `radial-gradient(circle, hsl(var(${sense.color}) / 0.2) 0%, transparent 70%)`,
            opacity: isTransitioning ? 0 : 0.8,
          }}
        />

        {/* Icon circle */}
        <div
          className={cn(
            'relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700',
            isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
          )}
          style={{
            background: `radial-gradient(circle, hsl(var(${sense.color}) / 0.15) 0%, hsl(var(${sense.color}) / 0.05) 100%)`,
            boxShadow: `0 0 40px hsl(var(${sense.color}) / 0.15)`,
          }}
        >
          {Icon ? (
            <Icon
              className="w-10 h-10 transition-all duration-500"
              style={{ color: `hsl(var(${sense.color}))` }}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full animate-pulse-soft"
              style={{ background: `hsl(var(${sense.color}) / 0.5)` }}
            />
          )}
        </div>
      </div>

      {/* Count badge */}
      {sense.count && (
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-500',
            isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100',
          )}
        >
          <span
            className="text-3xl font-display font-light"
            style={{ color: `hsl(var(${sense.color}))` }}
          >
            {sense.count}
          </span>
          <span className="text-sm text-muted-foreground font-light tracking-wide">
            {sense.label}
          </span>
        </div>
      )}

      {/* Sense progress */}
      <div className="flex gap-2 items-center">
        {SENSE_CONFIG.slice(1).map((s, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-700',
              i + 1 === currentStep
                ? 'w-6 h-2'
                : 'w-2 h-2',
            )}
            style={{
              background: i + 1 <= currentStep
                ? `hsl(var(${s.color}) / ${i + 1 === currentStep ? 0.7 : 0.3})`
                : 'hsl(var(--foreground) / 0.1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
