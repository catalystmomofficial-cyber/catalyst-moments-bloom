import PageLayout from '@/components/layout/PageLayout';
import { PregnancyTracker } from '@/components/pregnancy/PregnancyTracker';

const PregnancyTrackerPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PregnancyTracker />
    </div>
  </PageLayout>
);

export default PregnancyTrackerPage;
