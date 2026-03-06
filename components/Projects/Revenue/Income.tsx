"use client";

import { fetchPaidInvoices } from "@/actions/invoices/fetchPaidInvoices";
import { addIncome } from "@/actions/projects/revenue/addIncome";
import { fetchIncomeData } from "@/actions/projects/revenue/fetchIncomeData";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Income() {
  const { user } = useAuth();
  const {
    selectedProject,
    revenueList,
    setRevenueList,
    paidInvoices,
    setPaidInvoices,
  } = useProjectStore();

  const [revenue, setRevenue] = useState<string>("0");
  const [revenueNote, setRevenueNote] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const res = await fetchIncomeData(selectedProject.id);

      if (res.success) {
        if (res.data) {
          if (res.data.length > 0) {
            setRevenueList(res.data);
          }
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [selectedProject, setRevenueList]);

  useEffect(() => {
    (async () => {
      if (!user || !selectedProject) return;
      const res = await fetchPaidInvoices(user.id, selectedProject.id);

      if (res.success) {
        if (res.data) {
          setPaidInvoices(res.data);
        }
      } else {
        console.error(res.error);
        toast.error(res.error as string);
      }
    })();
  }, [user, selectedProject, setPaidInvoices]);

  const handleAddRevenue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedProject || !revenue) return;

    const res = await addIncome(
      user.id,
      selectedProject.id,
      revenue,
      revenueNote,
    );

    if (res.success) {
      if (res.data) {
        setRevenueList([...revenueList, res.data]);
        setRevenue("0");
        setRevenueNote("");
        toast.success("Revenue added successfully");
      }
    } else {
      console.error(res.error);
      toast.error(res.error as string);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 w-full primary-slate">
      <form
        onSubmit={(e) => handleAddRevenue(e)}
        className="flex flex-col gap-2 md:gap-4 border-b-2 background-border pb-4"
      >
        <p className="text-lg primary-slate uppercase font-semibold">
          Revenue:
          <span className="primary-green">${revenue}</span>
        </p>

        <div>
          <label htmlFor="revenue">Revenue</label>
          <input
            type="number"
            id="revenue"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>

        <div>
          <label htmlFor="note">Note:</label>

          <input
            type="text"
            id="note"
            value={revenueNote}
            onChange={(e) => setRevenueNote(e.target.value)}
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>
        <button
          type="submit"
          className={`p-2 w-full border rounded-lg cursor-pointer transition-all
              border-(--accent-green) hover:bg-(--accent-green)/20
              `}
        >
          New Revenue
        </button>
      </form>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg primary-slate uppercase font-semibold">
            Revenue History:
          </h1>
          {revenueList.map((revenue) => (
            <div key={revenue.id} className="flex">
              <h1 className="primary-green">${revenue.amount}</h1>
              <p className="text-secondary text-sm font-semibold">
                {revenue.note}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg primary-slate uppercase font-semibold">
            Paid Invoices:
          </h1>

          {paidInvoices.map((invoice) => (
            <div key={invoice.id} className="flex">
              <h1 className="primary-green">${invoice.totalAmount}</h1>
              <p className="text-secondary text-sm font-semibold">
                {invoice.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
