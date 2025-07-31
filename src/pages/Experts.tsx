import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Experts = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Our Experts</h1>
          <Card>
            <CardHeader>
              <CardTitle>Meet Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn about our certified prenatal fitness specialists, registered dietitians, 
                and wellness experts who create our evidence-based programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Experts;