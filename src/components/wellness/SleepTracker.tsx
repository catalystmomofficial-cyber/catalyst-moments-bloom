import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { MoonStar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWellnessData } from '@/hooks/useWellnessData';
import { usePoints } from '@/hooks/usePoints';

interface SleepTrackerProps {
  trigger?: React.ReactNode;
}

export const SleepTracker = ({ trigger }: SleepTrackerProps) => {
  const [open, setOpen] = useState(false);
  const [sleepHours, setSleepHours] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { addSleepEntry } = useWellnessData();
  const { awardPoints } = usePoints();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addSleepEntry({ sleep_hours: sleepHours[0], notes: notes.trim() || undefined });
      await awardPoints(5, 'sleep_log', 'Sleep logged');
      toast({
        title: "Sleep logged! +5 points ✨",
        description: `Recorded ${sleepHours[0]} hours of sleep.`,
      });
      setOpen(false);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error logging sleep",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <MoonStar className="mr-2 h-4 w-4" />
            Log Last Night's Sleep
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MoonStar className="h-5 w-5 text-blue-500" />
            Sleep Tracker
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Hours of Sleep: {sleepHours[0]} hours
            </Label>
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              max={12}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MoonStar className="h-4 w-4 text-blue-500" />
              Sleep Quality: {sleepQuality[0]}/10
            </Label>
            <Slider
              value={sleepQuality}
              onValueChange={setSleepQuality}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sleep Notes (Optional)</Label>
            <Textarea
              placeholder="How did you sleep? Any disturbances or observations?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Log Sleep"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
