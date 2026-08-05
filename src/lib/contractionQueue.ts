// A durable write queue for contractions.
//
// Labour happens in cars, car parks and hospital basements. If the INSERT that
// opens a contraction cannot reach the server, the row does not exist — so the
// recovery query (WHERE ended_at IS NULL) finds nothing, and a refresh loses
// the contraction she is in the middle of.
//
// So every write is queued to localStorage first and drained when possible.
// The queue is the durable record until the server has it; local state is the
// UI, and neither is allowed to be the only copy.

export type QueuedWrite =
  | { kind: 'start'; localId: string; startedAt: number }
  | { kind: 'end'; localId: string; serverId: string | null; endedAt: number; intensity: number };

const KEY = 'cm_contraction_queue';

const read = (): QueuedWrite[] => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
};

const write = (q: QueuedWrite[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch { /* private mode */ }
};

export const enqueue = (w: QueuedWrite) => write([...read(), w]);

export const peek = read;

/** Attach the server id to a queued end once its start has been accepted. */
export const resolveServerId = (localId: string, serverId: string) => {
  write(read().map((w) =>
    w.kind === 'end' && w.localId === localId ? { ...w, serverId } : w,
  ));
};

export const remove = (predicate: (w: QueuedWrite) => boolean) => {
  write(read().filter((w) => !predicate(w)));
};

export const clear = () => write([]);

/**
 * Drain the queue in order.
 *
 * `handlers` return true when the write is durably applied and can be dropped.
 * Anything that returns false stays queued — a failed write during labour must
 * never be silently discarded.
 *
 * Order matters: a start must be applied before the matching end, or the end
 * has nothing to close.
 */
export async function drain(handlers: {
  start: (w: Extract<QueuedWrite, { kind: 'start' }>) => Promise<string | null>;
  end: (w: Extract<QueuedWrite, { kind: 'end' }>) => Promise<boolean>;
}): Promise<void> {
  const queue = read();
  if (queue.length === 0) return;

  const survivors: QueuedWrite[] = [];
  const serverIds = new Map<string, string>();

  for (const w of queue) {
    if (w.kind === 'start') {
      const serverId = await handlers.start(w);
      if (serverId) serverIds.set(w.localId, serverId);
      else survivors.push(w);
    } else {
      const id = w.serverId ?? serverIds.get(w.localId) ?? null;
      // No id yet means its start has not landed. Keep both queued rather than
      // writing an orphan.
      if (!id) { survivors.push(w); continue; }
      const ok = await handlers.end({ ...w, serverId: id });
      if (!ok) survivors.push({ ...w, serverId: id });
    }
  }

  write(survivors);
}
