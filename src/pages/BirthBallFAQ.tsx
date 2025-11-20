import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { educationalContent } from '@/data/birthBallGuideData';

const BirthBallFAQ = () => {
  const { troubleshooting, quickstart } = educationalContent;

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
          <Badge variant="secondary" className="mb-4">Help & Support</Badge>
          <h1 className="text-4xl font-bold mb-4">{troubleshooting.title}</h1>
          <p className="text-xl text-muted-foreground">
            Common questions, solutions, and quick tips
          </p>
        </div>

        {/* Common Mistakes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Common Mistakes and How to Avoid Them
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {troubleshooting.commonMistakes.map((item, index) => (
                <AccordionItem key={index} value={`mistake-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span className="font-medium">{item.mistake}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">Fix:</p>
                        <p className="text-green-800 dark:text-green-200">{item.fix}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* What to Do If You Feel Discomfort */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              What to Do If You Feel Discomfort or Strain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {troubleshooting.discomfort.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quickstart Checklist */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{quickstart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Setup */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Setup Your Space
                </h3>
                <ul className="space-y-2 ml-6">
                  {quickstart.setup.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Starting Routine */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Pick Your Starting Routine
                </h3>
                <ul className="space-y-2 ml-6">
                  {quickstart.starting.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Make It a Habit */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Make It a Habit
                </h3>
                <ul className="space-y-2 ml-6">
                  {quickstart.habit.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tip */}
              <div className="p-4 bg-background rounded-lg border border-primary/20">
                <p className="text-sm font-medium">
                  💡 <strong>PRO TIP:</strong> {quickstart.proTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallFAQ;
