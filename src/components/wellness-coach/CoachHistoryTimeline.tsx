import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, ArrowRight, Trash2, Clock } from 'lucide-react';
import { useCoachHistory } from '@/hooks/useCoachHistory';
import { formatDistanceToNow } from 'date-fns';

const urgencyTone: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  high: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
};

export const CoachHistoryTimeline = () => {
  const { history, isLoading, deleteMessage } = useCoachHistory(30);
  const navigate = useNavigate();

  return (
    <Card className="border-catalyst-copper/15">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-catalyst-copper" />
          Coach Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-5 pb-5 text-sm text-muted-foreground">Loading…</div>
        ) : history.length === 0 ? (
          <div className="px-5 pb-5 text-sm text-muted-foreground">
            Your past coach messages will show up here.
          </div>
        ) : (
          <ScrollArea className="h-[420px]">
            <ol className="relative px-5 pb-5">
              <span className="absolute left-7 top-0 bottom-0 w-px bg-catalyst-copper/15" />
              {history.map((m) => (
                <li key={m.id} className="relative pl-8 py-3">
                  <span className="absolute left-[22px] top-5 h-2.5 w-2.5 rounded-full bg-catalyst-copper ring-4 ring-background" />
                  <div className="rounded-lg border border-border/60 bg-card/40 p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className={urgencyTone[m.urgency_level]}>
                          {m.urgency_level}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {m.time_of_day}
                        </Badge>
                        {m.priority_gap && (
                          <Badge variant="outline" className="capitalize">
                            {m.priority_gap}
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete message"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed flex gap-2">
                      <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-catalyst-copper" />
                      <span>{m.coach_message}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => navigate(m.action_to)}
                      >
                        {m.action_label}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachHistoryTimeline;
