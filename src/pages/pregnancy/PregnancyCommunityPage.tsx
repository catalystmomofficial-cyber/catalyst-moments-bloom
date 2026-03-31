import PageLayout from '@/components/layout/PageLayout';
import { PregnancyCommunity } from '@/components/pregnancy/PregnancyCommunity';

const PregnancyCommunityPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PregnancyCommunity />
    </div>
  </PageLayout>
);

export default PregnancyCommunityPage;
