import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Minimize2, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type ChatState = 'open' | 'tab' | 'bubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Pre-membership Assessment Guide Chat Widget
 *
 * Only visible to users who have assessment data in their profile
 * (i.e., arrived from the catalystmom.online assessment funnel).
 *
 * States:
 *   open   → full chat panel (bottom-right, z-[80] above paywall + dialog)
 *   tab    → small pill tab pinned to right edge — click to re-open
 *   bubble → small floating circle at bottom-right — click to re-open
 *
 * Bugs fixed (vs previous version):
 *   1. loading never reset — early return when !session now calls setLoading(false)
 *   2. greeting re-fired on re-render — switched from useState to useRef for initialized flag
 *   3. hasAssessment starts null (not false) — avoids hiding widget before check completes
 */
const AssessmentGuideChat = () => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>('open');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // useRef so the greeting flag survives re-renders without triggering effects
  const initializedRef = useRef(false);
  // null = not yet checked, true/false = checked
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if user has assessment data — only show widget if they do
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('assessment_data, assessment_concern')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const ad = data?.assessment_data as Record<string, string> | null;
        const hasFunnelData = !!(
          data?.assessment_concern ||
          ad?.score || ad?.tier || ad?.concern
        );
        setHasAssessment(hasFunnelData);
        if (hasFunnelData && !initializedRef.current) {
          initializedRef.current = true;
          // Trigger the personalized greeting
          sendToApi([], true);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatState === 'open') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatState]);

  const sendToApi = async (history: Message[], isGreeting = false) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // FIX: always reset loading — was previously leaking and locking the input
        setLoading(false);
        return;
      }

      const payload = isGreeting
        ? [{ role: 'user', content: '__init__' }]
        : history.map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('assessment-guide', {
        body: { messages: payload },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      const reply = data?.reply ?? "I'm here! Ask me anything about your plan or the membership.";
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply },
      ]);
    } catch (err) {
      console.error('[AssessmentGuide] Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Hi! I'm your Catalyst Mom Guide. I can answer questions about your assessment results or help you understand what's included. What would you like to know?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);

    await sendToApi(nextHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Still loading profile — don't flash or block
  if (hasAssessment === null) return null;
  // No assessment data — widget not shown
  if (!hasAssessment) return null;

  // ── BUBBLE STATE ──
  if (chatState === 'bubble') {
    return (
      <button
        type="button"
        onClick={() => setChatState('open')}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-all hover:scale-110 active:scale-95"
        aria-label="Open Catalyst Mom Guide"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
        {messages.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
          </span>
        )}
      </button>
    );
  }

  // ── TAB STATE ──
  if (chatState === 'tab') {
    return (
      <button
        type="button"
        onClick={() => setChatState('open')}
        className="fixed bottom-24 right-0 z-[80] flex items-center gap-2 rounded-l-full bg-primary py-3 pl-4 pr-3 shadow-lg shadow-primary/30 transition-all hover:-translate-x-1 active:scale-95"
        aria-label="Open Guide"
      >
        <Sparkles className="h-4 w-4 text-primary-foreground" />
        <span className="text-xs font-semibold text-primary-foreground">Guide</span>
        <ChevronDown className="h-4 w-4 rotate-90 text-primary-foreground/70" />
      </button>
    );
  }

  // ── OPEN STATE ──
  return (
    <div
      className="fixed bottom-6 right-6 z-[80] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden"
      style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">Catalyst Mom Guide</p>
          <p className="text-xs text-muted-foreground">Here to help you decide</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setChatState('tab')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Minimize to tab"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setChatState('bubble')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close to bubble"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        style={{ minHeight: '200px' }}
      >
        {messages.length === 0 && loading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Personalizing your welcome…</span>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 mb-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-muted text-foreground'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && messages.length > 0 && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 mb-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentGuideChat;
