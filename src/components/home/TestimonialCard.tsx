
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image: string;
  featured?: boolean;
}

const TestimonialCard = ({ 
  quote, 
  name, 
  role, 
  image,
  featured = false 
}: TestimonialCardProps) => {
  return (
    <Card 
      className={cn(
        "border-0 shadow-soft overflow-hidden card-hover rounded-2xl", 
        featured ? "bg-accent/20" : "bg-card"
      )}
    >
      <CardContent className="p-7">
        <div className="mb-5 flex">
          {"★".repeat(5).split("").map((star, i) => (
            <span key={i} className="text-primary">★</span>
          ))}
        </div>
        <p className="mb-6 text-foreground/90 italic leading-relaxed">{`"${quote}"`}</p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
            <img 
              src={image} 
              alt={name} 
              className="h-full w-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
