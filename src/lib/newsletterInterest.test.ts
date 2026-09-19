import { describe, expect, it } from 'vitest';
import { newsletterInterest } from './newsletterInterest';

describe('newsletterInterest', () => {
  it('uses general for All Posts or unknown categories', () => {
    expect(newsletterInterest()).toBe('general');
    expect(newsletterInterest(['all'])).toBe('general');
  });
  it('prioritizes stage over a broad article topic', () => {
    expect(newsletterInterest(['nutrition', 'pregnancy'])).toBe('pregnancy');
    expect(newsletterInterest(['fitness', 'postpartum'])).toBe('postpartum');
    expect(newsletterInterest(['wellness', 'TTC'])).toBe('ttc');
  });
  it('normalizes categories and preserves broad topics', () => {
    expect(newsletterInterest([' Pregnancy '])).toBe('pregnancy');
    expect(newsletterInterest(['nutrition'])).toBe('nutrition');
  });
});
