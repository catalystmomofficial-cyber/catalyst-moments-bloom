import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Wind, RotateCw, ArrowDown, CheckCircle } from 'lucide-react';
import { educationalContent } from '@/data/birthBallGuideData';

const BirthBallEarlyLabor = () => {
  const { earlyLabor, reducesTearing } = educationalContent;

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
          <Badge variant="secondary" className="mb-4">Labor Support</Badge>
          <h1 className="text-4xl font-bold mb-4">{earlyLabor.title}</h1>
          <p className="text-xl text-muted-foreground">
            Techniques for managing contractions and staying comfortable
          </p>
        </div>

        {/* Techniques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {earlyLabor.techniques.map((technique, index) => {
            const icons = [
              <Heart className="h-8 w-8 text-primary" />,
              <ArrowDown className="h-8 w-8 text-primary" />,
              <Wind className="h-8 w-8 text-primary" />,
              <RotateCw className="h-8 w-8 text-primary" />
            ];
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      {icons[index]}
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">{technique}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm italic text-muted-foreground">
              {earlyLabor.note}
            </p>
          </CardContent>
        </Card>

        {/* Why These Moves Help */}
        <Card>
          <CardHeader>
            <CardTitle>{reducesTearing.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{reducesTearing.content}</p>
            <ul className="space-y-3">
              {reducesTearing.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-background rounded-lg border border-primary/20">
              <p className="text-sm italic text-muted-foreground">
                {reducesTearing.note}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Weeks Routine Link */}
        <Card className="mt-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Ready for the Final Weeks?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check out our daily routine specifically designed for weeks 36-40
              </p>
              <Button asChild>
                <Link to="/birth-ball-guide/trimester-3">
                  View Final Weeks Routine
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallEarlyLabor;
