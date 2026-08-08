import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Paid course media (videos, PDFs) lives in the private `catalystcourses`
 * bucket. Nothing in the app may hold a permanent URL to it — a permanent URL
 * is a URL that can be forwarded to someone who never paid. Instead, data files
 * store a marker path and we mint a short-lived signed URL at playback time.
 *
 * Storage RLS decides whether the signature is issued at all, so an unpaid
 * account simply gets null and the player shows its empty state.
 */
export const COURSE_MEDIA_PREFIX = 'course://';
const COURSE_BUCKET = 'catalystcourses';

/** Signed links last an hour — long enough for the longest video, short enough to be useless when shared. */
const SIGNED_URL_TTL_SECONDS = 60 * 60;
/** Re-sign a little before expiry so a link never dies mid-session. */
const CACHE_TTL_MS = (SIGNED_URL_TTL_SECONDS - 120) * 1000;

const cache = new Map<string, { url: string; expiresAt: number }>();

export const isCourseMedia = (value?: string | null): boolean =>
  !!value && value.startsWith(COURSE_MEDIA_PREFIX);

export const courseMediaPath = (path: string): string => `${COURSE_MEDIA_PREFIX}${path}`;

/**
 * Resolve a value that may be a `course://` marker, an ordinary URL, or empty.
 * Ordinary URLs (YouTube embeds, local assets) pass through untouched.
 */
export const resolveCourseMedia = async (value?: string | null): Promise<string | null> => {
  if (!value) return null;
  if (!isCourseMedia(value)) return value;

  const path = value.slice(COURSE_MEDIA_PREFIX.length);
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const { data, error } = await supabase.storage
    .from(COURSE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('Could not sign course media', path, error?.message);
    return null;
  }

  cache.set(path, { url: data.signedUrl, expiresAt: Date.now() + CACHE_TTL_MS });
  return data.signedUrl;
};

/** Open paid media (a PDF, usually) in a new tab through a freshly signed link. */
export const openCourseMedia = async (value: string): Promise<boolean> => {
  const url = await resolveCourseMedia(value);
  if (!url) return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

export interface SignedMediaState {
  url: string | null;
  loading: boolean;
  /** True when the link could not be signed — usually means no access. */
  denied: boolean;
}

/** React binding for the resolver above. */
export const useSignedMedia = (value?: string | null): SignedMediaState => {
  const [state, setState] = useState<SignedMediaState>(() => ({
    url: isCourseMedia(value) ? null : value ?? null,
    loading: isCourseMedia(value),
    denied: false,
  }));

  useEffect(() => {
    if (!isCourseMedia(value)) {
      setState({ url: value ?? null, loading: false, denied: false });
      return;
    }

    let active = true;
    setState({ url: null, loading: true, denied: false });
    resolveCourseMedia(value).then((url) => {
      if (!active) return;
      setState({ url, loading: false, denied: !url });
    });
    return () => {
      active = false;
    };
  }, [value]);

  return state;
};
