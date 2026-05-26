import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  Check,
  Monitor,
  X,
  Smartphone,
  Tv,
} from 'lucide-react';
import { useRemoteSync } from '@/contexts/RemoteSyncContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RemoteControllerOverlay() {
  const { remotePlayers, showController, setShowController, controllerActive, sendCommand } =
    useRemoteSync();
  const { vibrate } = useHapticFeedback();

  // pick most recently updated remote player
  const player = useMemo(
    () => [...remotePlayers].sort((a, b) => b.ts - a.ts)[0],
    [remotePlayers]
  );

  if (!showController || !player) return null;

  const tap = (fn: () => void) => () => {
    vibrate('light');
    fn();
  };

  const progress = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-[60] p-3 pointer-events-none"
      >
        <Card className="mx-auto max-w-md pointer-events-auto bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Tv className="h-5 w-5 text-primary" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {controllerActive ? 'Auto Remote' : 'Remote Control'}
                  </p>
                  <p className="text-sm font-semibold leading-tight">
                    {player.program ?? 'Playing on another device'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowController(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Now playing */}
            <div className="space-y-1">
              <p className="text-base font-bold truncate">{player.exerciseName ?? player.title}</p>
              {player.totalExercises && player.exerciseIndex !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Exercise {player.exerciseIndex + 1} of {player.totalExercises}
                </p>
              )}
            </div>

            {/* Scrub bar */}
            <div className="space-y-1">
              <Slider
                value={[player.currentTime]}
                min={0}
                max={Math.max(player.duration, 1)}
                step={1}
                onValueChange={([v]) => sendCommand(player.sessionId, { type: 'seek', value: v })}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                <span>{fmt(player.currentTime)}</span>
                <span>{fmt(player.duration)}</span>
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={tap(() => sendCommand(player.sessionId, { type: 'prev' }))}
                title="Previous exercise"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={tap(() => sendCommand(player.sessionId, { type: 'seek-relative', value: -10 }))}
              >
                <Rewind className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={tap(() =>
                  sendCommand(player.sessionId, { type: player.isPlaying ? 'pause' : 'play' })
                )}
              >
                {player.isPlaying ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={tap(() => sendCommand(player.sessionId, { type: 'seek-relative', value: 10 }))}
              >
                <FastForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={tap(() => sendCommand(player.sessionId, { type: 'next' }))}
                title="Next exercise"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume + complete */}
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider
                value={[Math.round(player.volume * 100)]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) =>
                  sendCommand(player.sessionId, { type: 'volume', value: v / 100 })
                }
              />
              <Button
                size="sm"
                variant="outline"
                className="gap-1 shrink-0"
                onClick={tap(() => sendCommand(player.sessionId, { type: 'mark-complete' }))}
              >
                <Check className="h-3 w-3" /> Complete
              </Button>
            </div>

            {/* Device chip */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>Phone</span>
              <span className="opacity-40">→</span>
              <Monitor className="h-3 w-3" />
              <span>{player.deviceType === 'desktop' ? 'TV / Desktop' : 'Other device'}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
