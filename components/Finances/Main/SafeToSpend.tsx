import {
  BanknoteArrowDown,
  DollarSign,
  HandCoins,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function SafeToSpend() {
  const [price, setPrice] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // Safely evaluate mathematical expressions
  const evaluateExpression = (expression: string): number | null => {
    if (!expression.trim()) return null;

    try {
      // Remove commas and spaces, keep only allowed characters: digits, operators, parentheses, and decimal points
      const cleaned = expression.replace(/[^0-9+\-*/().\s]/g, "");

      // Validate expression contains only allowed characters
      if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) return null;

      // Use Function constructor to safely evaluate the expression
      // This is safer than eval() but still requires careful validation
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

    // Allow digits, operators (+, -, *, /), parentheses, decimal points, spaces, and commas
    // Remove commas for internal storage but allow them in display
    const cleaned = inputValue.replace(/,/g, "");

    // Validate: only allow digits, operators, parentheses, decimal points, and spaces
    if (cleaned && !/^[0-9+\-*/().\s]*$/.test(cleaned)) {
      return; // Invalid character, don't update
    }

    setPrice(cleaned);

    // Calculate the result in real-time
    const result = evaluateExpression(cleaned);
    setCalculatedPrice(result);
  };

  const handleBlur = () => {
    if (price) {
      const result = evaluateExpression(price);
      if (result !== null) {
        setPrice(result.toFixed(2));
        setCalculatedPrice(result);
      }
    }
  };

  return (
    <div className="w-full h-full p-px bg-linear-to-b from-[var(--accent-cyan)] via-[var(--border-default)] to-[var(--bg-main)] rounded-lg">
      <div className="w-full h-full flex flex-col background-border rounded-lg p-4 background-elevated gap-4">
        <header className="w-full flex flex-col border-b-2 background-border pb-4">
          <h1 className="text-2xl font-base uppercase flex flex-col justify-center text-secondary">
            Safe to Spend:
            <span className="primary-cyan text-4xl font-bold">$1,200</span>
          </h1>
        </header>

        <section className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 w-full text-secondary shadow-lg shadow-black/10 dark:shadow-black/30">
          <h1 className="flex items-center gap-2">
            <Star className="primary-green" />
            Reserved:{" "}
            <span className="primary-green text-lg font-bold">$6,400</span>
          </h1>
          <h1 className="flex items-center gap-2">
            <BanknoteArrowDown className="primary-red" />
            Upcoming expenses:{" "}
            <span className="primary-red text-lg font-bold">$1,200</span>
          </h1>
          <h1 className="flex items-center gap-2">
            <ShieldCheck className="primary-purple" />
            Safety Buffer:
            <span className="primary-purple text-lg font-bold">$1,600</span>
          </h1>
        </section>

        <main className="w-full flex flex-col gap-2">
          <h1 className="text-lg font-semibold text-secondary">
            What if I buy a...
          </h1>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Enter Item Price (e.g., 100 + 50 or 200 * 1.5)"
              value={price}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e)}
              className="border background-border pl-8 p-2 text-primary outline-none focus-border-accent transition-all rounded-lg background-elevated w-full placeholder:text-tertiary"
            />
          </div>
          {calculatedPrice !== null && (
            <p className="text-sm text-secondary">
              Calculated:{" "}
              <span className="primary-green">
                $
                {calculatedPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          )}

          <div className="flex items-center gap-2">
            <HandCoins className="primary-cyan w-5 h-5" />
            <div>
              <h1 className="text-base font-medium text-secondary flex items-center gap-2">
                New Safe to Spend:
                <span className="primary-cyan text-lg font-bold">
                  {calculatedPrice !== null
                    ? `$${(1200 - calculatedPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "$1200"}
                </span>
              </h1>
              <p className="text-sm text-secondary">
                Cash buffer lasts:{" "}
                <span className="primary-indigo">
                  {/* {Math.floor((1200 - calculatedPrice!) / 1000)} days */}
                  27 days
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
