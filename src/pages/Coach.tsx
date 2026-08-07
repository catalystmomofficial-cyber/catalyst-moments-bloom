import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageLayout from '@/components/layout/PageLayout';
import CoachMessageContent from '@/components/wellness-coach/CoachMessageContent';
import { useCoachConversation } from '@/hooks/useCoachConversation';
import { useToast } from '@/hooks/use-toast';
import { useAuth, MotherhoodStage } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { detectIntent, logCoachGap } from '@/components/wellness-coach/WellnessCoachIntelligence';
import { Heart, Send, ImagePlus, X, Loader2, RotateCcw } from 'lucide-react';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

const stageLabel = (stage?: string | null): string | null => {
  if (!stage) return null;
  const s = stage.toLowerCase();
  if (s.includes('ttc')) return 'your TTC journey';
  if (s.includes('trimester_1')) return 'your first trimester';
  if (s.includes('trimester_2')) return 'your second trimester';
  if (s.includes('trimester_3')) return 'your third trimester';
  if (s.includes('postpartum_0-6') || s.includes('postpartum_0_6')) return 'your early recovery';
  if (s.includes('postpartum')) return 'your postpartum journey';
  if (s.includes('pregnan')) return 'your pregnancy';
  return null;
};

const suggestionsFor = (stage?: string | null): string[] => {
  const s = (stage ?? '').toLowerCase();
  if (s.includes('pregnan') || s.includes('trimester')) {
    return ['Can I eat this?', 'Is this safe in pregnancy?', 'My hips ache when I sleep', 'How do I prep for labour?'];
  }
  if (s.includes('postpartum')) {
    return ['How do I know if I have diastasis?', 'Is ibuprofen safe while breastfeeding?', 'Can I eat this?', 'My baby is cluster feeding'];
  }
  if (s.includes('ttc')) {
    return ['What should I eat this cycle?', 'Can I take magnesium?', 'How do I track ovulation?', 'What should I ask my doctor?'];
  }
  return ['Can I eat this?', 'Is this supplement safe?', 'What should I do today?', 'I feel exhausted'];
};

const Coach = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { messages, loading, append, clear, historyForModel } = useCoachConversation();

  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const firstName = useMemo(
    () => (profile?.display_name || user?.email?.split('@')[0] || 'mama').split(' ')[0],
    [profile?.display_name, user?.email],
  );

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);
  useEffect(() => { if (!loading && !sending) inputRef.current?.focus(); }, [loading, sending]);

  // A greeting built from what she actually did — not a stored message, so it
  // refreshes each visit and never becomes a stale "yesterday you…".
  useEffect(() => {
    if (!user || loading || messages.length > 0) { setGreeting(null); return; }
    let cancelled = false;

    (async () => {
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      const parts: string[] = [`${timeGreeting}, ${firstName}.`];

      const { data: lastMove } = await supabase
        .from('birth_ball_exercise_logs')
        .select('exercise_name, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastMove) {
        const days = Math.floor((Date.now() - new Date(lastMove.completed_at).getTime()) / 86_400_000);
        parts.push(
          days <= 0
            ? `You already did your ${lastMove.exercise_name} today.`
            : days === 1
              ? `Yesterday you finished your ${lastMove.exercise_name}.`
              : `Your last session was ${lastMove.exercise_name}, ${days} days ago.`,
        );
      }

      const label = stageLabel(profile?.motherhood_stage);
      if (label) parts.push(`I've got ${label} in front of me.`);

      parts.push('How are you feeling today? You can also send me a photo of your food, a label, or a package and ask me anything about it.');

      if (!cancelled) setGreeting(parts.join(' '));
    })();

    return () => { cancelled = true; };
  }, [user, loading, messages.length, firstName, profile?.motherhood_stage]);

  const pickImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Images only', description: 'Send a photo of the food, label or package.', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: 'Photo too large', description: 'Please send a photo under 6MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const send = async (text?: string) => {
    const question = (text ?? input).trim();
    if ((!question && !image) || sending) return;

    const attached = image;
    const outgoing = question || 'What can you tell me about this? Is it safe for me right now?';

    setInput('');
    setImage(null);
    setSending(true);

    const history = historyForModel();
    await append('user', outgoing, attached);

    void logCoachGap(
      outgoing,
      detectIntent(outgoing).intent,
      (profile?.motherhood_stage as MotherhoodStage) ?? null,
      user?.id,
    );

    try {
      const response = await supabase.functions.invoke('wellness-coach-chat', {
        body: {
          messages: [...history, { role: 'user', content: outgoing.slice(0, 2000) }],
          images: attached ? [attached] : undefined,
          userProfile: { ...profile, user_id: user?.id },
        },
      });

      if (response.error) throw response.error;
      await append('assistant', response.data.response);

      (response.data.created_plans ?? []).forEach((plan: any) => {
        toast({ title: 'Plan created', description: `${plan.title} is saved to your account.`, duration: 5000 });
      });
    } catch (error: any) {
      console.error('[Coach] send failed:', error);
      const ctx = error?.context;
      let handled = false;
      try {
        if (ctx && typeof ctx.json === 'function') {
          const body = await ctx.json();
          const status = ctx.status;
          handled = true;
          if (status === 402) {
            toast({ title: 'Coach is out of credits', description: 'AI credits need topping up before Coach Sarah can reply.', variant: 'destructive' });
          } else if (status === 429) {
            toast({ title: 'One moment', description: 'Too many messages at once — try again shortly.', variant: 'destructive' });
          } else {
            toast({ title: 'Coach unavailable', description: body?.error || 'Message failed. Please try again.', variant: 'destructive' });
          }
        }
      } catch { /* fall through */ }
      if (!handled) {
        toast({ title: 'Message failed', description: 'Please try again.', variant: 'destructive' });
      }
    } finally {
      setSending(false);
    }
  };

  const suggestions = suggestionsFor(profile?.motherhood_stage);

  return (
    <PageLayout>
      <Helmet>
        <title>Coach Sarah | Catalyst Mom</title>
        <meta name="description" content="Ask Coach Sarah anything — food and medication safety, your program, recovery, sleep or nutrition — in one ongoing conversation." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-3xl flex-col px-4">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-catalyst-copper/30">
              <AvatarFallback className="bg-catalyst-copper/10 text-catalyst-copper">
                <Heart className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base font-semibold leading-tight">Coach Sarah</h1>
              <p className="text-xs text-muted-foreground">Food, medication, programs, recovery — ask anything</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => void clear()}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Start fresh
            </Button>
          )}
        </header>

        {/* Transcript */}
        <div className="flex-1 space-y-4 overflow-y-auto py-5">
          {loading ? (
            <div className="flex justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <>
              {greeting && messages.length === 0 && (
                <div className="max-w-[85%] text-sm text-foreground">
                  <CoachMessageContent content={greeting} />
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-catalyst-copper px-4 py-2.5 text-sm text-white'
                        : 'max-w-[90%] text-sm text-foreground'
                    }
                  >
                    {m.imageUrl && (
                      <p className={`mb-1 text-xs ${m.role === 'user' ? 'text-white/80' : 'text-muted-foreground'}`}>
                        Photo attached
                      </p>
                    )}
                    <CoachMessageContent content={m.content} />
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Coach Sarah is thinking…
                </div>
              )}
            </>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="border-t py-4">
          {messages.length === 0 && !loading && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="rounded-full border border-catalyst-copper/30 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-catalyst-copper/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {image && (
            <div className="relative mb-3 inline-block">
              <img src={image} alt="Photo you're asking about" className="h-20 w-20 rounded-lg object-cover" />
              <button
                onClick={() => setImage(null)}
                aria-label="Remove photo"
                className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pickImage(f);
                e.target.value = '';
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach a photo"
              disabled={sending}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>

            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask Coach Sarah anything…"
              rows={1}
              className="max-h-32 min-h-[42px] resize-none"
              disabled={sending}
            />

            <Button
              size="icon"
              onClick={() => void send()}
              disabled={sending || (!input.trim() && !image)}
              aria-label="Send message"
              className="bg-catalyst-copper hover:bg-catalyst-copper/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            Coach Sarah gives general wellness guidance. For medication doses, prescriptions, or anything urgent, contact your provider or pharmacist.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Coach;
