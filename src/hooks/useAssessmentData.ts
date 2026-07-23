import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AssessmentData {
  name?: string;
  email?: string;
  score?: string | number;
  tier?: string;
  stage?: string;
  primary_goal?: string;
  biggest_obstacle?: string;
  birth_experience?: string;
  [key: string]: any;
}

export const useAssessmentData = () => {
  const { user } = useAuth();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setAssessmentData(null);
        setLoading(false);
        return;
      }
      const { data } = await (supabase as any)
        .from('profiles')
        .select('assessment_data, assessment_concern, assessment_reflection')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      const base = (data?.assessment_data as AssessmentData) || null;
      // Dedicated columns are the durable source of truth for her concern and
      // its AI reflection; they win over whatever the JSON blob carries.
      const merged = base || data?.assessment_concern || data?.assessment_reflection
        ? {
            ...(base || {}),
            ...(data?.assessment_concern ? { concern: data.assessment_concern } : {}),
            ...(data?.assessment_reflection ? { reflection: data.assessment_reflection } : {}),
          }
        : null;
      setAssessmentData(merged);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const scoreNumber = (() => {
    const s = assessmentData?.score;
    if (s === undefined || s === null || s === '') return null;
    const n = typeof s === 'number' ? s : parseFloat(String(s));
    return isNaN(n) ? null : n;
  })();

  return { assessmentData, loading, scoreNumber };
};
