"use client";
import { fetchUserTransactions } from "@/actions/taxProfile/fetchUserTransactions";
import { useDataStore } from "@/lib/store/useDataStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useAuth } from "@/lib/useAuth";
import {
  BanknoteArrowDown,
  DollarSign,
  HandCoins,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SafeToSpend() {
  const { user } = useAuth();
  const { balance } = useDataStore();
  const { safeToSpend, taxReserved, computeSafeToSpend } = useTaxProfileStore();

  const [price, setPrice] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [upcomingExpenses, setUpcomingExpenses] = useState<number>(0);

  // Load real upcoming expenses
  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchUserTransactions(user.id, "expense");
      if (res.success && res.total !== undefined) {
        setUpcomingExpenses(res.total);
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [user]);

  // Auto-compute using your preferred simple logic (balance * 0.2)
  useEffect(() => {
    if (balance) {
      computeSafeToSpend({
        currentBalance: Number(balance),
        avgMonthlyExpenses: upcomingExpenses, // only used for burn rate
        bufferMultiplier: 0.2, // keeps your original 45-day behavior
      });
    }
  }, [balance, upcomingExpenses, computeSafeToSpend]);

  // === Safely evaluate mathematical expressions (your original function) ===
  const evaluateExpression = (expression: string): number | null => {
    if (!expression.trim()) return null;
    try {
      const cleaned = expression.replace(/[^0-9+\-*/().\s]/g, "");
      if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) return null;
      const result = Function(`"use strict"; return (${cleaned})`)();
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleaned = inputValue.replace(/,/g, "");
    setPrice(inputValue);

    const result = evaluateExpression(cleaned);
    setCalculatedPrice(result);
  };

  const handleBlur = () => {
    if (price) {
      const result = evaluateExpression(price.replace(/,/g, ""));
      if (result !== null) {
        setPrice(result.toFixed(2));
        setCalculatedPrice(result);
      }
    }
  };

  // "What if I buy a..." live simulator
  const newSafeToSpend =
    calculatedPrice !== null
      ? Math.max(0, safeToSpend - calculatedPrice)
      : safeToSpend;

  // Safety buffer = 20% of balance (your original favorite)
  const safetyBuffer = Number(balance) * 0.2;

  const newSafetyBuffer =
    calculatedPrice !== null
      ? Math.max(0, safetyBuffer - calculatedPrice)
      : safetyBuffer;

  const dailyBurnRate = upcomingExpenses > 0 ? upcomingExpenses / 30 : 1;
  const newCashBufferDays = Math.max(
    0,
    Math.floor(newSafetyBuffer / dailyBurnRate),
  );

  return (
    <div className="w-full h-full p-px bg-linear-to-b from-(--accent-cyan) via-(--border-default) to-(--bg-main) rounded-lg">
      <div className="w-full h-full flex flex-col background-border rounded-lg p-4 background-elevated gap-4">
        <header className="w-full flex flex-col border-b-2 background-border pb-4">
          <h1 className="text-2xl font-base uppercase flex flex-col justify-center primary-slate">
            Safe to Spend:
            <span className="primary-cyan text-4xl font-bold">
              $
              {safeToSpend.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </h1>
        </header>

        <section className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 w-full primary-slate shadow-lg shadow-black/10 dark:shadow-black/30">
          <h1 className="flex items-center gap-2">
            <Star className="primary-amber" />
            Reserved:{" "}
            <span className="primary-amber text-lg font-bold">
              $
              {taxReserved.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </h1>
          <h1 className="flex items-center gap-2">
            <BanknoteArrowDown className="primary-red" />
            Upcoming expenses:{" "}
            <span className="primary-red text-lg font-bold">
              ${upcomingExpenses.toFixed(2)}
            </span>
          </h1>
          <h1 className="flex items-center gap-2">
            <ShieldCheck className="primary-purple" />
            Safety Buffer:{" "}
            <span className="primary-purple text-lg font-bold">
              ${safetyBuffer.toFixed(2)}
            </span>
          </h1>
          <h1 className="flex items-center gap-2">
            Cash buffer lasts:{" "}
            <span className="primary-indigo text-lg font-bold">
              {Math.floor(safetyBuffer / dailyBurnRate)} days
            </span>
          </h1>
        </section>

        <main className="w-full flex flex-col gap-2">
          <h1 className="text-lg font-semibold primary-slate">
            What if I buy a...
          </h1>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 primary-slate" />
            <input
              type="text"
              placeholder="Enter Item Price (e.g., 100 + 50 or 200 * 1.5)"
              value={price}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border background-border pl-8 p-2 text-primary outline-none focus-border-accent transition-all rounded-lg background-elevated w-full placeholder:text-tertiary"
            />
          </div>

          {calculatedPrice !== null && (
            <div className="text-sm primary-slate space-y-1">
              <p>
                New Safe to Spend:{" "}
                <span className="primary-green font-bold">
                  $
                  {newSafeToSpend.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p>
                Cash buffer lasts:{" "}
                <span className="primary-indigo font-bold">
                  {newCashBufferDays} days
                </span>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
