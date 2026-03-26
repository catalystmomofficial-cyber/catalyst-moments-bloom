import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Heart, Activity, Users, Baby, Trophy, Info, Settings } from 'lucide-react';
import { useNotifications, type DbNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationPreferencesPanel } from './NotificationPreferencesPanel';

const typeIconMap: Record<string, React.ReactNode> = {
  reminder: <Heart className="h-4 w-4" />,
  achievement: <Trophy className="h-4 w-4" />,
  community: <Users className="h-4 w-4" />,
  wellness: <Activity className="h-4 w-4" />,
  milestone: <Baby className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

const typeColorMap: Record<string, string> = {
  achievement: 'bg-accent/20 text-accent-foreground',
  community: 'bg-primary/10 text-primary',
  wellness: 'bg-primary/20 text-primary',
  milestone: 'bg-secondary/30 text-secondary-foreground',
  reminder: 'bg-muted text-muted-foreground',
  info: 'bg-muted text-muted-foreground',
};

function formatTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export const NotificationSystem = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleAction = (notification: DbNotification) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
      setIsVisible(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(!isVisible)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isVisible && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[28rem] bg-background border rounded-lg shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPrefs(!showPrefs)}>
                <Settings className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsVisible(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Preferences Panel */}
          {showPrefs && (
            <div className="border-b">
              <NotificationPreferencesPanel />
            </div>
          )}

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleAction(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full shrink-0 ${typeColorMap[notification.type] || typeColorMap.info}`}>
                      {typeIconMap[notification.type] || typeIconMap.info}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-xs leading-tight line-clamp-1">
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[10px] h-5 px-1 mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="p-2 border-t bg-muted/30 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
