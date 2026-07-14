export function formatPrice(value: number): string {
  return `Rs. ${value.toLocaleString('en-PK')}`;
}

export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round((1 - price / compareAtPrice) * 100);
}
