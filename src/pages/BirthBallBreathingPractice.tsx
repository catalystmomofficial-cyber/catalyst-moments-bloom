import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BreathingPractice from '@/components/birth-ball/BreathingPractice';
import SEO from '@/components/seo/SEO';

const BirthBallBreathingPractice = () => {
  return (
    <PageLayout>
      <SEO 
        title="Breathing Practice Tool - Birth Ball Guide"
        description="Interactive breathing practice tool with techniques for pregnancy, labor, and relaxation. Practice 4-6 breathing, box breathing, and more."
      />
      
      <div className="container px-4 mx-auto py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/birth-ball-guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Birth Ball Guide
          </Link>
        </Button>

        <h1 className="sr-only">Breathing Practice Tool for Pregnancy and Labor</h1>

        <BreathingPractice />
      </div>
    </PageLayout>
  );
};

export default BirthBallBreathingPractice;
