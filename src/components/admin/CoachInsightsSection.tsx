import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, MessageSquare, AlertCircle, RefreshCw, Download } from 'lucide-react';

interface GapRow {
  id: string;
  stage: string | null;
  intent: string | null;
  gap_category: string | null;
  message: string;
  created_at: string;
}

interface TopicCount {
  topic: string;
  count: number;
  stage: string | null;
  gap_category: string | null;
}

const GAP_LABELS: Record<string, string> = {
  product: 'Product / Guide',
  course: 'Course / Program',
  content: 'Content / Blog',
  feature: 'App Feature',
  community: 'Community',
  unknown: 'Uncategorised',
};

const STAGE_COLORS: Record<string, string> = {
  pregnant: 'bg-sky-100 text-sky-700 border-sky-200',
  postpartum: 'bg-rose-100 text-rose-700 border-rose-200',
  ttc: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const GAP_COLORS: Record<string, string> = {
  product: 'bg-orange-100 text-orange-700 border-orange-200',
  course: 'bg-purple-100 text-purple-700 border-purple-200',
  content: 'bg-blue-100 text-blue-700 border-blue-200',
  feature: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  community: 'bg-pink-100 text-pink-700 border-pink-200',
  unknown: 'bg-muted text-muted-foreground border-border',
};

export const CoachInsightsSection = () => {
  const [rows, setRows] = useState<GapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [view, setView] = useState<'topics' | 'raw'>('topics');

  const load = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from('coach_query_gaps')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (stageFilter !== 'all') q = q.eq('stage', stageFilter);
    if (categoryFilter !== 'all') q = q.eq('gap_category', categoryFilter);
    const { data } = await q;
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [stageFilter, categoryFilter]);

  // Aggregate into topic counts from raw messages
  const topics: TopicCount[] = (() => {
    const map = new Map<string, TopicCount>();
    for (const r of rows) {
      const key = r.message.trim().toLowerCase().slice(0, 120);
      if (map.has(key)) {
        map.get(key)!.count += 1;
      } else {
        map.set(key, { topic: r.message.trim(), count: 1, stage: r.stage, gap_category: r.gap_category });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();

  const categoryCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const k = r.gap_category ?? 'unknown';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const stageCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const k = r.stage ?? 'unknown';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const exportCsv = () => {
    const header = 'id,stage,intent,gap_category,message,created_at\n';
    const body = rows
      .map(r =>
        [r.id, r.stage ?? '', r.intent ?? '', r.gap_category ?? '', `"${r.message.replace(/"/g, '""')}"`, r.created_at].join(','),
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coach-gaps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-catalyst-copper" />
          <div>
            <h2 className="text-xl font-semibold">Coach Insights — Content Gaps</h2>
            <p className="text-sm text-muted-foreground">
              Questions members asked that the coach couldn't fully answer. Use this to find what to build next.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={rows.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total gaps logged</p>
            <p className="text-3xl font-bold text-catalyst-copper">{rows.length}</p>
          </CardContent>
        </Card>
        {Object.entries(categoryCounts).sort((a,b) => b[1]-a[1]).slice(0,3).map(([cat, count]) => (
          <Card key={cat}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{GAP_LABELS[cat] ?? cat}</p>
              <p className="text-3xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stage breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> By Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <Badge key={stage} variant="outline" className={STAGE_COLORS[stage] ?? 'bg-muted text-muted-foreground'}>
                {stage} · {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters + toggle */}
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            <SelectItem value="pregnant">Pregnancy</SelectItem>
            <SelectItem value="postpartum">Postpartum</SelectItem>
            <SelectItem value="ttc">TTC</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(GAP_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex rounded-md border overflow-hidden text-sm">
          <button
            className={`px-3 py-1.5 ${view === 'topics' ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}
            onClick={() => setView('topics')}
          >
            Topics
          </button>
          <button
            className={`px-3 py-1.5 ${view === 'raw' ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}
            onClick={() => setView('raw')}
          >
            Raw messages
          </button>
        </div>
      </div>

      {/* Topic list */}
      {view === 'topics' ? (
        <div className="space-y-2">
          {topics.length === 0 && !loading && (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <AlertCircle className="h-4 w-4" />
              No gaps logged yet — they appear when members ask something the coach can't fully answer.
            </div>
          )}
          {topics.map((t, i) => (
            <Card key={i} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-3 px-4 flex items-start gap-3">
                <span className="text-2xl font-bold text-muted-foreground/40 w-8 shrink-0 text-right">{t.count}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{t.topic}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {t.stage && (
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${STAGE_COLORS[t.stage] ?? ''}`}>
                        {t.stage}
                      </Badge>
                    )}
                    {t.gap_category && (
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${GAP_COLORS[t.gap_category] ?? ''}`}>
                        {GAP_LABELS[t.gap_category] ?? t.gap_category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {rows.length === 0 && !loading && (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <MessageSquare className="h-4 w-4" />
              No records found.
            </div>
          )}
          {rows.slice(0, 100).map(r => (
            <Card key={r.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-2.5 px-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{r.message}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    {r.stage && (
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${STAGE_COLORS[r.stage] ?? ''}`}>
                        {r.stage}
                      </Badge>
                    )}
                    {r.intent && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {r.intent}
                      </Badge>
                    )}
                    {r.gap_category && (
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${GAP_COLORS[r.gap_category] ?? ''}`}>
                        {GAP_LABELS[r.gap_category] ?? r.gap_category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
