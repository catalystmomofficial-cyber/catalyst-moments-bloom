import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import professionalCover from '@/assets/ultimate-birth-ball-guide-cover.jpg';

const BIRTHBALL_GUIDE_URL = "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Ultimate%20birth%20ball%20guide/The%20Ultimate%20Birth%20Ball%20Guide%20Safe%20&%20Effective%20Exercises%20for%20Every%20Trimester.pdf";

const BirthBallGuideCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        {/* Background Image */}
        <img
          src={professionalCover}
          alt="Ultimate Birth Ball Guide"
          className={`absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-purple-700 dark:text-purple-300 hover:bg-white">
            Pregnancy
          </Badge>
          <Badge variant="outline" className="border-white/80 text-white bg-black/20">
            Comfort &amp; Labor Prep
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            Ultimate Birth Ball Guide
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Comfort &amp; Labor Prep
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Gentle birth-ball moves that can ease pelvic and lower-back discomfort, help you get comfortable for sleep, and prepare your body for birth — with positions for every trimester.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Eases aches &amp; pressure
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Better sleep positioning
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Labor-prep moves
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            For every trimester
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button className="w-full" size="lg" asChild>
            <Link to="/programs/birth-ball">
              <BookOpen className="mr-2 h-4 w-4" />
              Start Birth Ball Program
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={BIRTHBALL_GUIDE_URL} target="_blank" rel="noopener noreferrer">
              View PDF Guide
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BirthBallGuideCard;
