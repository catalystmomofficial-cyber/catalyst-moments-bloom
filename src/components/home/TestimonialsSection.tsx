import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "I couldn't sneeze without leaking and my belly still looked 5 months pregnant. Three weeks into this program my core finally feels like mine again. I actually cried during my check-in. Do not sleep on this.",
    author: "Postpartum Mama",
  },
  {
    quote: "I had been trying for 8 months and felt completely lost. I didn't even know my cycle properly — I was just guessing. This program helped me understand what my body was actually doing. Two months in, I finally felt like I had a real plan and not just hope.",
    author: "TTC Mama",
  },
  {
    quote: "I was terrified of tearing again after my first birth. I started the birth ball protocol in my third trimester and did the breathing exercises every single day. When labour hit I actually felt prepared. My midwife was shocked at how in control I was — and I didn't tear at all this time.",
    author: "Pregnancy Mama",
  },
  {
    quote: "My second VBAC was completely different. After doing the low-impact exercises throughout my pregnancy, when labour finally kicked in I felt in control the whole way through. I pushed my baby out in 10 minutes. My first VBAC took over an hour of pushing. This program changed everything.",
    author: "VBAC Mama",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-white dark:bg-background">
      <div className="container container-padding mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-catalyst-copper/40 text-catalyst-copper">
            Real Mamas. Real Results.
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            Trusted by Mamas Worldwide
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            After supporting over 2,000 mamas with our digital guides, we built the Catalyst Mom App to take your recovery even deeper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="border-0 shadow-soft rounded-2xl bg-catalyst-cream/40 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-7">
                <div className="text-catalyst-copper text-4xl leading-none font-playfair mb-3">"</div>
                <p className="text-foreground/90 italic leading-relaxed mb-5">
                  {t.quote}
                </p>
                <div className="pt-4 border-t border-catalyst-copper/15">
                  <p className="text-sm font-semibold text-catalyst-copper">
                    — {t.author}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Catalyst Mom Community
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
