import { Currency } from "@/types/types";

export const getCurrencySymbol = (currency: Currency) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "RSD":
      return "RSD";
    case "CAD":
      return "CA$";
  }
};
