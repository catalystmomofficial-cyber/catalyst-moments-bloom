import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Experts = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Our Experts</h1>
          <div className="mt-12 text-center">
            <p
              className="mb-8"
              style={{
                color: '#B5651D',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Featured Partners
            </p>
            {/* Expert cards go here */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Experts;