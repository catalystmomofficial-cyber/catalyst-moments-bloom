import PageLayout from '@/components/layout/PageLayout';
import { PregnancyWellnessDigest } from '@/components/pregnancy/PregnancyWellnessDigest';

const WellnessDigestPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PregnancyWellnessDigest />
    </div>
  </PageLayout>
);

export default WellnessDigestPage;
