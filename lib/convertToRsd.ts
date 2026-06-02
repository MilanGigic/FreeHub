import { Currency } from "@/types/types";

export function convertToRsd(amount: number, currency: Currency) {
  if (!amount || !currency) {
    throw new Error("Both amount and currency parameters needed!");
  }

  let amountInRsd;

  // switch (currency) {
  //   case "CAD"
  // }
}
