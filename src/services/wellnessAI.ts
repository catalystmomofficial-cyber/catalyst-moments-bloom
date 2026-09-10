import { supabase } from '@/integrations/supabase/client';

interface WellnessProfile {
  journey: string;
  stage: string;
  moodScore: number;
  energyLevel: number;
  stressLevel: number;
  sleepHours: number;
  hydrationGlasses: number;
  selfCareCompleted: boolean;
  recentActivities: string[];
  preferences: string[];
}

interface PersonalizedRecommendation {
  id: string;
  type: 'nutrition' | 'exercise' | 'mindfulness' | 'self-care' | 'sleep';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  timeframe: string;
  category: string;
  icon: string;
}

class WellnessAIService {
  private generateRecommendationPrompt(profile: WellnessProfile): string {
    return `
    As a wellness AI coach, generate 5 personalized recommendations for a ${profile.journey} person at ${profile.stage} stage with:
    - Mood: ${profile.moodScore}/10
    - Energy: ${profile.energyLevel}/10  
    - Stress: ${profile.stressLevel}/10
    - Sleep: ${profile.sleepHours} hours
    - Hydration: ${profile.hydrationGlasses} glasses
    - Self-care completed: ${profile.selfCareCompleted}
    - Recent activities: ${profile.recentActivities.join(', ')}
    
    Focus on their specific needs and journey. Be precise, actionable, and consider their current wellness state.
    Format as JSON array with: type, title, description, action, priority, reasoning, timeframe, category, icon.
    `;
  }

  async generatePersonalizedRecommendations(profile: WellnessProfile): Promise<PersonalizedRecommendation[]> {
    try {
      const prompt = this.generateRecommendationPrompt(profile);
      
      const { data, error } = await supabase.functions.invoke('generate-wellness-recommendations', {
        body: { prompt, profile }
      });

      if (error) throw error;

      return data.recommendations || this.getFallbackRecommendations(profile);
    } catch (error) {
      // The screen remains fully usable when the optional AI endpoint is
      // unavailable; return deterministic recommendations without surfacing a
      // false fatal error to browser monitoring.
      return this.getFallbackRecommendations(profile);
    }
  }

  private getFallbackRecommendations(profile: WellnessProfile): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Mood-based recommendations
    if (profile.moodScore < 5) {
      recommendations.push({
        id: '1',
        type: 'mindfulness',
        title: 'Mood Boost Session',
        description: 'Your mood seems low today. A 10-minute mindfulness session can help.',
        action: 'Start 10-minute guided meditation',
        priority: 'high',
        reasoning: `Based on your mood score of ${profile.moodScore}/10`,
        timeframe: '10 minutes',
        category: 'Mental Health',
        icon: '🧘‍♀️'
      });
    }

    // Energy-based recommendations
    if (profile.energyLevel < 5) {
      recommendations.push({
        id: '2',
        type: 'exercise',
        title: 'Energy Boost Movement',
        description: 'Light movement can naturally increase your energy levels.',
        action: 'Try 5-minute energizing stretches',
        priority: 'medium',
        reasoning: `Your energy level is ${profile.energyLevel}/10`,
        timeframe: '5 minutes',
        category: 'Movement',
        icon: '⚡'
      });
    }

    // Sleep-based recommendations
    if (profile.sleepHours < 7) {
      recommendations.push({
        id: '3',
        type: 'sleep',
        title: 'Sleep Optimization',
        description: 'Your sleep could be improved for better wellness.',
        action: 'Create evening wind-down routine',
        priority: 'high',
        reasoning: `Only ${profile.sleepHours} hours of sleep`,
        timeframe: 'Tonight',
        category: 'Sleep Health',
        icon: '😴'
      });
    }

    // Journey-specific recommendations
    if (profile.journey === 'pregnant') {
      recommendations.push({
        id: '4',
        type: 'nutrition',
        title: 'Prenatal Nutrition Focus',
        description: 'Ensure you\'re getting essential nutrients for you and baby.',
        action: 'Review prenatal vitamin intake',
        priority: 'medium',
        reasoning: 'Important during pregnancy',
        timeframe: 'Today',
        category: 'Nutrition',
        icon: '🥗'
      });
    }

    // Hydration recommendations
    if (profile.hydrationGlasses < 6) {
      recommendations.push({
        id: '5',
        type: 'self-care',
        title: 'Hydration Reminder',
        description: 'Staying hydrated is crucial for your wellness.',
        action: 'Drink 2 glasses of water now',
        priority: 'medium',
        reasoning: `Only ${profile.hydrationGlasses} glasses today`,
        timeframe: 'Now',
        category: 'Hydration',
        icon: '💧'
      });
    }

    return recommendations.slice(0, 5);
  }

  async generateDynamicInsights(profile: WellnessProfile): Promise<string[]> {
    const insights: string[] = [];

    // Trend analysis
    if (profile.moodScore > 7 && profile.energyLevel > 7) {
      insights.push("You're having a great day! Your mood and energy are both high.");
    }

    if (profile.stressLevel > 7) {
      insights.push("Your stress levels are elevated. Consider some relaxation techniques.");
    }

    // Journey-specific insights
    if (profile.journey === 'ttc') {
      insights.push("Remember that stress can impact fertility. Focus on stress management today.");
    } else if (profile.journey === 'pregnant') {
      insights.push("Your wellness directly impacts your baby's development. Keep up the good work!");
    } else if (profile.journey === 'postpartum') {
      insights.push("Recovery is a journey. Be gentle with yourself and celebrate small wins.");
    }

    return insights;
  }

  async generateSelfCareIdeas(profile: any): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-wellness-recommendations', {
        body: { 
          action: 'selfcare',
          profile 
        }
      });

      if (error) throw error;

      return data.ideas || this.getFallbackSelfCareIdeas(profile);
    } catch (error) {
      // Keep the wellness page responsive during gateway/auth/network outages.
      return this.getFallbackSelfCareIdeas(profile);
    }
  }

  private getFallbackSelfCareIdeas(profile: any): any[] {
    return [
      {
        id: '1',
        title: 'Deep Breathing',
        description: '5 deep breaths focusing on longer exhales',
        duration: '2 min',
        category: 'breathing',
        instructions: ['Sit comfortably', 'Inhale for 4 counts', 'Exhale for 6 counts', 'Repeat 5 times'],
        benefits: 'Reduces stress and promotes relaxation',
        icon: '🫁'
      },
      {
        id: '2',
        title: 'Shoulder Release',
        description: 'Gentle shoulder rolls to release tension',
        duration: '3 min',
        category: 'movement',
        instructions: ['Roll shoulders back 5 times', 'Roll shoulders forward 5 times', 'Gentle neck stretches'],
        benefits: 'Relieves physical tension and improves posture',
        icon: '🤸‍♀️'
      },
      {
        id: '3',
        title: 'Gratitude Moment',
        description: 'Write down one thing you\'re grateful for',
        duration: '2 min',
        category: 'mindfulness',
        instructions: ['Find a quiet moment', 'Think of something positive', 'Write it down or say it aloud'],
        benefits: 'Boosts mood and shifts perspective',
        icon: '🧘‍♀️'
      }
    ];
  }
}

export const wellnessAI = new WellnessAIService();
