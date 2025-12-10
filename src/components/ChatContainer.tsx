import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmotionIndicator } from './EmotionIndicator';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatContainer() {
  const { messages, isLoading, currentEmotion, sendMessage } = useChat();
  const { 
    isListening, 
    isSpeaking, 
    transcript, 
    isSupported: isVoiceSupported,
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    setTranscript,
  } = useVoice();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 animate-breathe">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-base font-medium text-foreground leading-tight">
              AI Mental Health & Lifestyle
            </h1>
            <p className="text-xs text-muted-foreground">
              Your wellness companion
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <EmotionIndicator emotion={currentEmotion} showLabel={false} />
          
          {isVoiceSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isSpeaking ? stopSpeaking() : undefined}
              className={cn(
                'h-9 w-9 p-0 rounded-full transition-all',
                isSpeaking && 'bg-primary/10 text-primary'
              )}
              disabled={!isSpeaking}
            >
              {isSpeaking ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto gradient-chat"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onSpeak={isVoiceSupported ? handleSpeak : undefined}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-start animate-fade-in">
              <div className="gradient-card border border-border/50 shadow-soft rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        isListening={isListening}
        transcript={transcript}
        isVoiceSupported={isVoiceSupported}
        onStartListening={startListening}
        onStopListening={stopListening}
        setTranscript={setTranscript}
      />
    </div>
  );
}
