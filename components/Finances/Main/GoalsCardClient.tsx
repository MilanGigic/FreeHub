// components/finances/GoalsCardClient.tsx
"use client";
import { useEffect, useState, useTransition } from "react";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoalConservativeness,
} from "@/actions/finances/goals";
import {
  calculateSavedAmount,
  calculateWeeklyTarget,
} from "@/utils/calculateGoalProgress";
import { Trash2, Plus, Target } from "lucide-react";
import { Conservativeness, Goal } from "@/types/types";
import { useAuth } from "@/lib/useAuth";
import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";
import { toast } from "react-toastify";
import { useDataStore } from "@/lib/store/useDataStore";

const CONSERVATIVENESS_LABELS: Record<Conservativeness, string> = {
  conservative: "Conservative (50%)",
  moderate: "Moderate (75%)",
  aggressive: "Aggressive (100%)",
};

export default function GoalsCardClient() {
  const { user } = useAuth();
  const { transactions, setTransactions } = useDataStore();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    conservativeness: "moderate" as Conservativeness,
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await getGoals(user.id);
      if (res.success) {
        if (res.data) {
          setGoals(res.data);
        }
      } else {
        toast.error(res.error?.message || "An error occurred");
      }
      const transactionsRes = await fetchRecentTransactions(user.id);
      if (transactionsRes.success) {
        if (transactionsRes.data) {
          setTransactions(transactionsRes.data);
        }
      } else {
        toast.error(transactionsRes.error?.message || "An error occurred");
      }
    })();
  }, [user, setTransactions]);

  const handleCreate = () => {
    if (!form.name || !form.targetAmount) return;
    startTransition(async () => {
      if (!user) return;
      try {
        await createGoal(user.id, {
          name: form.name,
          targetAmount: Number(form.targetAmount),
          deadline: form.deadline ? new Date(form.deadline) : undefined,
          conservativeness: form.conservativeness,
        });

        const goalsRes = await getGoals(user.id);
        if (goalsRes.success) {
          if (goalsRes.data) {
            setGoals(goalsRes.data);
          }
        } else {
          toast.error(goalsRes.error?.message || "An error occurred");
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred");
      }
      setForm({
        name: "",
        targetAmount: "",
        deadline: "",
        conservativeness: "moderate",
      });
      setShowForm(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      if (!user) return;
      try {
        await deleteGoal(id);
        const goalsRes = await getGoals(user.id);
        if (goalsRes.success) {
          if (goalsRes.data) {
            setGoals(goalsRes.data);
          }
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred");
      }
    });
  };

  const handleConservativeness = (id: string, value: Conservativeness) => {
    startTransition(async () => {
      if (!user) return;
      try {
        await updateGoalConservativeness(id, value);
        const goalsRes = await getGoals(user.id);
        if (goalsRes.success) {
          if (goalsRes.data) {
            setGoals(goalsRes.data);
          }
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred");
      }
    });
  };

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
        <header className="flex items-center justify-between border-b-2 background-border pb-3">
          <div className="flex items-center gap-2">
            <Target size={14} className="primary-cyan" />
            <h1 className="text-lg font-semibold tracking-widest text-primary uppercase">
              Savings Goals
            </h1>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 text-xs primary-cyan hover:primary-cyan/80 transition-colors"
          >
            <Plus size={12} /> Add Goal
          </button>
        </header>

        {/* Add goal form */}
        {showForm && (
          <div className="flex flex-col gap-2 p-3 rounded-md bg-white/5 border border-white/10 text-xs">
            <input
              className="bg-transparent border border-white/10 rounded px-2 py-1.5 text-white placeholder-gray-500 outline-none focus:border-(--accent-cyan)"
              placeholder="Goal name (e.g. New Laptop)"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="bg-transparent border border-white/10 rounded px-2 py-1.5 text-white placeholder-gray-500 outline-none focus:border-(--accent-cyan)"
              placeholder="Target amount (e.g. 5000)"
              type="number"
              value={form.targetAmount}
              onChange={(e) =>
                setForm((f) => ({ ...f, targetAmount: e.target.value }))
              }
            />
            <input
              className="bg-transparent border border-white/10 rounded px-2 py-1.5 text-white outline-none focus:border-(--accent-cyan)"
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, deadline: e.target.value }))
              }
            />
            <select
              className="bg-[#0a0e14] border border-white/10 rounded px-2 py-1.5 text-white outline-none focus:border-(--accent-cyan)"
              value={form.conservativeness}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  conservativeness: e.target.value as Conservativeness,
                }))
              }
            >
              {(Object.keys(CONSERVATIVENESS_LABELS) as Conservativeness[]).map(
                (k) => (
                  <option key={k} value={k}>
                    {CONSERVATIVENESS_LABELS[k]}
                  </option>
                ),
              )}
            </select>
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="bg-(--accent-cyan) hover:bg-(--accent-cyan)/80 text-white rounded px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              Save Goal
            </button>
          </div>
        )}
        {isPending ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--accent-green)" />
          </div>
        ) : (
          // Goals list
          <div className="flex flex-col gap-3 overflow-y-auto max-h-72">
            {goals.length === 0 && (
              <p className="text-xs primary-slate text-center py-4">
                No goals yet — add one above.
              </p>
            )}
            {goals.map((goal) => {
              const target = Number(goal.targetAmount);
              const saved = calculateSavedAmount(
                transactions,
                goal.conservativeness,
              );
              const percent = Math.min(100, (saved / target) * 100);
              const weekly = calculateWeeklyTarget(
                target,
                saved,
                goal.deadline,
              );

              return (
                <div
                  key={goal.id}
                  className="flex flex-col gap-1.5 p-3 rounded-md background-elevated border background-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {goal.name}
                    </span>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="primary-slate hover:text-(--accent-red) transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--accent-cyan) rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="primary-cyan font-medium">
                      ${saved.toLocaleString()}
                    </span>
                    <span>
                      of ${target.toLocaleString()} ({percent.toFixed(0)}%)
                    </span>
                  </div>

                  {weekly && (
                    <p className="text-xs primary-slate">
                      Save{" "}
                      <span className="primary-amber">
                        ${weekly.toFixed(0)}/wk
                      </span>{" "}
                      to hit deadline
                    </p>
                  )}

                  {/* Conservativeness toggle */}
                  <div className="flex gap-1 mt-1">
                    {(
                      Object.keys(CONSERVATIVENESS_LABELS) as Conservativeness[]
                    ).map((k) => (
                      <button
                        key={k}
                        onClick={() => handleConservativeness(goal.id, k)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          goal.conservativeness === k
                            ? "border-(--accent-cyan) text-primary bg-(--accent-cyan)/10"
                            : "border-white/10 primary-slate hover:border-white/20"
                        }`}
                      >
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
