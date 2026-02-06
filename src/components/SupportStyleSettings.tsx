import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Settings, Heart, ListChecks, Wind } from 'lucide-react';

export type SupportStyle = 'auto' | 'gentle' | 'practical' | 'minimal';

interface SupportStyleSettingsProps {
  value: SupportStyle;
  onChange: (style: SupportStyle) => void;
}

const styleOptions = [
  {
    id: 'auto',
    label: 'Adaptive (Auto)',
    description: 'AI detects your emotional state and adapts automatically',
    icon: Settings,
  },
  {
    id: 'gentle',
    label: 'Gentle & Validating',
    description: 'Warm, empathetic responses focused on emotional validation',
    icon: Heart,
  },
  {
    id: 'practical',
    label: 'Practical & Solution-Focused',
    description: 'Calm, structured responses with actionable steps',
    icon: ListChecks,
  },
  {
    id: 'minimal',
    label: 'Minimal & Grounding',
    description: 'Short, clear sentences focused on present-moment awareness',
    icon: Wind,
  },
] as const;

export function SupportStyleSettings({ value, onChange }: SupportStyleSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-full gap-2">
          <Settings className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Style</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Support Style Preference</DialogTitle>
          <DialogDescription>
            Choose how Serenity responds to you. This preference will be remembered.
          </DialogDescription>
        </DialogHeader>
        
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(val as SupportStyle)}
          className="space-y-3 mt-4"
        >
          {styleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="flex items-start space-x-3">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Icon className="w-4 h-4 text-primary" />
                    {option.label}
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    {option.description}
                  </p>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="mt-4 pt-4 border-t">
          <Button onClick={() => setOpen(false)} className="w-full">
            Save Preference
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
