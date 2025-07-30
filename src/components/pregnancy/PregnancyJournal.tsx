import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Camera, Heart, Share, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  date: string;
  week: number;
  title: string;
  content: string;
  photos: string[];
  mood: number;
  milestone?: string;
  weight?: number;
  babyKicks?: number;
}

export const PregnancyJournal = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      week: 20,
      title: 'Anatomy Scan Day!',
      content: 'Had our big ultrasound today. Everything looks perfect and healthy! We found out we\'re having a girl. I cried happy tears. Dave was speechless. This little one is so loved already.',
      photos: [],
      mood: 10,
      milestone: 'Anatomy scan - healthy baby girl!',
      weight: 142,
      babyKicks: 5
    },
    {
      id: '2',
      date: '2024-01-10',
      week: 19,
      title: 'First Real Kicks',
      content: 'I felt real, unmistakable kicks today! Not just flutters anymore. It happened while I was sitting quietly after lunch. Made me so emotional - this little person is really in there!',
      photos: [],
      mood: 9,
      milestone: 'First real kicks felt',
      weight: 141,
      babyKicks: 3
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 8,
    milestone: '',
    weight: '',
    babyKicks: ''
  });

  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  const handleAddEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      week: 21, // Current week
      title: newEntry.title || 'Journal Entry',
      content: newEntry.content,
      photos: [],
      mood: newEntry.mood,
      milestone: newEntry.milestone || undefined,
      weight: newEntry.weight ? parseFloat(newEntry.weight) : undefined,
      babyKicks: newEntry.babyKicks ? parseInt(newEntry.babyKicks) : undefined
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', mood: 8, milestone: '', weight: '', babyKicks: '' });
    setIsNewEntryOpen(false);

    toast({
      title: "Journal entry saved",
      description: "Your pregnancy memory has been captured!",
    });
  };

  const getMoodEmoji = (mood: number) => {
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
                    <label className="text-sm font-medium mb-2 block">Mood (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weight (lbs)</label>
                    <Input
                      type="number"
                      placeholder="145"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Milestone</label>
                    <Input
                      placeholder="First kicks, scan day..."
                      value={newEntry.milestone}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, milestone: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleAddEntry} className="w-full">
                  Save Entry
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
          {entries.map((entry) => (
            <div key={entry.id} className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <Badge variant="outline" className="text-xs">Week {entry.week}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {entry.content}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {entry.weight && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Weight:</span> {entry.weight}lbs
                  </span>
                )}
                {entry.babyKicks && (
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span className="font-medium">{entry.babyKicks} kicks</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="font-medium">Mood:</span> {entry.mood}/10
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Add Photos
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Capture bump photos and special moments
          </p>
        </div>
      </CardContent>
    </Card>
  );
};