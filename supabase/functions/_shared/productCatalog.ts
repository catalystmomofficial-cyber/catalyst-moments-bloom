// Only fulfilled products belong here. Prices are cents, not browser input.
export const productCatalog: Record<string, { title: string; price: number }> = {
  'momodoro-planner': { title: 'The Momodoro Planner', price: 1200 },
  'busy-mom-self-care': { title: "The Busy Mom's Self-Care & Stress Relief System", price: 1700 },
};

export function productQuote(slug: string, points: number, balance: number) {
  const product = Object.hasOwn(productCatalog, slug) ? productCatalog[slug] : undefined;
  if (!product) throw new Error('Product is not available');
  if (!Number.isSafeInteger(points) || points < 0 || points > balance || points >= product.price) {
    throw new Error('Invalid points amount for cash checkout');
  }
  const amount = product.price - points;
  if (amount < 50) throw new Error('Card payment must be at least $0.50; use fewer points');
  return { ...product, amount };
}
