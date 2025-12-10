import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { EmotionIndicator } from './EmotionIndicator';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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
          'max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'gradient-card border border-border/50 shadow-soft rounded-bl-sm'
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
      
      <span className="text-xs text-muted-foreground px-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
