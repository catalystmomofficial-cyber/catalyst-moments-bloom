import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MessageCircle, Send, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

type ChatState = 'open' | 'bubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Never show the guide widget on auth/onboarding pages
const HIDDEN_PATHS = [
  '/login', '/register', '/signup', '/forgot-password',
  '/reset-password', '/auth', '/subscription-success', '/credit-purchase-success',
];

/**
 * Persistent Assessment Guide Chat Widget
 *
 * Rendered once at app level (App.tsx). Shows on:
 *   - Paywall screen (any protected route when not subscribed) → opens full-size, z-[80]
 *   - Homepage + public pages → bubble at bottom-right
 *
 * Stacking order:
 *   z-[80] this widget        ← top
 *   z-[70] Dialog/checkout    ← above paywall background
 *   z-[60] Paywall background ← above navbar
 *   z-[50] Navbar etc.
 */
const AssessmentGuideChat = () => {
  const { user, subscribed, isReturningCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [chatState, setChatState] = useState<ChatState>('bubble');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const initializedRef = useRef(false);
  // null = checking, true/false = resolved
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPaywall = !subscribed && !isReturningCustomer && user != null;
  const isHiddenPath = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));
  const isHomePage = location.pathname === '/';

  // ── Profile check ──
  useEffect(() => {
    if (!user) { setHasAssessment(false); return; }
    supabase
      .from('profiles')
      .select('assessment_data, assessment_concern')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const ad = data?.assessment_data as Record<string, string> | null;
        const hasFunnelData = !!(
          data?.assessment_concern || ad?.score || ad?.tier || ad?.concern
        );
        setHasAssessment(hasFunnelData);
        if (hasFunnelData && !initializedRef.current) {
          initializedRef.current = true;
          sendToApi([], true);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (chatState === 'open') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [chatState]);

  // Auto-expand when on paywall, collapse to bubble on other pages
  useEffect(() => {
    if (onPaywall && hasAssessment === true) {
      setChatState('open');
    } else if (isHomePage) {
      setChatState('bubble');
    }
  }, [onPaywall, hasAssessment, isHomePage]);

  const sendToApi = useCallback(async (history: Message[], isGreeting = false) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const payload = isGreeting
        ? [{ role: 'user', content: '__init__' }]
        : history.map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('assessment-guide', {
        body: { messages: payload },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      const reply = data?.reply ?? "I'm here! Ask me anything about your plan or membership.";
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Hi! I'm your Catalyst Mom Guide — I know your assessment results and I'm here to help you decide.\n\nWhat would you like to know about your plan? You can also [unlock it here →](/dashboard)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    await sendToApi(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Parse [text](url) markdown links → clickable elements
  const renderMessage = (content: string) => {
    const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, href] = match;
        return href.startsWith('/') ? (
          <button
            key={i}
            type="button"
            onClick={() => navigate(href)}
            className="underline underline-offset-2 text-primary font-medium hover:text-primary/80"
          >
            {label}
          </button>
        ) : (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 text-primary font-medium hover:text-primary/80">
            {label}
          </a>
        );
      }
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
      ));
    });
  };

  // Don't show on auth pages or when not logged in without assessment
  if (isHiddenPath) return null;
  if (!user) return null;
  if (hasAssessment === false) return null;
  // Still loading profile — show bubble so paywall user isn't left with nothing
  // (loading state renders a spinner inside the panel if they open it)

  // ── BUBBLE ──
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

  // ── OPEN PANEL ──
  return (
    <div
      className="fixed bottom-6 right-6 z-[80] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden"
      style={{ maxHeight: 'min(520px, calc(100vh - 100px))' }}
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
            onClick={() => setChatState('bubble')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Minimize"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          {/* Full close only available on homepage — on paywall just minimize */}
          {(isHomePage || subscribed || isReturningCustomer) && (
            <button
              type="button"
              onClick={() => setHasAssessment(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth" style={{ minHeight: '200px' }}>
        {/* Loading greeting */}
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

        {/* Waiting for assessment check */}
        {messages.length === 0 && !loading && hasAssessment === null && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Loading your profile…</span>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 mb-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'rounded-br-sm bg-primary text-primary-foreground'
                : 'rounded-bl-sm bg-muted text-foreground'
            }`}>
              {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator after user message */}
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
