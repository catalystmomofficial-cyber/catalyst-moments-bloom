
import React from 'react';
import { Badge } from "@/components/ui/badge";
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container container-padding mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Moms Love Catalyst Mom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our community about how Catalyst Mom has supported their wellness journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="Finding time for fitness seemed impossible until I discovered Catalyst Mom. The 10-minute workouts fit perfectly into my chaotic schedule."
            name="Sarah T."
            role="Mom of 2, Postpartum"
            image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80"
          />
          <TestimonialCard
            quote="The pregnancy workouts helped me stay active safely. My delivery recovery was so much faster than with my first baby."
            name="Michelle K."
            role="Mom of 1, Pregnant"
            image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80"
            featured
          />
          <TestimonialCard
            quote="The community aspect of Catalyst Mom has been my lifeline. It's like having a village of supportive moms in my pocket."
            name="Jessica M."
            role="Mom of 3, Toddler Phase"
            image="https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
