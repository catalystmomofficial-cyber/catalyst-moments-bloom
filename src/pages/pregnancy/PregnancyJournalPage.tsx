import PageLayout from '@/components/layout/PageLayout';
import { PregnancyJournal } from '@/components/pregnancy/PregnancyJournal';

const PregnancyJournalPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PregnancyJournal />
    </div>
  </PageLayout>
);

export default PregnancyJournalPage;
