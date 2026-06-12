import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const homeFaqs = [
  {
    q: "What is Catalyst Mom?",
    a: "Catalyst Mom is a wellness, fitness, and nutrition platform built for every stage of motherhood — trying to conceive (TTC), pregnancy, and postpartum. It combines personalized workouts, meal plans, milestone tracking, and a supportive community in one place.",
  },
  {
    q: "Who is Catalyst Mom for?",
    a: "Catalyst Mom is for women trying to conceive, currently pregnant, or recovering postpartum — whether that's weeks or years after birth. Programs adapt to your current stage, energy levels, and goals.",
  },
  {
    q: "What is included in a Catalyst Mom membership?",
    a: "A membership includes trimester-by-trimester prenatal plans, postpartum core and pelvic floor restoration protocols, time-efficient 20-minute home workouts, nutrition frameworks, milestone tracking tools, and access to our supportive community space.",
  },
  {
    q: "Do I need any equipment to get started?",
    a: "No. Most Catalyst Mom workouts are designed to be done at home with minimal or no equipment, making it easy to fit movement into a busy day as a mom.",
  },
  {
    q: "Is there a free trial or money-back guarantee?",
    a: "Yes. Catalyst Mom offers a risk-free 7-day money-back guarantee, so you can try the workouts, community, and protocols and get a full refund if it isn't the right fit.",
  },
];

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": homeFaqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a },
  })),
};

const HomeFAQSection = () => {
  return (
    <section aria-label="Frequently Asked Questions" className="section-padding bg-muted/30">
      <div className="container container-padding mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {homeFaqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-center text-muted-foreground mt-8">
          Have more questions? Visit our{' '}
          <Link to="/faq" className="underline hover:text-primary">
            full FAQ page
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default HomeFAQSection;
