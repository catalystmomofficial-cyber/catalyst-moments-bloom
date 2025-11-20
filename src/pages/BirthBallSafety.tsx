import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ShieldCheck, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
import { educationalContent } from '@/data/birthBallGuideData';

const BirthBallSafety = () => {
  const { safety } = educationalContent;

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
          <Badge variant="secondary" className="mb-4">Safety First</Badge>
          <h1 className="text-4xl font-bold mb-4">{safety.title}</h1>
          <p className="text-xl text-muted-foreground">
            Important guidelines for safe and comfortable practice
          </p>
        </div>

        {/* Safety Sections */}
        {safety.sections.map((section, index) => {
          if (section.title === "Know when to Pause") {
            return (
              <Alert key={index} variant="destructive" className="mb-6">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  {section.warning && (
                    <p className="text-sm mb-3">{section.warning}</p>
                  )}
                  {section.symptoms && (
                    <ul className="space-y-2">
                      {section.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-destructive mt-1">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Alert>
            );
          }

          return (
            <Card key={index} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.title === "Use the Ball Safely" && <ShieldCheck className="h-5 w-5" />}
                  {section.title === "Inflate It Right" && <CheckCircle className="h-5 w-5" />}
                  {section.title === "Stay Hydrated & Relaxed" && <Droplets className="h-5 w-5" />}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {/* Proper Usage Checklist */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>How to Know If You're Using the Ball Properly</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {educationalContent.troubleshooting.properUse.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallSafety;
