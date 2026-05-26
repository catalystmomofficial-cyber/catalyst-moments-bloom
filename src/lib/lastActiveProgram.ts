// Tracks the user's most recently visited program/video across the app.
// Used by the dashboard "Program Progress" card to reflect real-time activity.

export type LastActiveProgram = {
  id: string;                 // stable program slug, e.g. 'core-restore-foundations'
  name: string;               // display title
  href: string;               // route to resume
  stage?: 'ttc' | 'pregnancy' | 'postpartum' | 'general';
  unit?: string;              // 'days' | 'videos' | 'sessions'
  completed?: number;
  total?: number;
  streak?: number;
  isComplete?: boolean;
  ctaLabel?: string;
  lastActivity: number;       // epoch ms
};

const STORAGE_KEY = 'cm_last_active_program';
const EVENT = 'cm:last-active-program';

export const setLastActiveProgram = (
  p: Omit<LastActiveProgram, 'lastActivity'> & { lastActivity?: number },
) => {
  try {
    const payload: LastActiveProgram = { ...p, lastActivity: p.lastActivity ?? Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent<LastActiveProgram>(EVENT, { detail: payload }));
  } catch {
    /* noop */
  }
};

export const getLastActiveProgram = (): LastActiveProgram | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastActiveProgram) : null;
  } catch {
    return null;
  }
};

export const subscribeLastActiveProgram = (
  cb: (p: LastActiveProgram | null) => void,
) => {
  const onCustom = (e: Event) => cb((e as CustomEvent<LastActiveProgram>).detail ?? getLastActiveProgram());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(getLastActiveProgram());
  };
  const onFocus = () => cb(getLastActiveProgram());
  window.addEventListener(EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  window.addEventListener('focus', onFocus);
  return () => {
    window.removeEventListener(EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('focus', onFocus);
  };
};
