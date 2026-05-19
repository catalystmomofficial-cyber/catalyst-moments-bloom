import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Clock, Sparkles, ChevronRight, Heart } from 'lucide-react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const CoreRestoreFoundationsCard = () => {
  const { openVideo } = useVideoPlayer();

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-[#FDF6EE] to-[#F5EBD9] border-[#B5651D]/30 hover:shadow-xl transition-all duration-300 group">
      {/* Header band */}
      <div className="relative h-44 bg-gradient-to-br from-[#B5651D]/90 to-[#8B4513]/90 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-2 opacity-90">
            <Sparkles className="h-3.5 w-3.5" />
            Featured Program
          </div>
          <h3 className="text-2xl font-serif leading-tight">
            Core Restore Foundations
          </h3>
          <p className="text-sm mt-1 text-white/90 italic">
            Safely close abdominal separation &amp; heal your floor.
          </p>
        </div>

        <div className="absolute top-3 right-3">
          <Badge className="bg-white/95 text-[#B5651D] font-semibold border-0">
            <ShieldCheck className="h-3 w-3 mr-1" />
            DR-Safe
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 text-[#2C2218]">
        <p className="text-sm leading-relaxed mb-5">
          A structured <span className="font-semibold">4-week clinical-grade protocol</span> to
          safely close Diastasis Recti and restore deep core stability. Zero
          traditional crunches or planks—just gentle, targeted activation
          movements designed to rebuild your internal corset from the inside out.
        </p>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg border border-[#B5651D]/20 bg-white/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#B5651D] font-semibold">Focus</div>
            <div className="text-sm font-medium mt-0.5">DR Repair &amp; Postpartum</div>
          </div>
          <div className="rounded-lg border border-[#B5651D]/20 bg-white/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#B5651D] font-semibold">Level</div>
            <div className="text-sm font-medium mt-0.5">Gentle / Rehab</div>
          </div>
          <div className="rounded-lg border border-[#B5651D]/20 bg-white/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#B5651D] font-semibold">Timeline</div>
            <div className="text-sm font-medium mt-0.5">4 Weeks</div>
          </div>
          <div className="rounded-lg border border-[#B5651D]/20 bg-white/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#B5651D] font-semibold">Commitment</div>
            <div className="text-sm font-medium mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 10–15 min/day
            </div>
          </div>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="outline" className="border-[#B5651D]/30 text-[#2C2218] bg-white/50">
            No crunches
          </Badge>
          <Badge variant="outline" className="border-[#B5651D]/30 text-[#2C2218] bg-white/50">
            No planks
          </Badge>
          <Badge variant="outline" className="border-[#B5651D]/30 text-[#2C2218] bg-white/50">
            Pelvic-floor safe
          </Badge>
          <Badge variant="outline" className="border-[#B5651D]/30 text-[#2C2218] bg-white/50">
            <Heart className="h-3 w-3 mr-1 text-[#B5651D]" /> Mama-approved
          </Badge>
        </div>

        <Button
          className="w-full bg-[#B5651D] hover:bg-[#8B4513] text-white font-semibold"
          onClick={() => openVideo('https://www.youtube.com/embed/ScNNfyq3d_w', 'Core Restore Foundations — Week 1')}
        >
          Begin Your Foundation
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-[11px] text-center text-[#2C2218]/60 mt-2">
          Rehabilitative progression · not a challenge
        </p>
      </div>
    </Card>
  );
};

export default CoreRestoreFoundationsCard;
