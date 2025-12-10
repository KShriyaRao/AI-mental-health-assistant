import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    tracks,
    playTrack,
    pause,
    resume,
    seek,
    changeVolume,
  } = useMusicPlayer();

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-display font-medium text-foreground px-1">
        Calming Sounds
      </h3>

      {/* Track List */}
      <div className="grid gap-2">
        {tracks.map((track, index) => (
          <Card
            key={track.id}
            className={cn(
              'cursor-pointer transition-all duration-300 animate-fade-in',
              'hover:shadow-soft border-border/50',
              currentTrack?.id === track.id && 'border-primary/50 bg-primary/5'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => playTrack(track)}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <div 
                className={cn(
                  'p-2.5 rounded-xl transition-colors',
                  currentTrack?.id === track.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-calm-ocean-light'
                )}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-3 bg-current rounded-full animate-wave" />
                    <div className="w-1 h-4 bg-current rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-2 bg-current rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                  </div>
                ) : (
                  <Music className="w-4 h-4 text-calm-ocean" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {track.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {track.artist}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {track.mood}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <Card className="gradient-card border-border/50 shadow-soft animate-scale-in">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Now Playing
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isPlaying ? pause() : resume()}
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>
            </div>

            {/* Progress */}
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={([value]) => seek(value)}
              className="cursor-pointer"
            />

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeVolume(volume > 0 ? 0 : 0.5)}
                className="h-8 w-8 p-0"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => changeVolume(value / 100)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
