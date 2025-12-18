import { useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { useVoiceCall } from '@/hooks/useVoiceCall';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmotionIndicator } from './EmotionIndicator';
import { cn } from '@/lib/utils';
import { Phone, PhoneOff, Leaf, Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatContainer() {
  const { messages, isLoading, currentEmotion, sendMessage } = useChat();
  const { 
    isListening, 
    transcript, 
    isSupported: isVoiceSupported,
    startListening, 
    stopListening, 
    setTranscript,
  } = useVoice();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Handle voice call messages
  const handleVoiceMessage = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  const {
    isCallActive,
    isListening: isCallListening,
    isSpeaking: isCallSpeaking,
    callStatus,
    isSupported: isCallSupported,
    startCall,
    endCall,
    speakAndResume,
  } = useVoiceCall({ onUserMessage: handleVoiceMessage });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak new AI messages during active call
  useEffect(() => {
    if (!isCallActive || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant' && lastMessage.id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMessage.id;
      speakAndResume(lastMessage.content);
    }
  }, [messages, isCallActive, speakAndResume]);

  const toggleVoiceCall = () => {
    if (isCallActive) {
      endCall();
    } else {
      startCall();
    }
  };

  const getCallStatusText = () => {
    switch (callStatus) {
      case 'listening':
        return 'Listening to you...';
      case 'processing':
        return 'Thinking...';
      case 'speaking':
        return 'AI is speaking...';
      default:
        return 'Voice call active';
    }
  };

  const getCallStatusIcon = () => {
    switch (callStatus) {
      case 'listening':
        return <Mic className="w-4 h-4" />;
      case 'speaking':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <div className="w-2 h-2 bg-primary rounded-full" />;
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
              A Web-Based AI for Mental Health & Wellness Management System
            </h1>
            <p className="text-xs text-muted-foreground">
              Your wellness companion
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <EmotionIndicator emotion={currentEmotion} showLabel={false} />
          
          {isCallSupported && (
            <Button
              variant={isCallActive ? "default" : "ghost"}
              size="sm"
              onClick={toggleVoiceCall}
              className={cn(
                'h-9 px-3 rounded-full transition-all gap-2',
                isCallActive && 'bg-primary text-primary-foreground'
              )}
            >
              {isCallActive ? (
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
      {isCallActive && (
        <div className={cn(
          "px-4 py-3 border-b flex items-center justify-center gap-3 transition-colors",
          callStatus === 'listening' && "bg-green-500/10 border-green-500/20",
          callStatus === 'processing' && "bg-yellow-500/10 border-yellow-500/20",
          callStatus === 'speaking' && "bg-primary/10 border-primary/20"
        )}>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            callStatus === 'listening' && "bg-green-500/20 animate-pulse",
            callStatus === 'processing' && "bg-yellow-500/20 animate-pulse",
            callStatus === 'speaking' && "bg-primary/20 animate-pulse"
          )}>
            {getCallStatusIcon()}
          </div>
          <span className={cn(
            "text-sm font-medium",
            callStatus === 'listening' && "text-green-600 dark:text-green-400",
            callStatus === 'processing' && "text-yellow-600 dark:text-yellow-400",
            callStatus === 'speaking' && "text-primary"
          )}>
            {getCallStatusText()}
          </span>
          
          {callStatus === 'listening' && (
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3 bg-green-500 rounded-full animate-wave" />
              <div className="w-1 h-5 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-4 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-6 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
              <div className="w-1 h-3 bg-green-500 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
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

      {/* Input - hidden during voice call */}
      {!isCallActive && (
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
      )}
      
      {/* Voice call footer */}
      {isCallActive && (
        <div className="px-4 py-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full px-8 gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              End Voice Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
