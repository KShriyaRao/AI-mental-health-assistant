import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  transcript: string;
  isVoiceSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  setTranscript: (text: string) => void;
}

export function ChatInput({
  onSend,
  isLoading,
  isListening,
  transcript,
  isVoiceSupported,
  onStartListening,
  onStopListening,
  setTranscript,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = () => {
    const message = input.trim();
    if (message && !isLoading) {
      onSend(message);
      setInput('');
      setTranscript('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            className={cn(
              'min-h-[44px] sm:min-h-[52px] max-h-32 resize-none pr-10 sm:pr-12 rounded-xl border-border/50',
              'focus:border-primary/50 focus:ring-primary/20 transition-all',
              'placeholder:text-muted-foreground/60 text-sm sm:text-base'
            )}
            disabled={isLoading}
          />
          
          {isVoiceSupported && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className={cn(
                'absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full transition-all',
                isListening && 'bg-destructive/10 text-destructive animate-pulse'
              )}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] rounded-xl bg-primary hover:bg-primary/90 shadow-soft shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>
      </div>
      
      {isListening && (
        <div className="absolute -top-10 sm:-top-12 left-3 right-3 sm:left-4 sm:right-4 bg-destructive/10 text-destructive px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          Listening... Speak now
        </div>
      )}
    </div>
  );
}
