"use client";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function FrilenserCard3({
  activeMonths,
  setActiveMonths,
  setGrossAnnualIncome,
  isLessThan40,
  setIsLessThan40,
}: {
  activeMonths: number | null;
  setActiveMonths: (value: number | null) => void;
  setGrossAnnualIncome: (value: number) => void;
  isLessThan40: boolean;
  setIsLessThan40: (value: boolean) => void;
}) {
  const [displayValue, setDisplayValue] = useState<string>("");

  const formatNumber = (value: string): string => {
    // Strip everything except digits
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Format using Serbian locale — uses . as thousands separator
    return Number(digits).toLocaleString("sr-RS");
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);

    setDisplayValue(formatted);

    const raw = Number(e.target.value.replace(/\D/g, ""));
    setGrossAnnualIncome(raw);
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center h-full justify-center">
      {/* Question 1 — Months worked */}
      <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            01
          </span>
          <h1 className="text-primary text-lg font-semibold">
            Koliko meseci ste radili?
          </h1>
        </div>
        <Select
          value={activeMonths ? String(activeMonths) : "1"}
          onValueChange={(value) => setActiveMonths(Number(value))}
        >
          <SelectTrigger className="w-full text-primary text-base font-medium border border-(--background-border) rounded-xl bg-transparent px-4 py-3">
            <SelectValue
              placeholder="Izaberite broj meseci"
              className="text-primary"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: 12 }, (_, index) => (
                <SelectItem key={index} value={String(index + 1)}>
                  {index + 1}{" "}
                  {index + 1 === 1
                    ? "mesec"
                    : index + 1 < 5
                      ? "meseca"
                      : "meseci"}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Question 2 — Quarterly income */}
      <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            02
          </span>
          <FieldLabel className="text-primary text-lg font-semibold">
            Iznos iz poslednjeg kvartala
          </FieldLabel>
        </div>
        <div className="w-full">
          <Input
            type="string"
            placeholder="0.00"
            className="w-full pl-14 text-left text-base bg-transparent border border-(--background-border) rounded-xl p-3 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan) transition-colors"
            onChange={(e) => handleIncomeChange(e)}
            value={displayValue}
          />
        </div>
      </div>

      {/* Question 3 — Age check */}
      <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            03
          </span>
          <FieldLabel className="text-primary text-lg font-semibold">
            Da li imate manje od 40 godina?
          </FieldLabel>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsLessThan40(true)}
            className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                isLessThan40
                  ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
          >
            Da
          </button>
          <button
            onClick={() => setIsLessThan40(false)}
            className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isLessThan40
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
          >
            Ne
          </button>
        </div>
      </div>
    </div>
  );
}
