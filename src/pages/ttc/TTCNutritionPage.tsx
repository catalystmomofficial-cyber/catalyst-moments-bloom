import PageLayout from '@/components/layout/PageLayout';
import { TTCNutritionSection } from '@/components/ttc/TTCNutritionSection';

const TTCNutritionPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Fertility Nutrition</h1>
      <TTCNutritionSection />
    </div>
  </PageLayout>
);

export default TTCNutritionPage;
