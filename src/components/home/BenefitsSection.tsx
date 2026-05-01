
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container container-padding mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed With You in Mind</h2>
            <p className="text-muted-foreground mb-8">
              At Catalyst Mom, we understand the unique challenges of motherhood because we've been there. Our platform is built from love — for moms, with moms.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Expert-Backed Content</h4>
                  <p className="text-sm text-muted-foreground">All programs developed by certified pre/postnatal specialists</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Flexible & Adaptable</h4>
                  <p className="text-sm text-muted-foreground">Workouts and programs that adjust to your changing needs and time constraints</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-catalyst-copper mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Holistic Approach</h4>
                  <p className="text-sm text-muted-foreground">We address physical, mental and emotional wellbeing together</p>
                </div>
              </div>
            </div>
            
            <Button asChild className="mt-8 bg-catalyst-copper hover:bg-catalyst-copper/90">
              <Link to="/about">Learn Our Story</Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 top-10 -left-10 w-64 h-64 bg-catalyst-copper/5 rounded-full"></div>
            <div className="absolute -z-10 bottom-10 -right-10 w-48 h-48 bg-catalyst-peach/20 rounded-full"></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-soft">
                  <AspectRatio ratio={1/1}>
                    <img 
                      src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                      alt="Mother and baby"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
                <div className="rounded-xl overflow-hidden shadow-soft translate-x-6">
                  <AspectRatio ratio={4/5}>
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                      alt="Mother doing yoga"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="space-y-4 translate-y-10">
                <div className="rounded-xl overflow-hidden shadow-soft">
                  <AspectRatio ratio={4/5}>
                     <img 
                       src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
                       alt="Woman using wellness app"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
                <div className="rounded-xl overflow-hidden shadow-soft">
                  <AspectRatio ratio={1/1}>
                    <img 
                      src="https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                      alt="Family outdoors"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
