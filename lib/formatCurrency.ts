import { Currency } from "@/types/types";

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale = "sr-Latn",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
