import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ruler, Shield, Hand, Package, CheckCircle } from 'lucide-react';
import { educationalContent } from '@/data/birthBallGuideData';

const BirthBallBuyingGuide = () => {
  const { buyingGuide } = educationalContent;

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
          <Badge variant="secondary" className="mb-4">Essential Guide</Badge>
          <h1 className="text-4xl font-bold mb-4">{buyingGuide.title}</h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect birth ball for your height, needs, and safety
          </p>
        </div>

        {/* Size Guide */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Size Matters (Based on Your Height)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buyingGuide.sizing.map((size, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <span className="font-medium">{size.height}</span>
                  <Badge variant="default" className="text-lg px-4 py-1">
                    {size.size}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Sizing Tip:</strong> {buyingGuide.sizingTip}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Material & Quality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Material & Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {buyingGuide.material.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Grip & Stability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="h-5 w-5" />
              Grip & Stability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {buyingGuide.grip.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Accessories */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Included Accessories (Optional but Useful)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {buyingGuide.accessories.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <p className="font-medium mb-1">Yoga Ball</p>
                <p className="text-xs text-muted-foreground">Anti-burst, 55-75cm</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <p className="font-medium mb-1">Yoga Mat</p>
                <p className="text-xs text-muted-foreground">Non-slip surface</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 text-center">
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <p className="font-medium mb-1">Supportive Leggings</p>
                <p className="text-xs text-muted-foreground">Maternity fit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallBuyingGuide;
