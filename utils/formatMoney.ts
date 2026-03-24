export function formatMoney(value: string | null): string {
  const num = Number(value || 0);
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}k`;
  return `$${num.toFixed(2)}`;
}
