import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TTCCycleSettings {
  id?: string;
  user_id?: string;
  last_period_start: string | null;
  average_cycle_length: number;
  average_period_length: number;
  ttc_start_date: string | null;
  months_trying: number;
  known_conditions: string[];
}

export interface TTCDailyCheckin {
  id: string;
  checkin_date: string;
  cycle_day: number | null;
  energy_score: number | null;
  mood: string | null;
  skin_status: string | null;
  symptoms_notes: string | null;
  created_at: string;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'early_luteal' | 'late_luteal';

const todayISO = () => new Date().toISOString().slice(0, 10);

const daysBetween = (a: string, b: string): number => {
  const ms = new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime();
  return Math.floor(ms / 86400000);
};

export function calcCycleDay(settings: Pick<TTCCycleSettings, 'last_period_start' | 'average_cycle_length'> | null, dateISO = todayISO()): number | null {
  if (!settings?.last_period_start) return null;
  const len = settings.average_cycle_length || 28;
  const elapsed = daysBetween(settings.last_period_start, dateISO);
  if (elapsed < 0) return null;
  return (elapsed % len) + 1;
}

export function calcPhase(cycleDay: number | null): CyclePhase | null {
  if (!cycleDay) return null;
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 12) return 'follicular';
  if (cycleDay <= 15) return 'ovulation';
  if (cycleDay <= 22) return 'early_luteal';
  return 'late_luteal';
}

export function phaseLabel(p: CyclePhase | null): string {
  switch (p) {
    case 'menstrual': return 'Menstrual';
    case 'follicular': return 'Follicular';
    case 'ovulation': return 'Fertile Window';
    case 'early_luteal': return 'Early Luteal';
    case 'late_luteal': return 'Late Luteal';
    default: return '—';
  }
}

export function hormoneContext(p: CyclePhase | null): string {
  switch (p) {
    case 'menstrual':
      return 'Estrogen and progesterone are at their lowest. Rest is productive right now.';
    case 'follicular':
      return 'Estrogen is rising. Your energy and focus are building — a great time for light movement.';
    case 'ovulation':
      return 'LH is surging. Estrogen is peaking. This is your most fertile and energetic phase.';
    case 'early_luteal':
      return 'Progesterone is rising. You may feel warmer and more inward. This is normal.';
    case 'late_luteal':
      return 'Progesterone peaks then drops. Energy may dip. Nourish yourself.';
    default:
      return '';
  }
}

export function fertilityTipsForGap(gap: string | null, phase: CyclePhase | null): string[] {
  const stress = [
    'High cortisol can suppress progesterone — try a 5-min breathing reset before noon.',
    'A walk outside lowers stress hormones better than a workout when overwhelmed.',
    'Caffeine spikes cortisol — try cutting your second cup this week.',
  ];
  const sleep = [
    'Progesterone production needs deep sleep — aim for lights out by 10:30pm.',
    'Magnesium glycinate before bed supports both sleep and luteal phase.',
    'Screens after 9pm suppress melatonin and disrupt cycle hormones.',
  ];
  const nutrition = [
    'Folate, B12, and iron are non-negotiable for fertility — leafy greens daily.',
    'Healthy fats (avocado, eggs, salmon) build the hormones you need to ovulate.',
    'Cut ultra-processed seed oils — they drive inflammation that affects ovulation.',
  ];
  const fitness = [
    'Excessive cardio can suppress ovulation — strength + walking is the sweet spot.',
    'Match movement to phase: heavy lifts in follicular, gentler in luteal.',
    '20–30 minutes most days beats 60 minutes twice a week for fertility.',
  ];
  const generic = [
    'Stay hydrated and eat enough — undereating is a hidden fertility blocker.',
    'A prenatal with methylated folate is worth starting today.',
    'Track one cycle sign daily for 30 days to spot your patterns.',
  ];

  let pool: string[];
  switch (gap) {
    case 'stress': pool = stress; break;
    case 'sleep': pool = sleep; break;
    case 'nutrition': pool = nutrition; break;
    case 'fitness': pool = fitness; break;
    default: pool = generic;
  }

  // Slight phase nudge
  if (phase === 'ovulation') {
    return [pool[0], pool[1], 'You are in your fertile window — prioritize rest and nourishment.'];
  }
  if (phase === 'late_luteal') {
    return [pool[0], 'You are in the two-week wait. Be gentle with yourself.', pool[2]];
  }
  return pool.slice(0, 3);
}

export function useTTCData() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TTCCycleSettings | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<TTCDailyCheckin | null>(null);
  const [allCheckins, setAllCheckins] = useState<TTCDailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const [s, c] = await Promise.all([
      supabase.from('ttc_cycle_settings').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('ttc_daily_checkins').select('*').eq('user_id', user.id).order('checkin_date', { ascending: false }).limit(120),
    ]);
    setSettings((s.data as TTCCycleSettings) ?? null);
    const checkins = (c.data as TTCDailyCheckin[]) ?? [];
    setAllCheckins(checkins);
    setTodayCheckin(checkins.find(x => x.checkin_date === todayISO()) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const cycleDay = calcCycleDay(settings);
  const phase = calcPhase(cycleDay);

  return {
    settings,
    todayCheckin,
    allCheckins,
    loading,
    cycleDay,
    phase,
    refresh,
    hasSettings: !!settings?.last_period_start,
  };
}
