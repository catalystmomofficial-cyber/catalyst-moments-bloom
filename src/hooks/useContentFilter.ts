import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  journey: string[];
  stage?: string[];
  category: string;
  tags: string[];
  [key: string]: any;
}

export const useContentFilter = () => {
  const { profile } = useAuth();

  const currentJourney = useMemo(() => {
    if (!profile?.motherhood_stage) return null;
    
    // Extract base journey from stage
    if (profile.motherhood_stage.includes('ttc')) return 'ttc';
    if (profile.motherhood_stage.includes('trimester') || profile.motherhood_stage.includes('pregnan')) return 'pregnant';
    if (profile.motherhood_stage.includes('postpartum')) return 'postpartum';
    if (profile.motherhood_stage.includes('toddler')) return 'toddler';

    // Fallback to direct stage mapping
    return profile.motherhood_stage;
  }, [profile?.motherhood_stage]);

  const currentStage = useMemo(() => {
    return profile?.motherhood_stage || null;
  }, [profile?.motherhood_stage]);

  const filterContent = useMemo(() => {
    return (content: ContentItem[]) => {
      if (!currentJourney) return content;

      return content.filter(item => {
        // Check if content is available for current journey
        const journeyMatch = item.journey.includes(currentJourney) || 
                            item.journey.includes('all');

        // If there are specific stage requirements, check those too
        if (item.stage && item.stage.length > 0 && currentStage) {
          const stageMatch = item.stage.includes(currentStage) ||
                           item.stage.some(stage => currentStage.includes(stage));
          return journeyMatch && stageMatch;
        }

        return journeyMatch;
      });
    };
  }, [currentJourney, currentStage]);

  const getStageInfo = useMemo(() => {
    if (!currentStage) return null;

    // Parse stage information
    if (currentStage.includes('ttc')) {
      if (currentStage.includes('1-3')) return { journey: 'ttc', phase: '1-3 months', week: null };
      if (currentStage.includes('4-6')) return { journey: 'ttc', phase: '4-6 months', week: null };
      if (currentStage.includes('6-12')) return { journey: 'ttc', phase: '6-12 months', week: null };
      if (currentStage.includes('12+')) return { journey: 'ttc', phase: '12+ months', week: null };
      return { journey: 'ttc', phase: 'Trying to Conceive', week: null };
    }

    if (currentStage.includes('trimester') || currentStage.includes('pregnan')) {
      if (currentStage.includes('1')) return { journey: 'pregnant', phase: 'First Trimester', week: '1-12 weeks' };
      if (currentStage.includes('2')) return { journey: 'pregnant', phase: 'Second Trimester', week: '13-26 weeks' };
      if (currentStage.includes('3')) return { journey: 'pregnant', phase: 'Third Trimester', week: '27-40 weeks' };
      return { journey: 'pregnant', phase: 'Pregnant', week: null };
    }

    if (currentStage.includes('postpartum')) {
      if (currentStage.includes('0-6')) return { journey: 'postpartum', phase: '0-6 weeks postpartum', week: null };
      if (currentStage.includes('6-12')) return { journey: 'postpartum', phase: '6-12 weeks postpartum', week: null };
      if (currentStage.includes('3-6m')) return { journey: 'postpartum', phase: '3-6 months postpartum', week: null };
      if (currentStage.includes('6-12m')) return { journey: 'postpartum', phase: '6-12 months postpartum', week: null };
      if (currentStage.includes('12m+')) return { journey: 'postpartum', phase: '12+ months postpartum', week: null };
      return { journey: 'postpartum', phase: 'Postpartum', week: null };
    }

    if (currentStage.includes('toddler')) {
      if (currentStage.includes('1-2')) return { journey: 'toddler', phase: '1-2 year old', week: null };
      if (currentStage.includes('2-3')) return { journey: 'toddler', phase: '2-3 years old', week: null };
      if (currentStage.includes('3+')) return { journey: 'toddler', phase: '3+ years old', week: null };
      return { journey: 'toddler', phase: 'Toddler Mom', week: null };
    }

    return { journey: currentStage, phase: currentStage, week: null };
  }, [currentStage]);

  return {
    currentJourney,
    currentStage,
    stageInfo: getStageInfo,
    filterContent,
    hasJourney: !!currentJourney
  };
};
