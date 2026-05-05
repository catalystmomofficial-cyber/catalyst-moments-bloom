import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CoachOutput } from '@/lib/wellnessCoachEngine';

export interface CoachMessageRow {
  id: string;
  user_id: string;
  stage: string;
  score: number;
  priority_gap: string | null;
  urgency_level: string;
  time_of_day: string;
  user_state: string;
  coach_message: string;
  action_label: string;
  action_to: string;
  was_subscribed: boolean;
  created_at: string;
}

export function useCoachHistory(limit = 20) {
  const { user } = useAuth();
  const [history, setHistory] = useState<CoachMessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    setHistory((data as CoachMessageRow[]) || []);
    setIsLoading(false);
  }, [user, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const logMessage = useCallback(
    async (output: CoachOutput, stage: string, score: number) => {
      if (!user) return;
      // Dedupe: skip if last message in last 6h had the same text
      const last = history[0];
      if (last && last.coach_message === output.coachMessage) {
        const ageMs = Date.now() - new Date(last.created_at).getTime();
        if (ageMs < 6 * 60 * 60 * 1000) return;
      }
      await supabase.from('coach_messages').insert({
        user_id: user.id,
        stage,
        score: Math.round(score),
        priority_gap: output.meta.priorityGap,
        urgency_level: output.urgencyLevel,
        time_of_day: output.meta.timeOfDay,
        user_state: output.meta.state,
        coach_message: output.coachMessage,
        action_label: output.suggestedAction.label,
        action_to: output.suggestedAction.to,
        was_subscribed: output.meta.isSubscribed,
      });
      fetchHistory();
    },
    [user, history, fetchHistory]
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      if (!user) return;
      await supabase.from('coach_messages').delete().eq('id', id);
      setHistory((prev) => prev.filter((m) => m.id !== id));
    },
    [user]
  );

  return { history, isLoading, logMessage, deleteMessage, refresh: fetchHistory };
}
