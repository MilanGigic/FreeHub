export type RsdRates = Record<string, number>;

export function convertMinor(
  amountMinor: number,
  from: string,
  to: string,
  rates: RsdRates,
): number {
  if (from === to) return amountMinor;
  const inRsd = amountMinor * rates[from]; // from -> RSD
  return Math.round(inRsd / rates[to]); // RSD -> target
}

export function formatMoney(
  amountMinor: number,
  from: string,
  to: string,
  rates: RsdRates,
  locale = "sr-RS",
): string {
  return formatMinor(convertMinor(amountMinor, from, to, rates), to, locale);
}

export function safeRate(rate: number): number {
  return rate > 0 && rate < 1 ? rate : 0;
}

/** Format minor units in a currency, without converting. */
export function formatMinor(
  amountMinor: number,
  currency: string,
  locale = "sr-RS",
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amountMinor / 100,
  );
}

/** "123.45" | 123.45 | null -> 12345 */
export function toMinor(amount: string | number | null | undefined): number {
  return Math.round(Number(amount || 0) * 100);
}
