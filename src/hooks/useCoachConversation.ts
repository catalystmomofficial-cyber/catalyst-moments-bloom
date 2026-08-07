import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

/**
 * One ongoing conversation with Coach Sarah, stored on her account.
 *
 * Deliberately a single thread rather than a list of chats: the point is that
 * it feels like the same person she spoke to last week, on whichever device she
 * picks up. Saving is fire-and-forget from the caller's point of view but
 * errors are logged, never swallowed silently.
 */
export function useCoachConversation() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setMessages([]); setLoading(false); return; }

    const { data, error } = await supabase
      .from('coach_conversation_messages')
      .select('id, role, content, image_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) {
      console.error('[Coach] Failed to load conversation:', error);
      setLoading(false);
      return;
    }

    setMessages(
      (data ?? []).map((r) => ({
        id: r.id,
        role: r.role as 'user' | 'assistant',
        content: r.content,
        imageUrl: r.image_url,
        createdAt: r.created_at,
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  /** Appends locally straight away, then persists. */
  const append = useCallback(
    async (role: 'user' | 'assistant', content: string, imageUrl?: string | null) => {
      const local: CoachMessage = {
        id: `local-${Date.now()}-${role}`,
        role,
        content,
        imageUrl: imageUrl ?? null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, local]);

      if (!user) return local;

      // Photos can be multi-megabyte data URLs; the row keeps the text and a
      // marker, not the raw image, so her history stays cheap to load.
      const { data, error } = await supabase
        .from('coach_conversation_messages')
        .insert({
          user_id: user.id,
          role,
          content,
          image_url: imageUrl ? 'photo' : null,
        })
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('[Coach] Failed to save message:', error);
      } else if (data) {
        setMessages((prev) => prev.map((m) => (m.id === local.id ? { ...m, id: data.id } : m)));
      }
      return local;
    },
    [user],
  );

  const clear = useCallback(async () => {
    setMessages([]);
    if (!user) return;
    const { error } = await supabase
      .from('coach_conversation_messages')
      .delete()
      .eq('user_id', user.id);
    if (error) console.error('[Coach] Failed to clear conversation:', error);
  }, [user]);

  /** Trailing turns in the shape the edge function expects. */
  const historyForModel = useCallback(
    () => messages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

  return { messages, loading, append, clear, historyForModel, reload: load };
}
