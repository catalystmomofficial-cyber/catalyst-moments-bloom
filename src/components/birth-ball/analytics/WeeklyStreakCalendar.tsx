import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { Flame } from 'lucide-react';

interface WeeklyStreakCalendarProps {
  practiceDays: Date[];
  currentStreak: number;
  longestStreak: number;
}

export const WeeklyStreakCalendar = ({ practiceDays, currentStreak, longestStreak }: WeeklyStreakCalendarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isPracticeDay = (day: Date) => {
    return practiceDays.some(practiceDay => isSameDay(practiceDay, day));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Practice Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex gap-4 justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <div className="text-sm font-semibold mb-2 text-center">
              {format(today, 'MMMM yyyy')}
            </div>
            <div className="rounded-[24px] border border-border p-2">
              <div
                className="rounded-2xl border-2 border-border/10 p-3"
                style={{ boxShadow: "0px 2px 1.5px 0px hsl(var(--border) / 0.4) inset" }}
              >
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => (
                    <div key={day} className="text-[0.7rem] uppercase tracking-wide text-center font-medium text-muted-foreground p-1">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                  {daysInCalendar.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === today.getMonth();
                    const isPracticed = isPracticeDay(day);
                    const isToday = isSameDay(day, today);

                    return (
                      <div
                        key={index}
                        className={`
                          aspect-square flex items-center justify-center text-xs rounded-xl
                          ${!isCurrentMonth && 'text-muted-foreground/30'}
                          ${isPracticed && 'bg-primary text-primary-foreground font-semibold'}
                          ${!isPracticed && isCurrentMonth && 'bg-muted/50'}
                          ${isToday && !isPracticed && 'ring-2 ring-primary'}
                        `}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};