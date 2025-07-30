import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Smile, Frown, Meh, Heart, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWellnessData } from '@/hooks/useWellnessData';

export const MoodCheckIn = () => {
  const [open, setOpen] = useState(false);
  const [moodScore, setMoodScore] = useState([7]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addMoodEntry } = useWellnessData();
  const { toast } = useToast();

  const getActionableAdvice = () => {
    const advice = [];
    
    if (stressLevel[0] >= 7) {
      advice.push({
        title: "High Stress Detected",
        action: "Try 5 minutes of deep breathing or a short walk",
        icon: "🧘‍♀️"
      });
    }
    
    if (energyLevel[0] <= 4) {
      advice.push({
        title: "Low Energy Alert",
        action: "Consider a healthy snack, hydration, or short nap",
        icon: "⚡"
      });
    }
    
    if (moodScore[0] <= 5) {
      advice.push({
        title: "Mood Support",
        action: "Connect with a friend or try a mood-boosting activity",
        icon: "💕"
      });
    }
    
    return advice;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addMoodEntry({
        mood_score: moodScore[0],
        energy_level: energyLevel[0],
        stress_level: stressLevel[0],
        notes: notes.trim() || undefined,
      });
      
      const advice = getActionableAdvice();
      
      toast({
        title: "Mood logged successfully!",
        description: advice.length > 0 
          ? `${advice[0].icon} ${advice[0].action}`
          : "Your wellness data has been updated.",
      });
      
      setOpen(false);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error logging mood",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (score: number) => {
    if (score >= 8) return <Smile className="h-5 w-5 text-green-500" />;
    if (score >= 5) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              Daily Mood Check-In
            </CardTitle>
            <CardDescription>
              How are you feeling today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Check In Now
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            How are you feeling?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              {getMoodIcon(moodScore[0])}
              Overall Mood: {moodScore[0]}/10
            </Label>
            <Slider
              value={moodScore}
              onValueChange={setMoodScore}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Energy Level: {energyLevel[0]}/10
            </Label>
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Stress Level: {stressLevel[0]}/10
            </Label>
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="How are you feeling today? Any specific thoughts or concerns?"
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
            {loading ? "Saving..." : "Save Check-In"}
          </Button>
          
          {/* Actionable Advice Preview */}
          {getActionableAdvice().length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Quick Suggestions</h4>
              <div className="space-y-2">
                {getActionableAdvice().map((item, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-medium text-blue-800">{item.title}</div>
                      <div className="text-blue-600">{item.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};