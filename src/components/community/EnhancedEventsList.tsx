import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Users, MapPin, Star, Zap } from 'lucide-react';
import EventRegistrationModal from './EventRegistrationModal';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents, isEventLive, formatEventDate, type SupabaseEvent } from '@/hooks/useEvents';
import { usePoints } from '@/hooks/usePoints';

// Import member avatars
import mom1 from '@/assets/member-avatars/mom-1.jpg';
import mom2 from '@/assets/member-avatars/mom-2.jpg';
import mom3 from '@/assets/member-avatars/mom-3.jpg';
import mom4 from '@/assets/member-avatars/mom-4.jpg';
import mom5 from '@/assets/member-avatars/mom-5.jpg';
import mom6 from '@/assets/member-avatars/mom-6.jpg';

const memberAvatars = [mom1, mom2, mom3, mom4, mom5, mom6];

// Extended Event shape used throughout this component and the modal
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  attendees: number;
  type: 'workshop' | 'qa' | 'meditation' | 'fitness' | 'masterclass';
  instructor?: string;
  maxAttendees?: number;
  location: 'virtual' | 'hybrid' | 'in-person';
  featured?: boolean;
  // Pricing & points (undefined for legacy hardcoded events)
  priceNonMember?: number;
  priceMember?: number;
  pointsCost?: number;
  isFreeForMembers?: boolean;
  // Live state
  isLive?: boolean;
  eventDate?: string | null;
  // Stage targeting — 'all' or a specific stage value
  stageFilter?: string;
}

// Fallback hardcoded events shown if the Supabase table isn't available yet
const FALLBACK_EVENTS: Event[] = [
  {
    id: 'f1',
    title: 'Pelvic Floor Truth — What Every Mom Must Know',
    date: 'Wednesday',
    time: '7:00 PM',
    description: "Whether you're TTC, pregnant, or postpartum — your pelvic floor affects everything. Women's health physio Dr. Amara Osei answers the questions your doctor never has time for.",
    attendees: 0,
    type: 'masterclass',
    instructor: 'Dr. Amara Osei',
    maxAttendees: 50,
    location: 'virtual',
    featured: true,
    priceNonMember: 2700,
    priceMember: 1400,
    pointsCost: 1400,
    isFreeForMembers: false,
    stageFilter: 'all',
  },
  {
    id: 'f2',
    title: 'Sleep Reset for Moms — Reclaim Your Rest',
    date: 'Thursday',
    time: '8:00 PM',
    description: "Sleep deprivation is not a badge of honour. Sleep specialist Dr. Nina Patel breaks down why moms can't sleep and gives you a real protocol to fix it — whatever stage you're in.",
    attendees: 0,
    type: 'qa',
    instructor: 'Dr. Nina Patel',
    maxAttendees: 100,
    location: 'virtual',
    featured: false,
    priceNonMember: 0,
    priceMember: 0,
    pointsCost: 0,
    isFreeForMembers: true,
    stageFilter: 'all',
  },
  {
    id: 'f3',
    title: 'Core Reconnection Workshop — Live with a Physio',
    date: 'Saturday',
    time: '10:00 AM',
    description: 'Diastasis recti, leaking, back pain — these are not permanent. Follow along live as women\'s health physio Coach Sarah walks you through the exact protocol to reconnect and heal your core.',
    attendees: 0,
    type: 'fitness',
    instructor: 'Coach Sarah Mitchell',
    maxAttendees: 30,
    location: 'virtual',
    featured: false,
    priceNonMember: 4700,
    priceMember: 2700,
    pointsCost: 2700,
    isFreeForMembers: false,
    stageFilter: 'postpartum',
  },
  {
    id: 'f4',
    title: 'Fertility & Your Cycle — Ask an OBGYN',
    date: 'Tuesday',
    time: '6:00 PM',
    description: 'Understanding your cycle is the most underrated fertility tool you have. OBGYN Dr. Fatima Hassan answers your specific questions about ovulation, timing, cycle health, and when to seek help.',
    attendees: 0,
    type: 'qa',
    instructor: 'Dr. Fatima Hassan',
    maxAttendees: 40,
    location: 'virtual',
    featured: false,
    priceNonMember: 3700,
    priceMember: 1900,
    pointsCost: 1900,
    isFreeForMembers: false,
    stageFilter: 'ttc',
  },
  {
    id: 'f5',
    title: 'Birth Ready Workshop — Movement, Breathing & Positioning',
    date: 'Sunday',
    time: '11:00 AM',
    description: 'Your body already knows how to birth. This hands-on workshop with certified midwife Kezia Addo teaches you the movement, breathing, and positioning techniques that actually prepare you for labour.',
    attendees: 0,
    type: 'workshop',
    instructor: 'Kezia Addo',
    maxAttendees: 35,
    location: 'virtual',
    featured: false,
    priceNonMember: 4700,
    priceMember: 2700,
    pointsCost: 2700,
    isFreeForMembers: false,
    stageFilter: 'pregnant',
  },
  {
    id: 'f6',
    title: "Stress, Cortisol & Why You're Not Recovering",
    date: 'Monday',
    time: '7:30 PM',
    description: 'High cortisol blocks fertility, disrupts pregnancy, and stalls postpartum healing. Functional medicine doctor Dr. Priya Sharma explains the hormonal connection and gives you a simple daily reset protocol.',
    attendees: 0,
    type: 'masterclass',
    instructor: 'Dr. Priya Sharma',
    maxAttendees: 50,
    location: 'virtual',
    featured: false,
    priceNonMember: 2700,
    priceMember: 1400,
    pointsCost: 1400,
    isFreeForMembers: false,
    stageFilter: 'all',
  },
  {
    id: 'f7',
    title: 'The Mental Load — Ask a Perinatal Therapist',
    date: 'Wednesday',
    time: '8:00 PM',
    description: 'Overwhelm, resentment, invisible labour, burnout — this is real and it has a name. Perinatal therapist Dr. Lena Brooks holds a safe, honest space for the emotional side of motherhood nobody talks about.',
    attendees: 0,
    type: 'qa',
    instructor: 'Dr. Lena Brooks',
    maxAttendees: 40,
    location: 'virtual',
    featured: false,
    priceNonMember: 3700,
    priceMember: 1900,
    pointsCost: 1900,
    isFreeForMembers: false,
    stageFilter: 'all',
  },
  {
    id: 'f8',
    title: 'Nutrition for Conception — What to Eat, What to Stop',
    date: 'Saturday',
    time: '12:00 PM',
    description: 'What you eat in the 90 days before conception matters more than most women know. Fertility nutritionist Amy Chen gives you the exact protocol — foods, supplements, what to cut — backed by current research.',
    attendees: 0,
    type: 'workshop',
    instructor: 'Amy Chen',
    maxAttendees: 40,
    location: 'virtual',
    featured: false,
    priceNonMember: 3700,
    priceMember: 1900,
    pointsCost: 1900,
    isFreeForMembers: false,
    stageFilter: 'ttc',
  },
];

function mapSupabaseEvent(e: SupabaseEvent): Event {
  const live = isEventLive(e.event_date);
  return {
    id: e.id,
    title: e.title,
    date: formatEventDate(e.event_date),
    time: e.time_display ?? '',
    description: e.description ?? '',
    attendees: e.current_attendees ?? 0,
    type: (e.category as Event['type']) ?? 'workshop',
    instructor: e.specialist_name ?? undefined,
    maxAttendees: e.max_capacity ?? undefined,
    location: (e.location_type as Event['location']) ?? 'virtual',
    featured: e.is_featured ?? false,
    priceNonMember: e.price_non_member ?? 0,
    priceMember: e.price_member ?? 0,
    pointsCost: e.points_cost ?? 0,
    isFreeForMembers: e.is_free_for_members ?? false,
    isLive: live,
    eventDate: e.event_date,
    stageFilter: e.stage_filter ?? 'all',
  };
}

/** Returns true if the event should be visible for the given profile stage.
 *  stage_filter values ('ttc', 'pregnant', 'postpartum', 'all') match
 *  profile.motherhood_stage exactly — no normalisation needed.
 */
function eventMatchesStage(event: Event, profileStage: string | null | undefined): boolean {
  const filter = event.stageFilter ?? 'all';
  if (filter === 'all') return true;
  if (!profileStage) return false;
  return filter === profileStage;
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'workshop': return 'bg-blue-500';
    case 'qa': return 'bg-green-500';
    case 'meditation': return 'bg-purple-500';
    case 'fitness': return 'bg-orange-500';
    default: return 'bg-primary';
  }
}

function getRandomAttendeeAvatars(count: number) {
  const shuffled = [...memberAvatars].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, 6));
}

function getButtonLabel(event: Event, subscribed: boolean): string {
  const full = event.maxAttendees != null && event.attendees >= event.maxAttendees;
  if (full) return 'Join Waitlist';
  if (event.isLive) return 'Join Now';
  if (event.isFreeForMembers && subscribed) return 'Register — Free';
  return 'Register';
}

interface EnhancedEventsListProps {
  onViewCalendar?: () => void;
}

const EnhancedEventsList = ({ onViewCalendar }: EnhancedEventsListProps) => {
  const { profile, subscribed, user } = useAuth();
  const { events: supabaseEvents, loading, error } = useEvents(profile?.motherhood_stage);
  const { getPoints } = usePoints();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [pointsBalance, setPointsBalance] = useState(0);

  // Fetch user's points balance for the header display
  useEffect(() => {
    if (user) {
      getPoints().then(({ total }) => setPointsBalance(total));
    }
  }, [user, getPoints]);

  // Use Supabase events when available; fall back to hardcoded list
  const rawEvents: Event[] =
    !loading && !error && supabaseEvents.length > 0
      ? supabaseEvents.map(mapSupabaseEvent)
      : !loading && error
        ? FALLBACK_EVENTS
        : loading
          ? []
          : FALLBACK_EVENTS;

  // Apply stage filter regardless of data source
  const displayEvents = rawEvents.filter(e => eventMatchesStage(e, profile?.motherhood_stage));

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            {user && pointsBalance > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                You have {pointsBalance.toLocaleString()} pts · ${(pointsBalance / 100).toFixed(2)} value
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onViewCalendar}>
            View Calendar
          </Button>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-40 bg-muted/40 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid gap-4">
          {displayEvents.map((event) => {
            const seatsLeft = event.maxAttendees != null
              ? event.maxAttendees - event.attendees
              : null;
            const showPricing = (event.priceNonMember ?? 0) > 0;
            const showPoints = (event.pointsCost ?? 0) > 0;
            const showLowSeats = seatsLeft != null && seatsLeft > 0 && seatsLeft < 5;

            return (
              <Card
                key={event.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover-scale ${
                  event.featured ? 'ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-accent/5' : ''
                }`}
                onClick={() => handleEventClick(event)}
              >
                {/* LIVE NOW banner — only rendered when event is live */}
                {event.isLive && (
                  <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-xs font-semibold px-4 py-1.5 rounded-t-lg">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
                    LIVE NOW
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)} ${event.isLive ? 'ring-2 ring-offset-1 ring-destructive' : ''}`} />
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.featured && (
                          <Badge variant="secondary" className="mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="capitalize">{event.location}</span>
                    </div>
                    {event.instructor && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{event.instructor}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing line — only shown if event has a price */}
                  {showPricing && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Members: ${((event.priceMember ?? 0) / 100).toFixed(2)} · Non-members: ${((event.priceNonMember ?? 0) / 100).toFixed(2)}
                    </p>
                  )}

                  {/* Points redemption line — only shown if event has points cost */}
                  {showPoints && (
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      Or redeem with {(event.pointsCost ?? 0).toLocaleString()} pts
                    </p>
                  )}

                  {/* Low seats warning — only shown when fewer than 5 spots remain */}
                  {showLowSeats && (
                    <p className="text-xs text-destructive mb-2 font-medium">
                      Only {seatsLeft} {seatsLeft === 1 ? 'spot' : 'spots'} left
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {getRandomAttendeeAvatars(4).map((avatar, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={avatar} alt={`Attendee ${index + 1}`} />
                            <AvatarFallback className="text-xs">M{index + 1}</AvatarFallback>
                          </Avatar>
                        ))}
                        {event.attendees > 4 && (
                          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs font-medium">+{event.attendees - 4}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        <Users className="w-3 h-3 inline mr-1" />
                        {event.attendees} attending
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={event.isLive ? 'default' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      {getButtonLabel(event, !!subscribed)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={selectedEvent}
        userPointsBalance={pointsBalance}
        onRegistrationComplete={() => {
          // Refresh points balance after registration
          if (user) getPoints().then(({ total }) => setPointsBalance(total));
        }}
      />
    </>
  );
};

export default EnhancedEventsList;
