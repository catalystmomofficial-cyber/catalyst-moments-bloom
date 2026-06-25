import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Camera, Heart, Share, Plus, Calendar, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface JournalEntry {
  id: string;
  entry_date: string;
  week: number | null;
  title: string;
  content: string | null;
  photo_urls: string[];
  mood: number | null;
  milestone: string | null;
  weight: number | null;
  baby_kicks: number | null;
}

export const PregnancyJournal = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 8,
    milestone: '',
    weight: '',
    babyKicks: '',
    week: ''
  });
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('pregnancy_journal_entries')
      .select('*')
      .order('entry_date', { ascending: false });

    if (error) {
      console.error('Error loading journal entries:', error);
      setLoading(false);
      return;
    }

    setEntries(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const signAll = async () => {
      const urlMap: Record<string, string[]> = {};
      for (const entry of entries) {
        if (!entry.photo_urls?.length) continue;
        const signed = await Promise.all(
          entry.photo_urls.map(async (path) => {
            const { data } = await supabase.storage.from('journal-photos').createSignedUrl(path, 3600);
            return data?.signedUrl ?? null;
          })
        );
        urlMap[entry.id] = signed.filter((url): url is string => Boolean(url));
      }
      setPhotoUrls(urlMap);
    };

    if (entries.length) signAll();
  }, [entries]);

  const handleAddEntry = async () => {
    if (!user) return;
    setSaving(true);

    const uploadedPaths: string[] = [];
    for (const file of newPhotos) {
      const fileExt = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('journal-photos').upload(path, file);
      if (uploadError) {
        console.error('Photo upload error:', uploadError);
        toast({ title: 'Some photos failed to upload', variant: 'destructive' });
        continue;
      }
      uploadedPaths.push(path);
    }

    const { error } = await supabase.from('pregnancy_journal_entries').insert({
      user_id: user.id,
      title: newEntry.title || 'Journal Entry',
      content: newEntry.content || null,
      photo_urls: uploadedPaths,
      mood: newEntry.mood,
      milestone: newEntry.milestone || null,
      weight: newEntry.weight ? parseFloat(newEntry.weight) : null,
      baby_kicks: newEntry.babyKicks ? parseInt(newEntry.babyKicks) : null,
      week: newEntry.week ? parseInt(newEntry.week) : null
    });

    setSaving(false);

    if (error) {
      console.error('Error saving journal entry:', error);
      toast({ title: 'Failed to save entry', variant: 'destructive' });
      return;
    }

    setNewEntry({ title: '', content: '', mood: 8, milestone: '', weight: '', babyKicks: '', week: '' });
    setNewPhotos([]);
    setIsNewEntryOpen(false);
    await loadEntries();

    toast({
      title: 'Journal entry saved',
      description: 'Your pregnancy memory has been captured!'
    });
  };

  const getMoodEmoji = (mood: number | null) => {
    if (!mood) return '😐';
    if (mood >= 9) return '😊';
    if (mood >= 7) return '🙂';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '😔';
    return '😢';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Pregnancy Journal
          </div>
          <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="What's happening today?"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Photos</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewPhotos(Array.from(e.target.files ?? []))}
                  />
                  {newPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newPhotos.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setNewPhotos(prev => prev.filter((_, i) => i !== idx))}
                            aria-label="Remove photo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your thoughts</label>
                  <Textarea
                    placeholder="Write about your day, feelings, or any thoughts..."
                    rows={4}
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Week</label>
                    <Input
                      type="number"
                      min="1"
                      max="42"
                      placeholder="e.g. 21"
                      value={newEntry.week}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, week: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weight (lbs)</label>
                    <Input
                      type="number"
                      placeholder="145"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Baby Kicks</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={newEntry.babyKicks}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, babyKicks: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Milestone</label>
                  <Input
                    placeholder="First kicks, scan day..."
                    value={newEntry.milestone}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, milestone: e.target.value }))}
                  />
                </div>

                <Button onClick={handleAddEntry} className="w-full" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Capture your pregnancy journey and create lasting memories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">Loading your journal...</p>
          )}

          {!loading && entries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No entries yet — capture your first pregnancy memory above.
            </p>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="border rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
              {photoUrls[entry.id]?.length > 0 && (
                <img
                  src={photoUrls[entry.id][0]}
                  alt={`Photo for journal entry: ${entry.title}`}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{entry.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(entry.entry_date).toLocaleDateString()}</span>
                      {entry.week && <Badge variant="outline" className="text-xs">Week {entry.week}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Share entry"
                      onClick={() => {
                        const text = `${entry.title}${entry.week ? ` (Week ${entry.week})` : ''}: ${entry.content || ''}`;
                        if (navigator.share) {
                          navigator.share({ title: entry.title, text }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(text);
                          toast({ title: 'Copied to clipboard' });
                        }
                      }}
                    >
                      <Share className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {entry.milestone && (
                  <div className="mb-3">
                    <Badge className="bg-pink-100 text-pink-800 text-xs">
                      🎉 {entry.milestone}
                    </Badge>
                  </div>
                )}

                {entry.content && (
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {entry.content}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {entry.weight && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Weight:</span> {entry.weight}lbs
                    </span>
                  )}
                  {entry.baby_kicks != null && (
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span className="font-medium">{entry.baby_kicks} kicks</span>
                    </span>
                  )}
                  {entry.mood && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Mood:</span> {entry.mood}/10
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <Camera className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Add photos when creating a new entry above
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
