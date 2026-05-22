import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Sparkles } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const MOMODORO_COVER =
  'https://catalystmomofficial.com/Momon%20guide/Product%20Covers%20copy.png';
const MOMODORO_PDF =
  'https://catalystmomofficial.com/Momon%20guide/The%20Momodoro%20Planner.pdf';

const WellnessResources = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Wellness Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium digital guides crafted to support every stage of your motherhood journey.
            </p>
          </div>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Journey-Specific Resources</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Momodoro Planner — premium product card */}
              <Card className="group overflow-hidden border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={MOMODORO_COVER}
                    alt="The Momodoro Planner cover"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 text-foreground border-0 backdrop-blur">
                      Digital Guide
                    </Badge>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      The Catalyst Mom Collection
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-tight text-foreground">
                      The Momodoro Planner
                    </h3>
                  </div>
                </div>

                <CardContent className="p-6 space-y-5">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    A beautifully structured premium time-management and layout tool
                    designed to help busy moms organize their days and reclaim their time.
                  </p>

                  <Button asChild size="lg" className="w-full">
                    <a
                      href={MOMODORO_PDF}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Planner
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default WellnessResources;
