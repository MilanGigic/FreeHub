// lib/useRates.ts
"use client";

import { getRates } from "@/actions/translateCurrency";
import type { RsdRates } from "@/lib/currency";
import { useEffect, useState } from "react";

/** Loads NBS rates for every currency passed in; refetches when the set changes. */
export function useRates(currencies: (string | null | undefined)[]) {
  // Collapse to a stable string so a new array each render doesn't retrigger the effect
  const key = [...new Set(currencies.filter((c): c is string => !!c))]
    .sort()
    .join(",");

  const [rates, setRates] = useState<RsdRates | null>(null);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    getRates(key.split(","))
      .then((r) => {
        if (!cancelled) setRates(r);
      })
      .catch((e) => console.error("Failed to load exchange rates", e));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return rates; // null while loading or if loading failed
}
