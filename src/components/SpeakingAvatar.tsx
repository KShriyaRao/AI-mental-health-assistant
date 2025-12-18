import { cn } from '@/lib/utils';

interface SpeakingAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SpeakingAvatar({ 
  isSpeaking, 
  isListening, 
  isProcessing,
  size = 'lg' 
}: SpeakingAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const innerSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsing rings */}
      {(isSpeaking || isListening) && (
        <>
          <div 
            className={cn(
              "absolute rounded-full opacity-20",
              sizeClasses[size],
              isSpeaking && "bg-primary animate-ping",
              isListening && "bg-green-500 animate-ping"
            )}
            style={{ animationDuration: '1.5s' }}
          />
          <div 
            className={cn(
              "absolute rounded-full opacity-30",
              size === 'sm' ? 'w-14 h-14' : size === 'md' ? 'w-20 h-20' : 'w-28 h-28',
              isSpeaking && "bg-primary animate-ping",
              isListening && "bg-green-500 animate-ping"
            )}
            style={{ animationDuration: '2s', animationDelay: '0.5s' }}
          />
        </>
      )}

      {/* Main avatar circle */}
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-300",
          sizeClasses[size],
          isSpeaking && "bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg shadow-primary/20",
          isListening && "bg-gradient-to-br from-green-500/30 to-green-500/10 shadow-lg shadow-green-500/20",
          isProcessing && "bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 shadow-lg shadow-yellow-500/20",
          !isSpeaking && !isListening && !isProcessing && "bg-muted/50"
        )}
      >
        {/* Inner circle with icon */}
        <div 
          className={cn(
            "rounded-full flex items-center justify-center transition-all duration-300",
            innerSizeClasses[size],
            isSpeaking && "bg-primary text-primary-foreground",
            isListening && "bg-green-500 text-white",
            isProcessing && "bg-yellow-500 text-white animate-pulse",
            !isSpeaking && !isListening && !isProcessing && "bg-muted text-muted-foreground"
          )}
        >
          {/* Sound wave bars for speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-current rounded-full animate-wave",
                    size === 'sm' ? 'w-0.5' : size === 'md' ? 'w-1' : 'w-1.5'
                  )}
                  style={{
                    height: `${(Math.sin(i * 0.8) + 1.5) * (size === 'sm' ? 6 : size === 'md' ? 8 : 12)}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Microphone pulse for listening */}
          {isListening && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-current rounded-full animate-wave",
                    size === 'sm' ? 'w-0.5' : size === 'md' ? 'w-1' : 'w-1.5'
                  )}
                  style={{
                    height: `${(Math.cos(i * 0.6) + 1.5) * (size === 'sm' ? 6 : size === 'md' ? 8 : 12)}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Processing dots */}
          {isProcessing && (
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-current rounded-full animate-bounce",
                    size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'
                  )}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {/* Idle state - simple circle */}
          {!isSpeaking && !isListening && !isProcessing && (
            <div className={cn(
              "rounded-full bg-current opacity-50",
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          )}
        </div>
      </div>

      {/* Status label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className={cn(
          "text-sm font-medium px-3 py-1 rounded-full",
          isSpeaking && "text-primary bg-primary/10",
          isListening && "text-green-600 dark:text-green-400 bg-green-500/10",
          isProcessing && "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
          !isSpeaking && !isListening && !isProcessing && "text-muted-foreground bg-muted"
        )}>
          {isSpeaking && "Speaking..."}
          {isListening && "Listening..."}
          {isProcessing && "Thinking..."}
          {!isSpeaking && !isListening && !isProcessing && "Ready"}
        </span>
      </div>
    </div>
  );
}
