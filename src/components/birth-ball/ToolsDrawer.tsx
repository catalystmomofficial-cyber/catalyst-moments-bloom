import { useState } from 'react';
import { Settings, Bell, Trophy, Calendar, History, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationSettings } from './NotificationSettings';
import { CustomReminders } from './CustomReminders';
import { ReminderHistory } from './ReminderHistory';
import { AchievementBadges } from './AchievementBadges';
import { PersonalizedSchedule } from './PersonalizedSchedule';
import { WeeklyGoals } from './WeeklyGoals';
import { useIsMobile } from '@/hooks/use-mobile';

export function ToolsDrawer() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open practice tools"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={isMobile ? "h-[85vh] rounded-t-xl" : "w-full sm:max-w-2xl overflow-y-auto"}
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Your Practice Tools</SheetTitle>
          <SheetDescription>
            Manage your schedule, reminders, and achievements
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              {!isMobile && <span>Schedule</span>}
            </TabsTrigger>
            <TabsTrigger value="reminders" className="gap-2">
              <Bell className="h-4 w-4" />
              {!isMobile && <span>Reminders</span>}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              {!isMobile && <span>Progress</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 mt-0">
            <PersonalizedSchedule />
            <WeeklyGoals />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6 mt-0">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="settings" className="gap-2 text-xs sm:text-sm">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="custom" className="gap-2 text-xs sm:text-sm">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Custom
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 text-xs sm:text-sm">
                  <History className="h-3 w-3 sm:h-4 sm:w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="mt-0">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="custom" className="mt-0">
                <CustomReminders />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <ReminderHistory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <AchievementBadges />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
