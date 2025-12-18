import { useState, useCallback, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface UseVoiceCallProps {
  onUserMessage: (message: string) => Promise<void>;
}

export function useVoiceCall({ onUserMessage }: UseVoiceCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const isProcessingRef = useRef(false);
  const shouldRestartRef = useRef(false);

  // Initialize speech APIs
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionClass && window.speechSynthesis) {
      setIsSupported(true);
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthesisRef.current) {
        resolve();
        return;
      }

      synthesisRef.current.cancel();
      setIsSpeaking(true);
      setCallStatus('speaking');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get a soothing voice
      const voices = synthesisRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Karen') || 
        v.name.includes('Google UK English Female') ||
        (v.lang === 'en-US' && v.name.includes('Female'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      synthesisRef.current.speak(utterance);
    });
  }, []);

  const startListeningCycle = useCallback(() => {
    if (!isCallActive || isProcessingRef.current || isSpeaking) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    // Create fresh recognition instance for each cycle
    recognitionRef.current = new SpeechRecognitionClass();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = async (event) => {
      const result = event.results[0];
      if (result.isFinal) {
        const userText = result[0].transcript.trim();
        
        if (userText) {
          setIsListening(false);
          setCallStatus('processing');
          isProcessingRef.current = true;
          
          try {
            await onUserMessage(userText);
          } catch (error) {
            console.error('Error processing message:', error);
          }
          
          isProcessingRef.current = false;
        }
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      // Restart listening if call is still active and not processing/speaking
      if (shouldRestartRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (shouldRestartRef.current) {
            startListeningCycle();
          }
        }, 500);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Restart on certain errors if call is still active
      if (shouldRestartRef.current && !isProcessingRef.current && event.error !== 'not-allowed') {
        setTimeout(() => {
          if (shouldRestartRef.current) {
            startListeningCycle();
          }
        }, 1000);
      }
    };

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setCallStatus('listening');
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  }, [isCallActive, isSpeaking, onUserMessage]);

  // Speak AI response and then resume listening
  const speakAndResume = useCallback(async (text: string) => {
    await speak(text);
    
    // Resume listening after speaking if call is still active
    if (shouldRestartRef.current) {
      setTimeout(() => {
        if (shouldRestartRef.current) {
          startListeningCycle();
        }
      }, 300);
    }
  }, [speak, startListeningCycle]);

  const startCall = useCallback(async () => {
    if (!isSupported) return;
    
    setIsCallActive(true);
    shouldRestartRef.current = true;
    
    // Greet the user
    await speak("Hi there! I'm here to help with your mental health and wellness. How are you feeling today?");
    
    // Start listening after greeting
    if (shouldRestartRef.current) {
      startListeningCycle();
    }
  }, [isSupported, speak, startListeningCycle]);

  const endCall = useCallback(() => {
    shouldRestartRef.current = false;
    setIsCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCallStatus('idle');
    isProcessingRef.current = false;
    
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
  }, []);

  return {
    isCallActive,
    isListening,
    isSpeaking,
    callStatus,
    isSupported,
    startCall,
    endCall,
    speakAndResume,
  };
}
