import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Flame, Star, Crown, Target, Calendar, Heart, Users, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  earned_at: string;
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
              {/* Glow ring */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', damping: 12 }}
                className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />
                <div className="p-4 rounded-full bg-primary/10">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-xl font-bold mb-1"
              >
                {achievement.title}
              </motion.h2>

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
                🏆 Earned {format(new Date(achievement.earned_at), 'MMMM d, yyyy')}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
