import { useState, useCallback, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types/chat';

// Royalty-free calming music tracks (using placeholder URLs that would need real audio files)
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: '1',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    mood: 'calm',
    duration: '5:00',
    url: 'https://www.soundjay.com/nature/sounds/ocean-wave-2.mp3',
    cover: '',
  },
  {
    id: '2',
    title: 'Gentle Rain',
    artist: 'Ambient Sounds',
    mood: 'relaxing',
    duration: '4:30',
    url: 'https://www.soundjay.com/nature/sounds/rain-03.mp3',
    cover: '',
  },
  {
    id: '3',
    title: 'Forest Birds',
    artist: 'Nature Harmony',
    mood: 'peaceful',
    duration: '3:45',
    url: 'https://www.soundjay.com/nature/sounds/birds-1.mp3',
    cover: '',
  },
  {
    id: '4',
    title: 'Wind Chimes',
    artist: 'Meditation Music',
    mood: 'focus',
    duration: '6:00',
    url: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.mp3',
    cover: '',
  },
];

export function useMusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleError = () => {
      console.log('Audio playback not available for this track');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(() => {
            console.log('Playback failed - this is a demo with placeholder audio');
          });
          setIsPlaying(true);
        }
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(() => {
          console.log('Playback failed - this is a demo with placeholder audio');
        });
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  }, [currentTrack, isPlaying]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const seek = useCallback((percent: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (percent / 100) * duration;
      setProgress(percent);
    }
  }, [duration]);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    tracks: MUSIC_TRACKS,
    playTrack,
    pause,
    resume,
    seek,
    changeVolume,
  };
}
