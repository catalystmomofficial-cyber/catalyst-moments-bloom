const interests = ['ttc', 'pregnancy', 'postpartum', 'nutrition', 'fitness', 'wellness'];

export function newsletterInterest(tags: string[] = []): string {
  const normalized = tags.map(tag => tag.trim().toLowerCase());
  // A stage is more useful than a broad topic, regardless of tag order.
  return interests.find(interest => normalized.includes(interest)) ?? 'general';
}
