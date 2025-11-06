import { useState, useEffect } from 'react';

interface PlanStats {
  monthly: number;
  yearly: number;
}

const STORAGE_KEY = 'catalyst_plan_stats';

export const usePlanPopularity = () => {
  const [stats, setStats] = useState<PlanStats>({ monthly: 0, yearly: 0 });

  useEffect(() => {
    // Load stats from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStats(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse plan stats:', e);
      }
    }
  }, []);

  const trackSelection = (plan: 'monthly' | 'yearly') => {
    const newStats = {
      ...stats,
      [plan]: stats[plan] + 1,
    };
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  const getMostPopular = (): 'monthly' | 'yearly' | null => {
    if (stats.monthly === 0 && stats.yearly === 0) {
      return 'yearly'; // Default to yearly as it's better value
    }
    if (stats.yearly > stats.monthly) return 'yearly';
    if (stats.monthly > stats.yearly) return 'monthly';
    return null; // Tie
  };

  return {
    stats,
    trackSelection,
    mostPopular: getMostPopular(),
  };
};
