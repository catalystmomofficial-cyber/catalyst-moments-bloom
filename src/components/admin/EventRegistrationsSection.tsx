import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Mail, Phone, Search, Trash2, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EventRegistration {
  id: string;
  user_id: string | null;
  event_id: string;
  event_title: string;
  event_date: string | null;
  event_time: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  questions: string | null;
  experience: string | null;
  notification_pref: string | null;
  created_at: string;
}

export const EventRegistrationsSection = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setRegistrations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this registration?')) return;
    const { error } = await supabase.from('event_registrations').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Registration removed.' });
      setRegistrations((r) => r.filter((x) => x.id !== id));
    }
  };

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.event_title.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      `${r.first_name} ${r.last_name}`.toLowerCase().includes(q)
    );
  });

  // Group by event
  const grouped = filtered.reduce<Record<string, EventRegistration[]>>((acc, r) => {
    (acc[r.event_title] ||= []).push(r);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Event Registrations
            <Badge variant="secondary">{registrations.length}</Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, event..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading registrations…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No event registrations yet.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([eventTitle, regs]) => (
              <div key={eventTitle} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">{eventTitle}</span>
                  </div>
                  <Badge variant="outline">{regs.length} registered</Badge>
                </div>
                <div className="divide-y">
                  {regs.map((r) => (
                    <div key={r.id} className="px-4 py-3 flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {r.first_name} {r.last_name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {r.email}
                          </span>
                          {r.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {r.phone}
                            </span>
                          )}
                          {r.event_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {r.event_date} {r.event_time}
                            </span>
                          )}
                        </div>
                        {r.questions && (
                          <p className="text-xs italic text-muted-foreground mt-1">
                            Q: {r.questions}
                          </p>
                        )}
                        {r.experience && (
                          <Badge variant="outline" className="text-xs capitalize mt-1">
                            {r.experience}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(r.id)}
                          aria-label="Delete registration"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
