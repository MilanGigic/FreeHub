"use client";

/**
 * useExchangeRate
 *
 * Fetches the NBS middle rate for a given (date, currency) pair.
 * If the rate is unavailable (NBS down, weekend gap not filled yet),
 * exposes `needsManualEntry` so the UI can prompt the user.
 */

import { useState, useEffect, useCallback } from "react";

export interface ExchangeRateState {
  middleRate:      number | null;
  isVerified:      boolean;
  isForwardFilled: boolean;
  sourceDate:      string | null;
  needsManualEntry: boolean;
  loading:         boolean;
  error:           string | null;
}

export function useExchangeRate(date: string, currency: string): ExchangeRateState & {
  submitManualRate: (rate: number) => Promise<boolean>;
  refresh: () => void;
} {
  const [state, setState] = useState<ExchangeRateState>({
    middleRate:      null,
    isVerified:      false,
    isForwardFilled: false,
    sourceDate:      null,
    needsManualEntry: false,
    loading:         false,
    error:           null,
  });

  const fetchRate = useCallback(async () => {
    if (!date || !currency) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res  = await fetch(`/api/exchange-rates/manual?date=${date}&currency=${currency}`);
      const data = await res.json();

      if (res.ok && data.found) {
        setState({
          middleRate:       data.middleRate,
          isVerified:       data.isVerified,
          isForwardFilled:  data.isForwardFilled,
          sourceDate:       data.sourceDate,
          needsManualEntry: false,
          loading:          false,
          error:            null,
        });
      } else {
        // Rate not found — ask user to enter manually
        setState({
          middleRate:       null,
          isVerified:       false,
          isForwardFilled:  false,
          sourceDate:       null,
          needsManualEntry: true,
          loading:          false,
          error:            data.message ?? "Kurs nije dostupan.",
        });
      }
    } catch {
      setState((s) => ({
        ...s,
        needsManualEntry: true,
        loading:          false,
        error:            "Greška pri preuzimanju kursa. Proverite internet konekciju.",
      }));
    }
  }, [date, currency]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const submitManualRate = async (rate: number): Promise<boolean> => {
    try {
      const res = await fetch("/api/exchange-rates/manual", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ date, currency, middleRate: rate }),
      });

      if (!res.ok) return false;

      // Re-fetch to show the saved value
      await fetchRate();
      return true;
    } catch {
      return false;
    }
  };

  return { ...state, submitManualRate, refresh: fetchRate };
}
