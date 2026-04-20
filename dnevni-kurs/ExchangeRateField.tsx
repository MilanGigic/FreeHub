"use client";

/**
 * ExchangeRateField
 *
 * Drop-in component for your transaction form.
 * Shows the NBS middle rate automatically.
 * If unavailable, shows a manual entry form with a link to NBS website.
 */

import { useState } from "react";
import { useExchangeRate } from "@/lib/hooks/use-exchange-rate";

interface Props {
  date:     string;   // YYYY-MM-DD
  currency: string;   // "USD", "EUR", …
  /** Called with the final middle rate whenever it changes */
  onRate?: (rate: number | null) => void;
}

export function ExchangeRateField({ date, currency, onRate }: Props) {
  const {
    middleRate,
    isVerified,
    isForwardFilled,
    sourceDate,
    needsManualEntry,
    loading,
    error,
    submitManualRate,
    refresh,
  } = useExchangeRate(date, currency);

  const [manualInput, setManualInput]   = useState("");
  const [submitting,  setSubmitting]    = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  // Notify parent whenever the rate resolves
  if (middleRate !== null) {
    onRate?.(middleRate);
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        Preuzimanje kursa NBS…
      </div>
    );
  }

  // ── Rate found ─────────────────────────────────────────────────────────────
  if (middleRate !== null && !needsManualEntry) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-green-800">
            1 {currency} = {middleRate.toFixed(4)} RSD
          </span>
          <span className="text-xs text-green-600">
            {isForwardFilled
              ? `Preneseno sa ${sourceDate} (vikend/praznik)`
              : isVerified
              ? "✓ NBS srednji kurs"
              : "Ručno unesen"}
          </span>
        </div>
        {isForwardFilled && (
          <p className="mt-1 text-xs text-green-700">
            Za vikende i praznike važi kurs poslednjeg radnog dana (NBS pravilo).
          </p>
        )}
      </div>
    );
  }

  // ── Manual entry needed ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const value = parseFloat(manualInput.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setSubmitError("Unesite ispravan kurs (npr. 108.45)");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const ok = await submitManualRate(value);
    setSubmitting(false);

    if (!ok) {
      setSubmitError("Greška pri čuvanju kursa. Pokušajte ponovo.");
    } else {
      onRate?.(value);
    }
  };

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
      {/* Warning banner */}
      <div className="mb-2 flex items-start gap-2">
        <span className="text-amber-500" aria-hidden>⚠️</span>
        <p className="text-amber-800">
          Trenutno ne možemo da povučemo zvanični NBS kurs za {currency} na dan {date}.{" "}
          Molimo unesite ga ručno.
        </p>
      </div>

      {/* Link to NBS */}
      <a
        href="https://www.nbs.rs/sr_Latn/finansijske_institucije/medjunarodne_finansije/kursna_lista/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-800"
      >
        Pogledajte kursnu listu na sajtu NBS →
      </a>

      {/* Input */}
      <div className="flex items-center gap-2">
        <label htmlFor="manual-rate" className="shrink-0 text-gray-700">
          1 {currency} =
        </label>
        <input
          id="manual-rate"
          type="number"
          step="0.0001"
          min="0"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="npr. 108.4521"
          className="w-36 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
        <span className="text-gray-700">RSD</span>

        <button
          onClick={handleSubmit}
          disabled={submitting || !manualInput}
          className="ml-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Čuvanje…" : "Sačuvaj"}
        </button>

        <button
          onClick={refresh}
          className="text-xs text-gray-500 underline hover:text-gray-700"
        >
          Pokušaj ponovo
        </button>
      </div>

      {submitError && (
        <p className="mt-1 text-xs text-red-600">{submitError}</p>
      )}

      <p className="mt-2 text-xs text-amber-700">
        Napomena: Ručno unesen kurs biće označen kao neverifikovan u vašim poreskim izveštajima.
      </p>
    </div>
  );
}
