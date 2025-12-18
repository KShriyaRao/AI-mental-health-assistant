import { useCallback, useRef, useState, useEffect } from 'react';

export interface AmbientTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  duration: string;
  type: 'ocean' | 'rain' | 'birds' | 'chimes';
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: '1',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    mood: 'calm',
    duration: '∞',
    type: 'ocean',
  },
  {
    id: '2',
    title: 'Gentle Rain',
    artist: 'Ambient Sounds',
    mood: 'relaxing',
    duration: '∞',
    type: 'rain',
  },
  {
    id: '3',
    title: 'Forest Birds',
    artist: 'Nature Harmony',
    mood: 'peaceful',
    duration: '∞',
    type: 'birds',
  },
  {
    id: '4',
    title: 'Wind Chimes',
    artist: 'Meditation Music',
    mood: 'focus',
    duration: '∞',
    type: 'chimes',
  },
];

export function useAmbientSounds() {
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const stopAllSounds = useCallback(() => {
    // Clear all intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
    
    // Clear all timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    // Disconnect all audio nodes
    nodesRef.current.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {}
    });
    nodesRef.current = [];
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  const createNoiseBuffer = (context: AudioContext): AudioBuffer => {
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const playOcean = useCallback((context: AudioContext, masterGain: GainNode) => {
    const noiseBuffer = createNoiseBuffer(context);
    
    const createWave = () => {
      if (context.state === 'closed') return;
      
      const noise = context.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      const waveGain = context.createGain();
      waveGain.gain.value = 0;
      
      noise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);
      
      noise.start();
      nodesRef.current.push(noise, filter, waveGain);
      
      const animateWave = () => {
        if (context.state === 'closed') return;
        const now = context.currentTime;
        const duration = 4 + Math.random() * 4;
        waveGain.gain.setValueAtTime(0, now);
        waveGain.gain.linearRampToValueAtTime(0.3, now + duration * 0.3);
        waveGain.gain.linearRampToValueAtTime(0.1, now + duration * 0.7);
        waveGain.gain.linearRampToValueAtTime(0, now + duration);
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.linearRampToValueAtTime(600, now + duration * 0.3);
        filter.frequency.linearRampToValueAtTime(300, now + duration);
      };
      
      animateWave();
      const interval = setInterval(animateWave, 5000 + Math.random() * 3000);
      intervalsRef.current.push(interval);
    };
    
    createWave();
    const t1 = setTimeout(() => createWave(), 2000);
    const t2 = setTimeout(() => createWave(), 4000);
    timeoutsRef.current.push(t1, t2);
  }, []);

  const playRain = useCallback((context: AudioContext, masterGain: GainNode) => {
    if (context.state === 'closed') return;
    
    const noiseBuffer = createNoiseBuffer(context);
    
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1000;
    
    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 8000;
    
    const rainGain = context.createGain();
    rainGain.gain.value = 0.15;
    
    noise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(masterGain);
    
    noise.start();
    nodesRef.current.push(noise, highpass, lowpass, rainGain);
    
    const createDroplet = () => {
      if (context.state === 'closed') return;
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 2000 + Math.random() * 2000;
      
      const dropGain = context.createGain();
      dropGain.gain.value = 0.02;
      dropGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
      
      osc.connect(dropGain);
      dropGain.connect(masterGain);
      
      osc.start();
      osc.stop(context.currentTime + 0.1);
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) createDroplet();
    }, 100);
    intervalsRef.current.push(interval);
  }, []);

  const playBirds = useCallback((context: AudioContext, masterGain: GainNode) => {
    const createChirp = () => {
      if (context.state === 'closed') return;
      
      const osc = context.createOscillator();
      osc.type = 'sine';
      
      const chirpGain = context.createGain();
      chirpGain.gain.value = 0;
      
      osc.connect(chirpGain);
      chirpGain.connect(masterGain);
      
      const now = context.currentTime;
      const baseFreq = 2000 + Math.random() * 2000;
      
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.05);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.2, now + 0.1);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.8, now + 0.15);
      osc.frequency.linearRampToValueAtTime(baseFreq, now + 0.2);
      
      chirpGain.gain.setValueAtTime(0, now);
      chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      chirpGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      chirpGain.gain.linearRampToValueAtTime(0, now + 0.25);
      
      osc.start(now);
      osc.stop(now + 0.3);
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        createChirp();
        if (Math.random() > 0.5) {
          const t = setTimeout(createChirp, 200);
          timeoutsRef.current.push(t);
        }
        if (Math.random() > 0.7) {
          const t = setTimeout(createChirp, 400);
          timeoutsRef.current.push(t);
        }
      }
    }, 800);
    intervalsRef.current.push(interval);
  }, []);

  const playChimes = useCallback((context: AudioContext, masterGain: GainNode) => {
    const chimeFrequencies = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    
    const createChime = () => {
      if (context.state === 'closed') return;
      
      const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
      
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const osc2 = context.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2.01;
      
      const chimeGain = context.createGain();
      const now = context.currentTime;
      chimeGain.gain.setValueAtTime(0.15, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      
      const chimeGain2 = context.createGain();
      chimeGain2.gain.setValueAtTime(0.05, now);
      chimeGain2.gain.exponentialRampToValueAtTime(0.001, now + 2);
      
      osc.connect(chimeGain);
      osc2.connect(chimeGain2);
      chimeGain.connect(masterGain);
      chimeGain2.connect(masterGain);
      
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 3);
      osc2.stop(now + 2);
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        createChime();
        if (Math.random() > 0.7) {
          const t = setTimeout(createChime, 100);
          timeoutsRef.current.push(t);
        }
      }
    }, 1500);
    intervalsRef.current.push(interval);
  }, []);

  const playTrack = useCallback((track: AmbientTrack) => {
    // If clicking same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        stopAllSounds();
        setIsPlaying(false);
        return;
      }
    }
    
    // Stop any current playback first
    stopAllSounds();
    
    // Create new audio context
    const context = new AudioContext();
    audioContextRef.current = context;
    
    const masterGain = context.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(context.destination);
    gainNodeRef.current = masterGain;
    
    switch (track.type) {
      case 'ocean': playOcean(context, masterGain); break;
      case 'rain': playRain(context, masterGain); break;
      case 'birds': playBirds(context, masterGain); break;
      case 'chimes': playChimes(context, masterGain); break;
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
  }, [currentTrack, isPlaying, volume, stopAllSounds, playOcean, playRain, playBirds, playChimes]);

  const pause = useCallback(() => {
    stopAllSounds();
    setIsPlaying(false);
  }, [stopAllSounds]);

  const resume = useCallback(() => {
    if (currentTrack) {
      // Stop first then play
      stopAllSounds();
      
      const context = new AudioContext();
      audioContextRef.current = context;
      
      const masterGain = context.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(context.destination);
      gainNodeRef.current = masterGain;
      
      switch (currentTrack.type) {
        case 'ocean': playOcean(context, masterGain); break;
        case 'rain': playRain(context, masterGain); break;
        case 'birds': playBirds(context, masterGain); break;
        case 'chimes': playChimes(context, masterGain); break;
      }
      
      setIsPlaying(true);
    }
  }, [currentTrack, volume, stopAllSounds, playOcean, playRain, playBirds, playChimes]);

  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = clampedVolume;
    }
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    tracks: AMBIENT_TRACKS,
    playTrack,
    pause,
    resume,
    changeVolume,
  };
}
