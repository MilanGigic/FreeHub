import {
  endOfYear,
  startOfYear,
  endOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { DateRange } from "react-day-picker";

export const regimeLabel: Record<string, string> = {
  frilenser: "Frilenser",
  pausal: "Paušalno oporezivanje",
  knjigas: "Knjigo­vodstveno preduzeće",
};

export const modelLabel: Record<string, string> = {
  modelA: "Model A — normirani troškovi",
  modelB: "Model B — stvarni troškovi",
};

export const businessModelLabel: Record<string, string> = {
  services: "Usluge",
  goods: "Roba",
  mixed: "Mešovito",
};

export function fmt(val: string | null | undefined) {
  if (!val) return "—";
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString("sr-RS") + " RSD";
}

export function getPresetRange(preset: string): DateRange {
  const now = new Date();

  switch (preset) {
    case "7d":
      return {
        from: subDays(now, 7),
        to: now,
      };

    case "30d":
      return {
        from: subDays(now, 30),
        to: now,
      };

    case "month":
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };

    case "year":
      return {
        from: startOfYear(now),
        to: endOfYear(now),
      };

    default:
      return {
        from: undefined,
        to: undefined,
      };
  }
}
