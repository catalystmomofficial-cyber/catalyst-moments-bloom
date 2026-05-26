import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, Sparkles, Heart, Battery, X, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useRemoteSync } from '@/hooks/useRemoteSync';

export interface VideoChapter {
  /** seconds at which the chapter ends and triggers a checkpoint */
  endTime: number;
  title: string;
}

interface CheckpointVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  /** Unique key used for streak tracking (e.g. 'birth-ball-hero') */
  streakKey: string;
  /** Chapters in order. Last chapter's endTime should ~= video duration. */
  chapters?: VideoChapter[];
  /** If chapters not provided, auto-split every N seconds (default 180s = 3min). */
  autoChapterSeconds?: number;
  /** Optional: remote controller wants to jump exercises / mark complete */
  onRemoteAction?: (action: { type: 'next' | 'prev' | 'mark-complete' | 'chapter'; value?: number }) => void;
  /** Optional: extra meta to broadcast to the remote (exercise context) */
  remoteMeta?: {
    program?: string;
    exerciseIndex?: number;
    totalExercises?: number;
    exerciseName?: string;
  };
}

const REWARD_BADGES = [
  { icon: '🔥', label: 'On Fire' },
  { icon: '⭐', label: 'Rising Star' },
  { icon: '💪', label: 'Strong Mama' },
  { icon: '🌸', label: 'Bloom' },
];

export default function CheckpointVideoPlayer({
  src,
  poster,
  title,
  streakKey,
  chapters,
  autoChapterSeconds = 180,
  onRemoteAction,
  remoteMeta,
}: CheckpointVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const { awardPoints } = usePoints();
  const { toast } = useToast();
  const { vibrate: triggerHaptic } = useHapticFeedback();

  const [resolvedChapters, setResolvedChapters] = useState<VideoChapter[]>(chapters ?? []);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showReward, setShowReward] = useState<{ type: 'points' | 'badge'; payload: any } | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const triggeredRef = useRef<Set<number>>(new Set());

  useRemoteSync({
    videoRef,
    meta: {
      title,
      program: remoteMeta?.program ?? streakKey,
      chapter: currentChapter,
      totalChapters: resolvedChapters.length,
      exerciseIndex: remoteMeta?.exerciseIndex,
      totalExercises: remoteMeta?.totalExercises,
      exerciseName: remoteMeta?.exerciseName ?? title,
    },
    onAction: (a) => {
      if (a.type === 'next' || a.type === 'prev' || a.type === 'mark-complete' || a.type === 'chapter') {
        onRemoteAction?.({ type: a.type, value: (a as any).value });
      }
    },
  });

  // Auto-generate chapters from duration if none provided
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (!chapters || chapters.length === 0) {
      const dur = videoRef.current.duration;
      if (!isFinite(dur) || dur <= 0) return;
      const auto: VideoChapter[] = [];
      let t = autoChapterSeconds;
      let i = 1;
      while (t < dur) {
        auto.push({ endTime: t, title: `Chapter ${i}` });
        t += autoChapterSeconds;
        i++;
      }
      auto.push({ endTime: dur, title: `Chapter ${i}` });
      setResolvedChapters(auto);
    }
  };

  const computeStreak = async () => {
    if (!user) return 0;
    const { data } = await supabase
      .from('birth_ball_exercise_logs')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('exercise_id', `video:${streakKey}`)
      .order('completed_at', { ascending: false })
      .limit(60);
    if (!data || data.length === 0) return 0;
    const days = new Set(data.map((d) => new Date(d.completed_at).toDateString()));
    let count = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  };

  useEffect(() => {
    computeStreak().then(setStreak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, streakKey]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || resolvedChapters.length === 0) return;
    const t = v.currentTime;
    for (let i = 0; i < resolvedChapters.length - 1; i++) {
      const ch = resolvedChapters[i];
      if (t >= ch.endTime && !triggeredRef.current.has(i)) {
        triggeredRef.current.add(i);
        v.pause();
        setCurrentChapter(i);
        setShowCheckpoint(true);
        triggerHaptic('medium');
        return;
      }
    }
  };

  const logCompletion = async (chapterIndex: number) => {
    if (!user) return;
    await supabase.from('birth_ball_exercise_logs').insert({
      user_id: user.id,
      exercise_id: `video:${streakKey}`,
      exercise_name: `${title} — ${resolvedChapters[chapterIndex]?.title ?? 'Chapter'}`,
    });
    await awardPoints(10, 'video_chapter', `Completed ${title} chapter`);
  };

  const handleCheckIn = async (feeling: 'great' | 'tired' | 'done') => {
    setShowCheckpoint(false);
    triggerHaptic('light');
    await logCompletion(currentChapter);
    if (feeling === 'tired') {
      toast({ title: 'Listen to your body 💗', description: 'Take a breath. Resume when ready.' });
    }
    // resume
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };

  const maybeAwardSurprise = async () => {
    if (Math.random() < 0.25) {
      // 25% chance variable reward
      if (Math.random() < 0.5) {
        const bonus = 25 + Math.floor(Math.random() * 25);
        await awardPoints(bonus, 'surprise_reward', 'Surprise bonus from video completion');
        setShowReward({ type: 'points', payload: bonus });
      } else {
        const badge = REWARD_BADGES[Math.floor(Math.random() * REWARD_BADGES.length)];
        if (user) {
          await supabase.from('user_achievements').insert({
            user_id: user.id,
            achievement_id: `video_surprise_${Date.now()}`,
            achievement_type: 'badge',
            title: badge.label,
            description: `Surprise badge from ${title}`,
            icon: 'trophy',
          });
        }
        setShowReward({ type: 'badge', payload: badge });
      }
      triggerHaptic('heavy');
    }
  };

  const handleEnded = async () => {
    // Log final chapter
    await logCompletion(resolvedChapters.length - 1);
    const newStreak = (await computeStreak()) || streak + 1;
    setStreak(newStreak);
    setShowStreak(true);
    triggerHaptic('heavy');
    await maybeAwardSurprise();
  };

  return (
    <div className="relative w-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          crossOrigin="anonymous"
          {...{ 'x-webkit-airplay': 'allow', 'webkit-playsinline': '', disableRemotePlayback: false }}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full h-full"
        />

        {/* Chapter progress dots */}
        {resolvedChapters.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1 pointer-events-none">
            {resolvedChapters.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  triggeredRef.current.has(i) || i < currentChapter
                    ? 'bg-primary'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Checkpoint overlay */}
        <AnimatePresence>
          {showCheckpoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-10"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <Card className="p-6 max-w-md w-full bg-card border-primary/30 shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Set Complete!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {resolvedChapters[currentChapter]?.title} done. How are you feeling?
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => handleCheckIn('great')} className="gap-2">
                        <Heart className="h-4 w-4" /> I feel great
                      </Button>
                      <Button
                        onClick={() => handleCheckIn('tired')}
                        variant="outline"
                        className="gap-2"
                      >
                        <Battery className="h-4 w-4" /> A bit tired
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleCheckIn('done')}
                      variant="ghost"
                      className="w-full text-xs"
                    >
                      Set Completed → Continue
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Streak overlay */}
      <AnimatePresence>
        {showStreak && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStreak(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 max-w-sm bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 border-orange-500/40">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mx-auto"
                  >
                    <Flame className="h-20 w-20 text-orange-500 mx-auto" fill="currentColor" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold">Day {Math.max(streak, 1)}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {streak >= 2 ? "Don't break the streak!" : 'Streak started — keep it going tomorrow!'}
                    </p>
                  </div>
                  <Button onClick={() => setShowStreak(false)} className="w-full">
                    Keep Going
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise reward */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReward(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 max-w-sm bg-gradient-to-br from-amber-400/20 via-yellow-300/20 to-orange-400/20 border-amber-400/40 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7"
                  onClick={() => setShowReward(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="text-center space-y-4">
                  <div className="text-6xl">
                    {showReward.type === 'badge' ? showReward.payload.icon : '✨'}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold">
                      Surprise Reward!
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {showReward.type === 'badge'
                        ? `${showReward.payload.label} Badge`
                        : `+${showReward.payload} Catalyst Points`}
                    </h3>
                  </div>
                  <Button onClick={() => setShowReward(null)} className="w-full gap-2">
                    <Trophy className="h-4 w-4" /> Claim
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
