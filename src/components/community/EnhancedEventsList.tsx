import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import EventRegistrationModal from './EventRegistrationModal';


// Import member avatars
import mom1 from '@/assets/member-avatars/mom-1.jpg';
import mom2 from '@/assets/member-avatars/mom-2.jpg';
import mom3 from '@/assets/member-avatars/mom-3.jpg';
import mom4 from '@/assets/member-avatars/mom-4.jpg';
import mom5 from '@/assets/member-avatars/mom-5.jpg';
import mom6 from '@/assets/member-avatars/mom-6.jpg';

const memberAvatars = [mom1, mom2, mom3, mom4, mom5, mom6];

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  attendees: number;
  type: 'workshop' | 'qa' | 'meditation' | 'fitness';
  instructor?: string;
  maxAttendees?: number;
  location: 'virtual' | 'hybrid';
  featured?: boolean;
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Virtual Meditation Session',
    date: 'Tomorrow',
    time: '8:00 PM',
    description: 'Join us for a peaceful 30-minute guided meditation session designed specifically for busy moms. Learn breathing techniques to manage stress and find your center.',
    attendees: 18,
    type: 'meditation',
    instructor: 'Dr. Sarah Chen',
    maxAttendees: 50,
    location: 'virtual',
    featured: true,
  },
  {
    id: '2',
    title: 'Q&A with Sleep Specialist',
    date: 'Friday',
    time: '1:00 PM',
    description: 'Get expert answers to your sleep questions! Dr. Maria Rodriguez will address common sleep challenges for both moms and babies.',
    attendees: 34,
    type: 'qa',
    instructor: 'Dr. Maria Rodriguez',
    maxAttendees: 100,
    location: 'virtual',
  },
  {
    id: '3',
    title: 'Postpartum Fitness Workshop',
    date: 'Saturday',
    time: '10:00 AM',
    description: 'Safe and effective exercises for new moms. Learn proper form and modifications for your postpartum fitness journey.',
    attendees: 22,
    type: 'fitness',
    instructor: 'Coach Jennifer Liu',
    maxAttendees: 30,
    location: 'hybrid',
  },
  {
    id: '4',
    title: 'TTC Nutrition Workshop',
    date: 'Sunday',
    time: '2:00 PM',
    description: 'Discover fertility-boosting nutrition strategies and meal planning tips to support your TTC journey.',
    attendees: 15,
    type: 'workshop',
    instructor: 'Nutritionist Amy Parker',
    maxAttendees: 40,
    location: 'virtual',
  },
];

const EnhancedEventsList = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-500';
      case 'qa': return 'bg-green-500';
      case 'meditation': return 'bg-purple-500';
      case 'fitness': return 'bg-orange-500';
      default: return 'bg-primary';
    }
  };

  const getRandomAttendeeAvatars = (count: number) => {
    const shuffled = [...memberAvatars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, 6));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Upcoming Events</h3>
          <Button variant="outline" size="sm">
            View Calendar
          </Button>
        </div>

        <div className="grid gap-4">
          {upcomingEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md hover-scale ${
                event.featured ? 'ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-accent/5' : ''
              }`}
              onClick={() => handleEventClick(event)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
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

                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}>
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={selectedEvent}
      />
    </>
  );
};

export default EnhancedEventsList;