import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmotionIndicator } from './EmotionIndicator';
import { cn } from '@/lib/utils';
import { Phone, PhoneOff, Leaf } from 'lucide-react';
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
  
  const [voiceCallActive, setVoiceCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak new AI messages when voice call is active
  useEffect(() => {
    if (!voiceCallActive || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant' && lastMessage.id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMessage.id;
      speak(lastMessage.content);
    }
  }, [messages, voiceCallActive, speak]);

  const toggleVoiceCall = () => {
    if (voiceCallActive) {
      setVoiceCallActive(false);
      stopSpeaking();
      stopListening();
    } else {
      setVoiceCallActive(true);
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
            <h1 className="font-display text-sm font-medium text-foreground leading-tight">
              A Web-Based AI Mental Health & Lifestyle Management System
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
              variant={voiceCallActive ? "default" : "ghost"}
              size="sm"
              onClick={toggleVoiceCall}
              className={cn(
                'h-9 px-3 rounded-full transition-all gap-2',
                voiceCallActive && 'bg-primary text-primary-foreground animate-pulse-soft'
              )}
            >
              {voiceCallActive ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span className="text-xs">End Call</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span className="text-xs">Voice Call</span>
                </>
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Voice Call Indicator */}
      {voiceCallActive && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-medium">
            {isSpeaking ? 'AI is speaking...' : 'Voice call active - AI will speak responses'}
          </span>
        </div>
      )}

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
