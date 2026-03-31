import PageLayout from '@/components/layout/PageLayout';
import { TTCCommunitySection } from '@/components/ttc/TTCCommunitySection';

const TTCCommunityPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TTCCommunitySection />
    </div>
  </PageLayout>
);

export default TTCCommunityPage;
