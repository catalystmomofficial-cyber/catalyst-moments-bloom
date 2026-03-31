import PageLayout from '@/components/layout/PageLayout';
import { TTCWorkoutCard } from '@/components/ttc/TTCWorkoutCard';

const TTCWorkoutsPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">TTC Workouts</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <TTCWorkoutCard />
      </div>
    </div>
  </PageLayout>
);

export default TTCWorkoutsPage;
