import { useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { useVoiceCall } from '@/hooks/useVoiceCall';
import { useSupportStyle } from '@/hooks/useSupportStyle';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmotionIndicator } from './EmotionIndicator';
import { SpeakingAvatar } from './SpeakingAvatar';
import { SupportStyleSettings } from './SupportStyleSettings';
import { MobileSidebar } from './MobileSidebar';
import { cn } from '@/lib/utils';
import { Phone, PhoneOff, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatContainer() {
  const { supportStyle, setSupportStyle } = useSupportStyle();
  const { messages, isLoading, currentEmotion, sendMessage } = useChat({ supportStyle });
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10 animate-breathe shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xs sm:text-sm font-medium text-foreground leading-tight truncate">
              <span className="hidden sm:inline">A Web-Based AI for Mental Health & Wellness Management System</span>
              <span className="sm:hidden">Mental Health AI</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Your wellness companion
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <SupportStyleSettings value={supportStyle} onChange={setSupportStyle} />
          <EmotionIndicator emotion={currentEmotion} showLabel={false} />
          
          {isCallSupported && (
            <Button
              variant={isCallActive ? "default" : "ghost"}
              size="sm"
              onClick={toggleVoiceCall}
              className={cn(
                'h-8 sm:h-9 px-2 sm:px-3 rounded-full transition-all gap-1 sm:gap-2',
                isCallActive && 'bg-primary text-primary-foreground'
              )}
            >
              {isCallActive ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">End Call</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Voice Call</span>
                </>
              )}
            </Button>
          )}
          
          {/* Mobile sidebar trigger */}
          <MobileSidebar />
        </div>
      </header>

      {/* Voice Call Mode */}
      {isCallActive ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gradient-chat">
          {/* Speaking Avatar */}
          <div className="mb-12">
            <SpeakingAvatar
              isSpeaking={isCallSpeaking}
              isListening={isCallListening}
              isProcessing={callStatus === 'processing'}
              size="lg"
            />
          </div>

          {/* Recent messages during call */}
          <div className="w-full max-w-md space-y-3 mb-8">
            {messages.slice(-3).map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm animate-fade-in",
                  message.role === 'user' 
                    ? "bg-primary/10 text-foreground ml-auto max-w-[80%] text-right"
                    : "bg-muted text-foreground mr-auto max-w-[80%]"
                )}
              >
                {message.content.length > 100 
                  ? message.content.substring(0, 100) + '...' 
                  : message.content
                }
              </div>
            ))}
          </div>

          {/* End call button */}
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
      ) : (
        <>
          {/* Messages */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto gradient-chat"
          >
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
              
              {isLoading && (
                <div className="flex items-start animate-fade-in">
                  <div className="gradient-card border border-border/50 shadow-soft rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 sm:py-3">
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
        </>
      )}
    </div>
  );
}
