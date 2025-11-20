import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Heart, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { educationalContent } from '@/data/birthBallGuideData';

const BirthBallEducation = () => {
  const { pelvicFloor } = educationalContent;

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/birth-ball-guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guide
          </Link>
        </Button>

        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">Education</Badge>
          <h1 className="text-4xl font-bold mb-4">{pelvicFloor.title}</h1>
          <p className="text-xl text-muted-foreground">
            Learn how your body works and how the birth ball supports you
          </p>
        </div>

        {/* Main Sections */}
        {pelvicFloor.sections.map((section, index) => {
          if (section.points) {
            // What is the pelvic floor section
            return (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {section.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{section.answer}</p>
                  <div className="space-y-3">
                    <p className="font-semibold">Here's why it matters:</p>
                    <ul className="space-y-2">
                      {section.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          }

          if (section.benefits && section.risks) {
            // How birth balls help or harm section
            return (
              <div key={index} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-green-600" />
                      Used the Right Way
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      If Used Wrong
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-destructive mt-1 flex-shrink-0">✕</span>
                          <span className="text-sm text-muted-foreground">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          }

          if (section.stages) {
            // How body changes throughout pregnancy
            return (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {section.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.stages.map((stage, idx) => (
                      <div key={idx} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">Trimester {stage.trimester}</Badge>
                        </div>
                        <p className="text-muted-foreground">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }

          return null;
        })}

        {/* Expert Tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Expert Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {educationalContent.expertTips.map((tip, index) => (
                <div key={index} className="p-4 bg-background rounded-lg border">
                  <p className="text-muted-foreground italic mb-2">"{tip.quote}"</p>
                  <p className="text-sm font-medium text-primary">— {tip.author}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallEducation;
