import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const AboutSection = () => {
  return (
    <section aria-label="About Catalyst Mom" className="section-padding bg-white dark:bg-background">
      <div className="container container-padding mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
            About Catalyst Mom
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Wellness Built Around Real Motherhood
          </h2>
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Catalyst Mom is a wellness, fitness, and nutrition platform designed specifically for the three
            stages of the maternal journey: trying to conceive (TTC), pregnancy, and postpartum recovery.
            Instead of generic fitness programming, every workout, meal plan, and wellness tool adapts to where
            a mother actually is in her journey — accounting for energy levels, hormonal changes, and the
            realities of caring for a family while also caring for herself.
          </p>
          <p>
            Our programs are grounded in guidance from trusted maternal health authorities. Postpartum core and
            pelvic floor protocols draw on physical activity recommendations from the{' '}
            <a
              href="https://www.acog.org/womens-health/faqs/exercise-during-pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              American College of Obstetricians and Gynecologists (ACOG)
            </a>
            , and our movement guidance is informed by the{' '}
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              World Health Organization's physical activity guidelines
            </a>
            . We translate that research into short, realistic routines that fit into a busy mom's day.
          </p>
          <p>
            Beyond workouts, Catalyst Mom includes a supportive community, bi-weekly coach check-ins, and tools
            like our{' '}
            <Link to="/food-calories" className="underline hover:text-primary">
              free food calorie checker
            </Link>{' '}
            to help with nutrition planning at every stage. To learn more about why we built Catalyst Mom and
            the team behind it, read{' '}
            <Link to="/about" className="underline hover:text-primary">
              our story
            </Link>
            , browse our{' '}
            <Link to="/blog" className="underline hover:text-primary">
              wellness blog
            </Link>{' '}
            for evidence-based articles on pregnancy, postpartum recovery, and fertility, or check our{' '}
            <Link to="/faq" className="underline hover:text-primary">
              frequently asked questions
            </Link>{' '}
            for details on pricing, coaching, and what's included in a membership.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
