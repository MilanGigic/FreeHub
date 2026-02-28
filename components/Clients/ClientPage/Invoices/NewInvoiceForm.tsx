"use client";

import { addInvoice, addToDrafts } from "@/actions/invoices/addInvoice";
import { useClientStore } from "@/lib/store/useClientStore";
import { FormEvent, MouseEvent, useState } from "react";
import { toast } from "react-toastify";

export default function NewInvoiceForm() {
  const { selectedClient, invoices, setInvoices } = useClientStore();

  const [amount, setAmount] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [note, setNote] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submit triggered for new invoice.");

    if (!selectedClient) {
      console.log("No selected client found. Exiting submission handler.");
      return;
    }

    try {
      console.log("Calling addInvoice with values:", {
        amount,
        issueDate,
        dueDate,
        note,
        clientId: selectedClient.id,
      });
      const res = await addInvoice(
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
      );

      if (!res.success) {
        console.log("Invoice creation failed:", res.error);
        toast.error(res.error);
      } else if (res.data) {
        console.log(
          "Invoice created successfully. Updating state with new invoice.",
        );
        setInvoices([...invoices, res.data]);
        toast.success("Invoice created successfully");
        setAmount("");
        setIssueDate(new Date());
        setDueDate(new Date());
        setNote("");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  const handleAddToDrafts = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedClient) return;

    try {
      const res = await addToDrafts(
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
      );

      if (!res.success) {
        toast.error(res.error as string);
      } else if (res.data) {
        setInvoices([...invoices, res.data]);
        toast.success("Invoice added to drafts successfully");
        setAmount("");
        setIssueDate(new Date());
        setDueDate(new Date());
        setNote("");
      }
    } catch (error) {
      console.error("Error adding to drafts:", error);
      toast.error(error as string);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 max-w-2xl w-full"
    >
      {/* AMOUNT INPUT */}
      <div>
        <label
          htmlFor="amount"
          className="primary-slate font-semibold uppercase"
        >
          Amount:
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border background-border rounded-lg"
        />
      </div>
      {/*  */}

      {/* DATE INPUTS */}
      <div className="flex gap-2 md:gap-4 justify-between w-full">
        <div className="w-full">
          <label
            htmlFor="issueDate"
            className="primary-slate font-semibold uppercase"
          >
            Issue Date:
          </label>
          <input
            type="date"
            id="issueDate"
            value={issueDate.toISOString().split("T")[0]}
            onChange={(e) => setIssueDate(new Date(e.target.value))}
            required
            className="w-full p-2 border background-border rounded-lg"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="dueDate"
            className="primary-slate font-semibold uppercase"
          >
            Due Date:
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate.toISOString().split("T")[0]}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            required
            className="w-full p-2 border background-border rounded-lg"
          />
        </div>
      </div>
      {/*  */}

      {/* NOTE INPUT */}
      <div>
        <label htmlFor="note" className="primary-slate font-semibold uppercase">
          Note:
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border background-border rounded-lg"
        />
      </div>
      {/*  */}

      {/* BUTTONS */}
      <div className="flex gap-2 md:gap-4 justify-between w-full">
        <button
          type="submit"
          className="rounded-lg background-elevated border w-full px-4 py-2 outline-none border-(--accent-green) transition-all cursor-pointer primary-slate uppercase font-semibold hover:bg-(--accent-green)/40"
        >
          Create Invoice
        </button>
        <button
          type="button"
          onClick={(e) => handleAddToDrafts(e)}
          className="rounded-lg background-elevated border w-full px-4 py-2 outline-none border-(--accent-purple) transition-all cursor-pointer primary-slate uppercase font-semibold hover:bg-(--accent-purple)/40"
        >
          Save as Draft
        </button>
      </div>
      {/*  */}
    </form>
  );
}
