"use client";

import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
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

export default function KnjigasCard3({
  isPayingPersonalSalary,
  setIsPayingPersonalSalary,
  setPersonalSalary,
  setAverageAnnualSalary,
  setNumberOfClients,
  isLessThan40,
  setIsLessThan40,
  activeMonths,
  setActiveMonths,
}: {
  isPayingPersonalSalary: boolean;
  setIsPayingPersonalSalary: (value: boolean) => void;
  setPersonalSalary: (value: number) => void;
  setAverageAnnualSalary: (value: number) => void;
  setNumberOfClients: (value: number) => void;
  isLessThan40: boolean;
  setIsLessThan40: (value: boolean) => void;
  activeMonths: number | null;
  setActiveMonths: (value: number | null) => void;
}) {
  const [personalSalaryDisplayValue, setPersonalSalaryDisplayValue] =
    useState<string>("");
  const [averageAnnualSalaryDisplayValue, setAverageAnnualSalaryDisplayValue] =
    useState<string>("");

  const formatNumber = (value: string): string => {
    // Strip everything except digits
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Format using Serbian locale — uses . as thousands separator
    return Number(digits).toLocaleString("sr-RS");
  };

  const handleIncomeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "personalSalary" | "averageAnnualSalary",
  ) => {
    const formatted = formatNumber(e.target.value);
    if (key === "personalSalary") {
      setPersonalSalaryDisplayValue(formatted);
    } else if (key === "averageAnnualSalary") {
      setAverageAnnualSalaryDisplayValue(formatted);
    }

    // Store raw number for calculations
    const raw = Number(e.target.value.replace(/\D/g, ""));
    if (key === "personalSalary") {
      setPersonalSalary(raw);
    } else if (key === "averageAnnualSalary") {
      setAverageAnnualSalary(raw);
    }
  };
  return (
    <div className="w-full max-w-md bg-(--background-elevated) p-6 flex flex-col gap-3">
      <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            01
          </span>
          <h1 className="text-primary text-lg font-semibold">
            Da li isplaćujete ličnu zaradu?
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPayingPersonalSalary(true)}
              className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
                    ${
                      isPayingPersonalSalary
                        ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                        : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
                    }`}
            >
              Da
            </button>
            <button
              onClick={() => setIsPayingPersonalSalary(false)}
              className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isPayingPersonalSalary
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
            >
              Ne
            </button>
          </div>
          {isPayingPersonalSalary && (
            <Input
              placeholder="Iznos"
              className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
              onChange={(e) => handleIncomeChange(e, "personalSalary")}
              value={personalSalaryDisplayValue}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
        <div className="flex items-center gap-3 mb-1 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            02
          </span>
          <h1 className="text-primary text-lg font-semibold text-center">
            Procenjeni godišnji prihod
          </h1>
        </div>
        <Field orientation="horizontal">
          <FieldContent>
            <Input
              type="string"
              placeholder="Iznos"
              className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
              onChange={(e) => handleIncomeChange(e, "averageAnnualSalary")}
              value={averageAnnualSalaryDisplayValue}
            />
          </FieldContent>
        </Field>
      </div>
      <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
        <div className="flex items-center gap-3 mb-1 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            03
          </span>
          <h1 className="text-primary text-lg font-semibold text-center flex flex-col gap-1">
            Sa koliko klijenata poslujete?{" "}
            <span className="text-xs primary-slate font-semibold">
              (pitamo zbog testa nezavisnosti / možete preskočiti)
            </span>
          </h1>
        </div>
        <Field orientation="horizontal">
          <FieldContent>
            <Input
              type="string"
              placeholder="Broj klijenata"
              className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
              onChange={(e) => setNumberOfClients(Number(e.target.value))}
            />
          </FieldContent>
        </Field>
      </div>
      <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            04
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
      <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
            05
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
    </div>
  );
}
