import PageLayout from '@/components/layout/PageLayout';
import { BabyKickCounter } from '@/components/pregnancy/BabyKickCounter';

const BabyKickCounterPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BabyKickCounter />
    </div>
  </PageLayout>
);

export default BabyKickCounterPage;
