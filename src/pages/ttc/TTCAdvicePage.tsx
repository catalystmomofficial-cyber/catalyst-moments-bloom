import PageLayout from '@/components/layout/PageLayout';
import { TTCPersonalizedAdvice } from '@/components/ttc/TTCPersonalizedAdvice';

const TTCAdvicePage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TTCPersonalizedAdvice />
    </div>
  </PageLayout>
);

export default TTCAdvicePage;
