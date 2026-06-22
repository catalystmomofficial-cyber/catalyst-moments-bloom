import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, X, Thermometer, Plus, Pencil } from 'lucide-react';
import { useTTCData, mapPhaseForDay, type MapPhase } from '@/hooks/useTTCData';
import { DayLogModal } from './DayLogModal';

const MAP_PHASE_COLOR: Record<MapPhase, string> = {
  menstrual: '#D9B08C',
  follicular: '#F4C5A0',
  ovulation: '#B5651D',
  luteal: '#FAE0CC',
};

const phaseTitle: Record<MapPhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Fertile Window',
  luteal: 'Luteal',
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (iso: string, n: number): string => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const shortDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

interface CalendarDay {
  cycleDay: number;
  dateISO: string;
  phase: MapPhase;
  isToday: boolean;
}

export const CycleCalendar = () => {
  const { settings, cycleDay, cycleLength, periodLength, logByDate, saveCycleLog, hasSettings } = useTTCData();
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [dayLogOpen, setDayLogOpen] = useState(false);

  const today = toISO(new Date());

  // Day 1 of the *current* cycle = today minus (cycleDay - 1) days.
  const cycleStartISO = cycleDay ? addDays(today, -(cycleDay - 1)) : null;

  const days = useMemo<CalendarDay[]>(() => {
    if (!cycleStartISO) return [];
    return Array.from({ length: cycleLength }, (_, i) => {
      const day = i + 1;
      const dateISO = addDays(cycleStartISO, i);
      return {
        cycleDay: day,
        dateISO,
        phase: mapPhaseForDay(day, cycleLength, periodLength),
        isToday: dateISO === today,
      };
    });
  }, [cycleStartISO, cycleLength, periodLength, today]);

  const selectedLog = selectedISO ? logByDate[selectedISO] ?? null : null;
  const selectedDay = selectedISO ? days.find((d) => d.dateISO === selectedISO) ?? null : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Calendar className="w-4 h-4 mr-2" />
          View Full Cycle Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cycle Calendar</DialogTitle>
        </DialogHeader>

        {/* Shared day-log modal for tapping a day */}
        {selectedISO && (
          <DayLogModal
            open={dayLogOpen}
            onOpenChange={setDayLogOpen}
            dateISO={selectedISO}
            existing={selectedLog}
            onSave={saveCycleLog}
          />
        )}

        {!hasSettings || !cycleStartISO ? (
          <div className="text-center py-10 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-foreground mb-1">Set up your cycle first</p>
            <p className="text-sm">Add your last period date in the tracker settings to see your full cycle map.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
              {(['menstrual', 'follicular', 'ovulation', 'luteal'] as MapPhase[]).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: MAP_PHASE_COLOR[p] }} />
                  <span className="text-sm">{phaseTitle[p]}</span>
                </div>
              ))}
            </div>

            {/* Cycle-day grid (each cell is a real date) */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const hasLog = !!logByDate[day.dateISO];
                return (
                  <button
                    key={day.dateISO}
                    type="button"
                    onClick={() => setSelectedISO(day.dateISO)}
                    className={`rounded-lg p-2 text-center transition-all hover:shadow-md ${
                      selectedISO === day.dateISO ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ boxShadow: day.isToday ? '0 0 0 2px #2C2218' : undefined }}
                  >
                    <div
                      className="w-7 h-7 mx-auto rounded-full text-white text-xs flex items-center justify-center"
                      style={{ background: MAP_PHASE_COLOR[day.phase] }}
                    >
                      {day.cycleDay}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">{shortDate(day.dateISO)}</div>
                    {hasLog && <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Day details */}
            {selectedDay && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>
                      Day {selectedDay.cycleDay} · {phaseTitle[selectedDay.phase]} · {shortDate(selectedDay.dateISO)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedISO(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1 text-sm">Basal Temperature</h4>
                      <p className="text-lg">
                        {selectedLog?.basal_body_temp != null ? `${selectedLog.basal_body_temp}°F` : '—'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-sm">Symptoms</h4>
                      {selectedLog?.symptoms && selectedLog.symptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedLog.symptoms.map((s, i) => (
                            <Badge key={i} variant="secondary">{s}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">None logged</p>
                      )}
                    </div>
                  </div>

                  {selectedLog?.notes && (
                    <div>
                      <h4 className="font-medium mb-1 text-sm">Notes</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{selectedLog.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => setDayLogOpen(true)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit Day
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDayLogOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Add Symptoms
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDayLogOpen(true)}>
                      <Thermometer className="w-4 h-4 mr-1" /> Log Temperature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
