import { TAX_CONSTANTS } from "@/config/constants";

export function suggestModel(
  grossQuarterly: number,
  isInsuredElsewhere: boolean,
) {
  const c = TAX_CONSTANTS[2026];

  // Model A
  const taxableA = Math.max(0, grossQuarterly - c.MODEL_A_FIXED_QUARTER);
  const taxA = taxableA * c.TAX_RATE_A;
  const pioA = taxableA * c.PIO_RATE; // no floor
  const healthA = isInsuredElsewhere
    ? 0
    : Math.max(c.HEALTH_MIN_QUARTER, taxableA * c.HEALTH_RATE);
  const totalA = taxA + pioA + healthA;
  const netA = grossQuarterly - totalA;

  // Model B
  const standardizedB =
    c.MODEL_B_FIXED_PART + grossQuarterly * c.MODEL_B_PERCENT;
  const taxableB = Math.max(0, grossQuarterly - standardizedB);
  const taxB = taxableB * c.TAX_RATE_B;
  const pioCalculatedB = taxableB * c.PIO_RATE;
  const pioB = Math.max(pioCalculatedB, c.MODEL_B_PIO_MIN_QUARTER); // mandatory floor
  const healthB = isInsuredElsewhere
    ? 0
    : Math.max(c.HEALTH_MIN_QUARTER, taxableB * c.HEALTH_RATE);
  const totalB = taxB + pioB + healthB;
  const netB = grossQuarterly - totalB;

  const better = netB > netA ? "B" : "A";
  const difference = Math.abs(netB - netA);

  return {
    recommended: better,
    netA: Math.round(netA),
    netB: Math.round(netB),
    difference: Math.round(difference),
    reason:
      better === "A"
        ? "Model A has lower cost at this income level (no PIO minimum)"
        : "Model B becomes more efficient at higher income due to 10% tax + 34% deduction",
    note: "This matches the official calculator logic. Always verify on frilenseri.purs.gov.rs/kalkulator-poreza.html",
  };
}
