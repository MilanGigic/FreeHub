export function clampContributionBase(
  amount: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(amount, min), max);
}

export function calculateHealth(
  base: number,
  rate: number,
  isWaived: boolean,
  minQuarterly?: number,
): number {
  if (isWaived) return 0;
  const calculated = base * rate;
  return minQuarterly ? Math.max(calculated, minQuarterly) : calculated;
}
