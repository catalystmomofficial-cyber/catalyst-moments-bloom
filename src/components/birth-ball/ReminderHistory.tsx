import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ReminderHistory() {
  const { data: reminderLogs, isLoading } = useQuery({
    queryKey: ["reminder-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminder_logs")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Reminder History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Loading reminder history...</p>
        </CardContent>
      </Card>
    );
  }

  if (!reminderLogs || reminderLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Reminder History
          </CardTitle>
          <CardDescription>
            Recent notification activity and delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No reminder history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your sent reminders will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Reminder History
        </CardTitle>
        <CardDescription>
          Recent notification activity and delivery status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {reminderLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card"
          >
            <div className="mt-1">
              {log.status === "sent" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : log.status === "failed" ? (
                <XCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium">{log.title}</p>
                  {log.message && (
                    <p className="text-sm text-muted-foreground mt-1">{log.message}</p>
                  )}
                </div>
                <Badge
                  variant={log.status === "sent" ? "default" : "destructive"}
                  className="shrink-0"
                >
                  {log.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>{format(new Date(log.sent_at), "PPp")}</span>
                <Badge variant="outline" className="text-xs">
                  {log.reminder_type === "custom" ? "Custom" : "Daily Practice"}
                </Badge>
              </div>
            </div>
          </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}