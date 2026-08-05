import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface LaborContacts {
  provider_triage_phone: string | null;
  provider_name: string | null;
  hospital_name: string | null;
  backup_contact_name: string | null;
  backup_contact_phone: string | null;
}

const EMPTY: LaborContacts = {
  provider_triage_phone: null, provider_name: null, hospital_name: null,
  backup_contact_name: null, backup_contact_phone: null,
};

const CACHE_KEY = 'cm_labor_contacts';

/**
 * Her labour-day contacts.
 *
 * Cached in localStorage on purpose: the one moment this is needed is the one
 * moment the network may be gone. A call button that cannot render its number
 * because the profile query failed is worse than useless.
 */
export function useLaborContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<LaborContacts>(() => {
    try {
      const c = localStorage.getItem(CACHE_KEY);
      return c ? { ...EMPTY, ...JSON.parse(c) } : EMPTY;
    } catch { return EMPTY; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('provider_triage_phone, provider_name, hospital_name, backup_contact_name, backup_contact_phone')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        setContacts({ ...EMPTY, ...(data as Partial<LaborContacts>) });
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* private mode */ }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const save = useCallback(async (next: Partial<LaborContacts>) => {
    const merged = { ...contacts, ...next };
    setContacts(merged);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)); } catch { /* private mode */ }
    if (!user) return { error: null };
    const { error } = await supabase.from('profiles').update(next).eq('user_id', user.id);
    return { error };
  }, [contacts, user]);

  return {
    contacts,
    loading,
    save,
    /** The triage line is what the call button dials. Everything else is context. */
    hasTriageLine: Boolean(contacts.provider_triage_phone?.trim()),
  };
}
