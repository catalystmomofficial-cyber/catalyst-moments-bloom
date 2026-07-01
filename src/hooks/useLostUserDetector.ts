import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Pages that count as "meaningful actions" — user found what they needed.
// Visiting these resets the lost-user counter.
const CONVERSION_PATHS = [
  '/workouts/',          // entered a specific workout
  '/meal-plan/',         // opened a specific plan
  '/course/',            // opened a course
  '/programs/',          // opened a program
  '/birth-ball-guide/',  // entered the guide
  '/wellness/resources', // browsing resources (intentional)
  '/wellness/self-care', // intentional self-care visit
  '/community/',         // joined a group
  '/progress',           // logging progress = intentional
  '/affiliate',          // intentional affiliate interest
];

// Pages to ignore entirely (auth, legal, admin)
const IGNORE_PATHS = [
  '/login', '/register', '/signup', '/forgot-password', '/reset-password',
  '/terms', '/privacy', '/medical-disclaimer', '/admin', '/unsubscribe',
];

const VISIT_THRESHOLD = 4;    // pages visited
const TIME_WINDOW_MS  = 3 * 60 * 1000; // within 3 minutes
const COOLDOWN_MS     = 10 * 60 * 1000; // don't re-show for 10 minutes

export const useLostUserDetector = () => {
  const location = useLocation();
  const visits = useRef<number[]>([]);       // timestamps of recent page visits
  const lastShown = useRef<number>(0);
  const [isLost, setIsLost] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    // Skip ignored paths
    if (IGNORE_PATHS.some(p => path.startsWith(p))) return;

    // Conversion path → user found what they needed, reset everything
    if (CONVERSION_PATHS.some(p => path.startsWith(p))) {
      visits.current = [];
      setIsLost(false);
      return;
    }

    const now = Date.now();

    // Add this visit
    visits.current.push(now);

    // Trim to only visits within the time window
    visits.current = visits.current.filter(t => now - t < TIME_WINDOW_MS);

    // Check if lost: N+ unique top-level pages within window, not recently shown
    if (
      visits.current.length >= VISIT_THRESHOLD &&
      now - lastShown.current > COOLDOWN_MS
    ) {
      setIsLost(true);
      lastShown.current = now;
    }
  }, [location.pathname]);

  const dismiss = () => {
    setIsLost(false);
    visits.current = [];
  };

  return { isLost, dismiss };
};
