import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = '__cm_404_logged__';

function getLoggedSet(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markLogged(path: string) {
  try {
    const set = getLoggedSet();
    set.add(path);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export async function logNotFound(path: string) {
  if (!path) return;
  const logged = getLoggedSet();
  if (logged.has(path)) return;
  markLogged(path);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('not_found_logs').insert({
      path,
      user_id: user?.id ?? null,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (err) {
    console.warn('[404] failed to log', err);
  }
}
