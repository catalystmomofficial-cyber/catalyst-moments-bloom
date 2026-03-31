import PageLayout from '@/components/layout/PageLayout';
import { CycleCalendar } from '@/components/ttc/CycleCalendar';

const CycleCalendarPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <CycleCalendar />
    </div>
  </PageLayout>
);

export default CycleCalendarPage;
