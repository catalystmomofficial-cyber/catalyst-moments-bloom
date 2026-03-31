import PageLayout from '@/components/layout/PageLayout';
import { TTCEducationalResources } from '@/components/ttc/TTCEducationalResources';

const TTCEducationPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TTCEducationalResources />
    </div>
  </PageLayout>
);

export default TTCEducationPage;
