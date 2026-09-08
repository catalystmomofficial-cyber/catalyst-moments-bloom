import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

/** Keeps relative timestamps accurate while a feed remains open. */
export function useRelativeTime(timestamp: string) {
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  }, [timestamp, clock]);
}
