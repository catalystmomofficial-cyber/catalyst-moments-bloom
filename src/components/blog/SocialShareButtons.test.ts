import { describe, expect, it } from 'vitest';
import { getSocialShareLinks } from './SocialShareButtons';

describe('getSocialShareLinks', () => {
  const title = 'Pregnancy Workout by Trimester: What Changed & Why';
  const url = 'https://catalystmomofficial.com/blog/pregnancy-workout-by-trimester';

  it('builds a Facebook composer with the article and title hint', () => {
    const link = new URL(getSocialShareLinks(title, url).facebook);

    expect(link.origin + link.pathname).toBe('https://www.facebook.com/sharer/sharer.php');
    expect(link.searchParams.get('u')).toBe(url);
    expect(link.searchParams.get('quote')).toBe(title);
  });

  it('builds a prefilled Twitter composer', () => {
    const link = new URL(getSocialShareLinks(title, url).twitter);

    expect(link.searchParams.get('url')).toBe(url);
    expect(link.searchParams.get('text')).toBe(title);
  });

  it('builds a LinkedIn composer with the public article URL', () => {
    const link = new URL(getSocialShareLinks(title, url).linkedin);

    expect(link.origin + link.pathname).toBe('https://www.linkedin.com/sharing/share-offsite/');
    expect(link.searchParams.get('url')).toBe(url);
  });
});
