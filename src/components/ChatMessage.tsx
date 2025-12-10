import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { EmotionIndicator } from './EmotionIndicator';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div 
      className={cn(
        'flex flex-col gap-2 animate-fade-in',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      {message.emotion && isUser && (
        <EmotionIndicator emotion={message.emotion} className="mb-1" />
      )}
      
      <div 
        className={cn(
          'max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl relative group',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'gradient-card border border-border/50 shadow-soft rounded-bl-sm'
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        {!isUser && onSpeak && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSpeak(message.content)}
            className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Listen</span>
          </Button>
        )}
      </div>
      
      <span className="text-xs text-muted-foreground px-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
