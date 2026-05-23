import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, ChevronRight, Sparkles } from 'lucide-react';
import { UserPointsManager } from './UserPointsManager';

export const PointsManagerLauncher: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 font-semibold">
              User Points Management
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tap to view balances, gift or deduct points, and trigger a live celebration on her screen.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Points Management
            </DialogTitle>
          </DialogHeader>
          <UserPointsManager />
        </DialogContent>
      </Dialog>
    </>
  );
};
