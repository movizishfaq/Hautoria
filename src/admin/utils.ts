import { formatPrice } from '../lib/formatPrice';

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function formatPKR(value: number) {
  return formatPrice(value);
}
