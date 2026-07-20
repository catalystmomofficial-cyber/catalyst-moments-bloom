import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Flame, Star, Crown, Target, Calendar, Heart, Users, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { AwardBadge, type AwardRarity } from './AwardBadge';

interface Achievement {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  earned_at: string;
  earned?: boolean;
}

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  award: Award,
  flame: Flame,
  star: Star,
  crown: Crown,
  target: Target,
  calendar: Calendar,
  heart: Heart,
  users: Users,
  zap: Zap,
};

interface AchievementModalProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AchievementModal = ({ achievement, open, onOpenChange }: AchievementModalProps) => {
  if (!achievement) return null;
  const Icon = iconMap[achievement.icon] || Trophy;
  const rarity: AwardRarity =
    achievement.level >= 4 ? 'legendary' : achievement.level === 3 ? 'epic' : achievement.level === 2 ? 'rare' : 'common';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center p-0 overflow-hidden border-none">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="p-8"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', damping: 14 }}
                className="mb-4"
              >
                <AwardBadge title={achievement.title} rarity={rarity} icon={<Icon className="w-7 h-7" />} />
              </motion.div>

              {achievement.level > 1 && (
                <Badge variant="secondary" className="mb-3">
                  Level {achievement.level}
                </Badge>
              )}

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-muted-foreground mb-4"
              >
                {achievement.description}
              </motion.p>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-xs text-muted-foreground"
              >
                {achievement.earned === false
                  ? '🔒 Not yet unlocked — keep going to earn this one'
                  : `🏆 Earned ${format(new Date(achievement.earned_at), 'MMMM d, yyyy')}`}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
