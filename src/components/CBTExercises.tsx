import { useState } from 'react';
import { CBTExercise } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Wind, Heart, Sparkles, ChevronRight, X, Check } from 'lucide-react';

const exercises: CBTExercise[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Calm your nervous system with guided breathing',
    icon: 'wind',
    duration: '3 min',
    steps: [
      'Find a comfortable position and close your eyes',
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath gently for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat this cycle 5 times',
      'Notice how your body feels more relaxed',
    ],
  },
  {
    id: '2',
    title: 'Grounding (5-4-3-2-1)',
    description: 'Use your senses to anchor to the present',
    icon: 'heart',
    duration: '5 min',
    steps: [
      'Look around and name 5 things you can SEE',
      'Touch and describe 4 things you can FEEL',
      'Listen carefully for 3 things you can HEAR',
      'Identify 2 things you can SMELL',
      'Notice 1 thing you can TASTE',
      'Take a deep breath. You are here, present, and safe.',
    ],
  },
  {
    id: '3',
    title: 'Thought Reframing',
    description: 'Challenge negative thoughts with balanced thinking',
    icon: 'brain',
    duration: '10 min',
    steps: [
      'Write down the negative thought bothering you',
      'Ask: What evidence supports this thought?',
      'Ask: What evidence contradicts this thought?',
      'Consider: What would I tell a friend thinking this?',
      'Create a more balanced, realistic thought',
      'Notice how the new perspective feels',
    ],
  },
  {
    id: '4',
    title: 'Gratitude Reflection',
    description: 'Focus on positive aspects of your life',
    icon: 'sparkles',
    duration: '5 min',
    steps: [
      'Take a moment to settle and breathe',
      'Think of 3 things you are grateful for today',
      'For each one, really feel the gratitude in your body',
      'Consider why each thing matters to you',
      'Smile gently as you hold these in your heart',
      'Carry this warmth with you through your day',
    ],
  },
];

const iconMap: Record<string, typeof Brain> = {
  brain: Brain,
  wind: Wind,
  heart: Heart,
  sparkles: Sparkles,
};

interface CBTExercisesProps {
  onStartExercise?: (exercise: CBTExercise) => void;
}

export function CBTExercises({ onStartExercise }: CBTExercisesProps) {
  const [activeExercise, setActiveExercise] = useState<CBTExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = (exercise: CBTExercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    onStartExercise?.(exercise);
  };

  const handleNext = () => {
    if (activeExercise && currentStep < activeExercise.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setActiveExercise(null);
    setCurrentStep(0);
  };

  if (activeExercise) {
    const Icon = iconMap[activeExercise.icon];
    const isLastStep = currentStep === activeExercise.steps.length - 1;

    return (
      <div className="p-4 animate-fade-in">
        <Card className="gradient-card border-border/50 shadow-card overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{activeExercise.title}</CardTitle>
                  <CardDescription>
                    Step {currentStep + 1} of {activeExercise.steps.length}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / activeExercise.steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="min-h-[100px] flex items-center justify-center p-6 bg-calm-sage-light/50 rounded-xl">
              <p className="text-lg text-center leading-relaxed animate-fade-in">
                {activeExercise.steps[currentStep]}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={isLastStep ? handleComplete : handleNext}
                className="gap-2"
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-lg font-display font-medium text-foreground px-1">
        Wellness Exercises
      </h3>
      
      <div className="grid gap-3">
        {exercises.map((exercise, index) => {
          const Icon = iconMap[exercise.icon];
          return (
            <Card 
              key={exercise.id}
              className={cn(
                'gradient-card border-border/50 shadow-soft cursor-pointer',
                'hover:shadow-card hover:border-primary/20 transition-all duration-300',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleStart(exercise)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{exercise.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {exercise.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {exercise.duration}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
