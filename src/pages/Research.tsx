import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Research = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Research & Evidence</h1>
          <Card>
            <CardHeader>
              <CardTitle>Science-Backed Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All our programs are built on peer-reviewed research and clinical evidence. 
                Discover the studies and science behind our recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Research;