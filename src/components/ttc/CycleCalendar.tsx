import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CycleDay {
  date: number;
  phase: 'menstrual' | 'follicular' | 'fertile' | 'luteal';
  fertility: 'low' | 'medium' | 'high';
  symptoms?: string[];
  temperature?: number;
  notes?: string;
}

export const CycleCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CycleDay | null>(null);
  
  // Mock cycle data for 28-day cycle
  const generateCycleData = (): CycleDay[] => {
    const days: CycleDay[] = [];
    for (let i = 1; i <= 28; i++) {
      let phase: CycleDay['phase'];
      let fertility: CycleDay['fertility'];
      
      if (i <= 5) {
        phase = 'menstrual';
        fertility = 'low';
      } else if (i <= 13) {
        phase = 'follicular';
        fertility = i >= 10 ? 'medium' : 'low';
      } else if (i <= 17) {
        phase = 'fertile';
        fertility = 'high';
      } else {
        phase = 'luteal';
        fertility = 'low';
      }
      
      days.push({
        date: i,
        phase,
        fertility,
        temperature: 97.2 + Math.random() * 1.5,
        symptoms: phase === 'menstrual' ? ['cramping', 'fatigue'] : 
                 phase === 'fertile' ? ['clear CM', 'mild pain'] : [],
        notes: i === 14 ? 'Ovulation day - peak fertility!' : ''
      });
    }
    return days;
  };

  const cycleData = generateCycleData();

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-500';
      case 'follicular': return 'bg-blue-500';
      case 'fertile': return 'bg-green-500';
      case 'luteal': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getFertilityIcon = (fertility: string) => {
    switch (fertility) {
      case 'high': return '🥚';
      case 'medium': return '🌙';
      case 'low': return '💧';
      default: return '';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Calendar className="w-4 h-4 mr-2" />
          View Full Cycle Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Cycle Calendar - {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm">Menstrual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Follicular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Fertile Window</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Luteal</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {cycleData.map((day) => (
              <Card 
                key={day.date} 
                className={`cursor-pointer hover:shadow-md transition-all duration-200 min-h-[80px] ${
                  selectedDay?.date === day.date ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <CardContent className="p-2 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`w-6 h-6 rounded-full ${getPhaseColor(day.phase)} text-white text-xs flex items-center justify-center`}>
                      {day.date}
                    </div>
                    <div className="text-lg">{getFertilityIcon(day.fertility)}</div>
                    <Badge variant="outline" className="text-xs">
                      {day.fertility}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Day Details */}
          {selectedDay && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Day {selectedDay.date} - {selectedDay.phase.charAt(0).toUpperCase() + selectedDay.phase.slice(1)} Phase</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Fertility Level</h4>
                    <Badge className={`${
                      selectedDay.fertility === 'high' ? 'bg-green-500' :
                      selectedDay.fertility === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                    } text-white`}>
                      {selectedDay.fertility.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {selectedDay.temperature && (
                    <div>
                      <h4 className="font-medium mb-2">Basal Temperature</h4>
                      <p className="text-lg">{selectedDay.temperature.toFixed(1)}°F</p>
                    </div>
                  )}
                  
                  {selectedDay.symptoms && selectedDay.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedDay.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="secondary">{symptom}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedDay.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {selectedDay.notes}
                    </p>
                  </div>
                )}
                
                {/* Actionable Insights */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Today's Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    {selectedDay.phase === 'fertile' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <span>🍯</span>
                          <span>Try fertility smoothie: spinach, berries, Greek yogurt</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🧘‍♀️</span>
                          <span>10-minute fertility yoga session</span>
                        </div>
                      </>
                    )}
                    {selectedDay.phase === 'luteal' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <span>🚶‍♀️</span>
                          <span>Gentle 15-minute walk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🛁</span>
                          <span>Relaxing evening bath with Epsom salts</span>
                        </div>
                      </>
                    )}
                    {selectedDay.phase === 'menstrual' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <span>🍵</span>
                          <span>Herbal tea: ginger or chamomile</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🌿</span>
                          <span>Light stretching or restorative yoga</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit Day</Button>
                  <Button size="sm" variant="outline">Add Symptoms</Button>
                  <Button size="sm" variant="outline">Log Temperature</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};