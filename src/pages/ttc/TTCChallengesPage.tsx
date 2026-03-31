import PageLayout from '@/components/layout/PageLayout';
import { TTCCommunityChallenge } from '@/components/ttc/TTCCommunityChallenge';

const TTCChallengesPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TTCCommunityChallenge />
    </div>
  </PageLayout>
);

export default TTCChallengesPage;
