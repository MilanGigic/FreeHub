"use client";
import { useState, useEffect } from "react";
import {
  type SimulationInput,
  type SimulationResult,
} from "@/utils/simulateCashFlow";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/useAuth";
import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";
import { useDataStore } from "@/lib/store/useDataStore";
import { Currency } from "@/types/types";
import { useTranslations } from "next-intl";
import CommitSimulation from "./CommitSimulation";
import Simulation from "./Simulation";

export const EMPTY_FORM: SimulationInput = {
  type: "expense",
  amount: 0,
  isRecurring: false,
  note: "",
  deductible: false,
  merchant: "",
  title: "",
  projectId: "",
  clientId: "",
  transactionDate: "",
  currency: "USD" as Currency,
};

export default function TransactionSimulator() {
  const { user } = useAuth();
  const tCommon = useTranslations("common");
  const [form, setForm] = useState<SimulationInput>(EMPTY_FORM);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [committed, setCommitted] = useState<boolean>(false);
  const [realTransaction, setRealTransaction] = useState<boolean>(false);

  const { setTransactions } = useDataStore();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchRecentTransactions(user.id);
      if (res.success) {
        if (res.data) {
          setTransactions(res.data);
        }
      } else {
        toast.error(res.error?.message || tCommon("anErrorOccurred"));
      }
    })();
  }, [user, setTransactions, tCommon]);

  return (
    <div className="w-full p-px bg-linear-to-b from-(--accent-cyan) via-(--background-elevated) to-(--background-sidebar) rounded-lg">
      {!realTransaction ? (
        <Simulation
          form={form}
          setForm={setForm}
          result={result}
          setResult={setResult}
          setCommitted={setCommitted}
          setRealTransaction={setRealTransaction}
          committed={committed}
        />
      ) : (
        <CommitSimulation
          user={user}
          form={form}
          setForm={setForm}
          result={result}
          setResult={setResult}
          setCommitted={setCommitted}
          setRealTransaction={setRealTransaction}
        />
      )}
    </div>
  );
}
