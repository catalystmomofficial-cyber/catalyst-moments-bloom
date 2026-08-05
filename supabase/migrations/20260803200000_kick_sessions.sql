-- Kick counter history belongs in the database, not in one browser.
--
-- BabyKickCounter kept every session in localStorage under
-- 'kickCounterSessions' and nowhere else. That is a problem here in a way it
-- is not for a cosmetic preference, because the component runs real safety
-- logic over that history:
--
--   const last3 = sessions.slice(0, 3);
--   if (low >= 2) return { kind: 'concern',
--     msg: 'Recent sessions are lower than usual. If this continues, contact your provider.' };
--
-- Reduced fetal movement is a recognised warning sign, and the whole reason to
-- count kicks is to compare today against HER established pattern. With the
-- history in localStorage, a new phone, a cleared browser, or a reinstalled
-- PWA leaves `sessions` empty — pattern detection returns null and the warning
-- can never fire. The safety net disappears silently, exactly when a mother
-- switching devices late in pregnancy would most need it.
--
-- This table is a record of what she observed. It is not a medical device and
-- nothing here diagnoses anything; the guidance in the UI continues to point
-- her to her provider.

CREATE TABLE IF NOT EXISTS public.kick_sessions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at   timestamptz NOT NULL,
  ended_at     timestamptz NOT NULL,
  kick_count   integer     NOT NULL CHECK (kick_count >= 0),
  duration_min integer     NOT NULL CHECK (duration_min >= 0),
  -- Gestational week at the time, so a pattern can be read against how far
  -- along she was. Movement norms differ a lot at 26 weeks and at 38.
  week         integer,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Every read is "her most recent sessions, newest first".
CREATE INDEX IF NOT EXISTS kick_sessions_user_started_idx
  ON public.kick_sessions (user_id, started_at DESC);

-- A double-tap on "end session", or the same session synced from two devices,
-- should not read as two separate low counts and skew the pattern check.
CREATE UNIQUE INDEX IF NOT EXISTS kick_sessions_user_started_unique
  ON public.kick_sessions (user_id, started_at);

ALTER TABLE public.kick_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own kick sessions"   ON public.kick_sessions;
DROP POLICY IF EXISTS "Users insert own kick sessions" ON public.kick_sessions;
DROP POLICY IF EXISTS "Users delete own kick sessions" ON public.kick_sessions;

CREATE POLICY "Users view own kick sessions"
  ON public.kick_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own kick sessions"
  ON public.kick_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- She can remove a mistaken session (a phone in a pocket counting phantom
-- taps), but not edit one — an altered count would corrupt the very pattern
-- the safety check reads.
CREATE POLICY "Users delete own kick sessions"
  ON public.kick_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
