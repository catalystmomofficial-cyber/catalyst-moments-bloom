import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  time_display: string | null;
  location_type: string | null;
  specialist_name: string | null;
  specialist_title: string | null;
  category: string | null;
  stage_filter: string | null;
  max_capacity: number | null;
  current_attendees: number | null;
  is_featured: boolean | null;
  price_non_member: number | null;
  price_member: number | null;
  points_cost: number | null;
  is_free_for_members: boolean | null;
  replay_available: boolean | null;
  status: string | null;
}

export function useEvents(userStage?: string | null) {
  const [events, setEvents] = useState<SupabaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error: fetchErr } = await (supabase as any)
        .from('events')
        .select('*')
        .in('status', ['upcoming', 'live'])
        .order('event_date', { ascending: true });

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      // stage_filter values match profile.motherhood_stage exactly: 'ttc', 'pregnant', 'postpartum', 'all'
      const filtered: SupabaseEvent[] = (data || []).filter((e: SupabaseEvent) => {
        if (!userStage) return e.stage_filter === 'all';
        return e.stage_filter === 'all' || e.stage_filter === userStage;
      });

      setEvents(filtered);
      setLoading(false);
    };

    fetchEvents();
  }, [userStage]);

  return { events, loading, error };
}

/** Returns true if an event is currently live (within ±30 min of event_date). */
export function isEventLive(eventDate: string | null): boolean {
  if (!eventDate) return false;
  const date = new Date(eventDate).getTime();
  const now = Date.now();
  const diff = date - now;
  return diff >= -30 * 60 * 1000 && diff <= 30 * 60 * 1000;
}

/** Human-readable date from an ISO timestamp. */
export function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  const diffDays = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays >= 2 && diffDays <= 6)
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
