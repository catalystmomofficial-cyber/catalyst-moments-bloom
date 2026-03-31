import PageLayout from '@/components/layout/PageLayout';
import { ContractionTracker } from '@/components/pregnancy/ContractionTracker';

const ContractionTrackerPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ContractionTracker />
    </div>
  </PageLayout>
);

export default ContractionTrackerPage;
