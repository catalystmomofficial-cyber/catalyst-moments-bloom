import PageLayout from '@/components/layout/PageLayout';
import { TTCTracker } from '@/components/ttc/TTCTracker';

const TTCTrackerPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TTCTracker />
    </div>
  </PageLayout>
);

export default TTCTrackerPage;
