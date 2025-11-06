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
    // Always default to monthly as most popular
    return 'monthly';
  };

  return {
    stats,
    trackSelection,
    mostPopular: getMostPopular(),
  };
};
