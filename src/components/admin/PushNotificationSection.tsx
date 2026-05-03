import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bell, Send, Loader2, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Audience = 'all' | 'segments';
const STAGE_OPTIONS = [
  { value: 'ttc', label: 'TTC' },
  { value: 'pregnancy', label: 'Pregnancy' },
  { value: 'postpartum', label: 'Postpartum' },
  { value: 'none', label: 'No stage set' },
] as const;

export const PushNotificationSection = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deepLink, setDeepLink] = useState('/dashboard');
  const [audience, setAudience] = useState<Audience>('all');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [userIdsRaw, setUserIdsRaw] = useState('');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number; total?: number } | null>(null);

  const toggleStage = (stage: string) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  };

  const parsedUserIds = userIdsRaw
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s));

  const send = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and body are required');
      return;
    }
    if (audience === 'segments' && selectedStages.length === 0 && parsedUserIds.length === 0) {
      toast.error('Pick at least one stage or paste user IDs');
      return;
    }
    setSending(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        body,
        image_url: imageUrl || undefined,
        url: deepLink || '/',
        requireAdmin: true,
      };
      if (audience === 'segments') {
        if (selectedStages.length > 0) payload.stages = selectedStages;
        if (parsedUserIds.length > 0) payload.user_ids = parsedUserIds;
      }
      const { data, error } = await supabase.functions.invoke('send-push-blast', {
        body: payload,
      });
      if (error) throw error;
      setLastResult({ sent: data.sent ?? 0, failed: data.failed ?? 0, total: data.total });
      toast.success(`Sent to ${data.sent ?? 0} devices`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const sendLifecycle = async (type: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-lifecycle-notifications', {
        body: { type },
      });
      if (error) throw error;
      toast.success(`${type}: sent to ${data.sent ?? 0} devices`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to send');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Manual Blast
          </CardTitle>
          <CardDescription>
            Send a push notification to all opted-in users right now.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="push-title">Title</Label>
            <Input
              id="push-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your daily movement is ready"
              maxLength={65}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="push-body">Body</Label>
            <Textarea
              id="push-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Let's find your flow."
              rows={3}
              maxLength={240}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="push-image">Image URL (optional)</Label>
            <Input
              id="push-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="push-link">Destination Page (Deep Link)</Label>
            <Input
              id="push-link"
              value={deepLink}
              onChange={(e) => setDeepLink(e.target.value)}
              placeholder="/workouts"
            />
          </div>

          {/* Audience */}
          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Audience</Label>
              <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setAudience('all')}
                  className={`px-3 py-1 rounded ${audience === 'all' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                >
                  All opted-in
                </button>
                <button
                  type="button"
                  onClick={() => setAudience('segments')}
                  className={`px-3 py-1 rounded ${audience === 'segments' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                >
                  Targeted
                </button>
              </div>
            </div>

            {audience === 'segments' && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Stages</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGE_OPTIONS.map((s) => {
                      const active = selectedStages.includes(s.value);
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => toggleStage(s.value)}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            active
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="push-user-ids" className="text-xs text-muted-foreground">
                    User IDs (UUIDs, comma/newline separated)
                  </Label>
                  <Textarea
                    id="push-user-ids"
                    value={userIdsRaw}
                    onChange={(e) => setUserIdsRaw(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    rows={2}
                    className="mt-1 font-mono text-xs"
                  />
                  {userIdsRaw && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {parsedUserIds.length} valid UUID{parsedUserIds.length === 1 ? '' : 's'} detected
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Stages and user IDs are combined (union). Only users with an active push subscription receive it.
                </p>
              </div>
            )}
          </div>

          <Button onClick={send} disabled={sending} className="w-full" size="lg">
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Now
          </Button>

          {lastResult && (
            <p className="text-sm text-muted-foreground">
              Last blast: {lastResult.sent} delivered
              {typeof lastResult.total === 'number' ? ` / ${lastResult.total} targeted` : ''},{' '}
              {lastResult.failed} failed.
            </p>
          )}

          <div className="pt-4 border-t space-y-2">
            <p className="text-sm font-medium">Test Lifecycle Triggers</p>
            <div className="flex flex-wrap gap-2">
              {['welcome', 'daily_workout', 'meal_reminder', 'inactivity'].map((t) => (
                <Button key={t} variant="outline" size="sm" onClick={() => sendLifecycle(t)}>
                  {t.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          Live Preview
        </div>
        <div className="mx-auto w-full max-w-[320px] rounded-[2.5rem] border-8 border-foreground/80 bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-2xl">
          <div className="rounded-[1.75rem] bg-slate-900 px-3 pt-8 pb-12 min-h-[480px]">
            <div className="text-center text-xs text-slate-400 mb-6">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="rounded-2xl bg-slate-100/95 dark:bg-slate-200 p-3 shadow-xl backdrop-blur">
              <div className="flex items-start gap-2.5">
                <img
                  src="/catalyst-mom-logo.png"
                  alt="Catalyst Mom"
                  className="h-9 w-9 rounded-lg object-cover bg-white"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                      Catalyst Mom
                    </span>
                    <span className="text-[10px] text-slate-500">now</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {title || 'Notification title'}
                  </p>
                  <p className="text-xs text-slate-700 line-clamp-3">
                    {body || 'Your message preview will appear here.'}
                  </p>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt=""
                      className="mt-2 w-full h-24 object-cover rounded-md"
                      onError={(e) => ((e.currentTarget.style.display = 'none'))}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Logo, title, body & image render the same way on Android & iOS.
        </p>
      </div>
    </div>
  );
};

export default PushNotificationSection;
