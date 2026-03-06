"use client";

import { addInvoice, addToDrafts } from "@/actions/invoices/addInvoice";
import { fetchAllClientProjects } from "@/actions/projects/fetchAllClientProjects";
import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { Project } from "@/types/types";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NewInvoiceForm() {
  const { user } = useAuth();
  const { selectedClient } = useClientStore();
  const { projects, setProjects } = useDataStore();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const {
    invoices,
    setInvoices,
    amount,
    setAmount,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    note,
    setNote,
    setOutstandingInvoices,
    setOverdueInvoices,
    setPaidInvoices,
  } = useInvoiceStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!selectedClient || !user) return;

      const res = await fetchAllClientProjects(selectedClient.id, user.id);
      if (res.success) {
        if (res.data) {
          setProjects(res.data);
        }
      }
    })();
  }, [selectedClient, setProjects, user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submit triggered for new invoice.");

    if (!selectedClient || !user || !selectedProject) {
      console.log("No selected client found. Exiting submission handler.");
      return;
    }

    if (isSubmitting) {
      console.log(
        "Invoice submission already in progress. Ignoring duplicate submit.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Calling addInvoice with values:", {
        amount,
        issueDate,
        dueDate,
        note,
        clientId: selectedClient.id,
        projectId: selectedProject.id,
      });
      const res = await addInvoice(
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
        user.id,
        selectedProject.id,
      );

      if (!res.success) {
        console.log("Invoice creation failed:", res.error);
        toast.error(res.error);
      } else if (res.data) {
        console.log(
          "Invoice created successfully. Updating state with new invoice.",
        );
        setInvoices([...invoices, res.data]);
        if (res.outstandingInvoices) {
          setOutstandingInvoices(res.outstandingInvoices);
        }
        if (res.overdueInvoices) {
          setOverdueInvoices({
            data: res.overdueInvoices.data,
            count: res.overdueInvoices.count,
          });
        }
        if (res.paidInvoices) {
          setPaidInvoices(res.paidInvoices);
        }
        toast.success("Invoice created successfully");
        setSelectedProject(null);
        setAmount("");
        setIssueDate(new Date());
        setDueDate(new Date());
        setNote("");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToDrafts = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedClient || !user || !selectedProject) return;
    console.log("Calling addToDrafts with values:", {
      amount,
      issueDate,
      dueDate,
      note,
      clientId: selectedClient.id,
      projectId: selectedProject.id,
    });

    try {
      const res = await addToDrafts(
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
        user.id,
        selectedProject.id,
      );

      if (!res.success) {
        toast.error(res.error as string);
        console.log("Error adding to drafts:", res.error);
      } else if (res.data) {
        setInvoices([...invoices, res.data]);
        toast.success("Invoice added to drafts successfully");
        setSelectedProject(null);
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
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
        />
      </div>
      {/*  */}

      {/* PROJECT SELECTION */}
      <div>
        <label
          htmlFor="project"
          className="primary-slate font-semibold uppercase"
        >
          Project:
        </label>
        <select
          id="project"
          name="project"
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
          value={selectedProject ? selectedProject.id : ""}
          onChange={(e) => {
            const project = projects.find((p) => p.id === e.target.value) as
              | Project
              | undefined;
            if (project) {
              setSelectedProject(project);
              console.log("Selected project:", project);
            }
          }}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
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
            className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
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
            className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
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
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
        />
      </div>
      {/*  */}

      {/* BUTTONS */}
      <div className="flex gap-2 md:gap-4 justify-between w-full">
        <button
          type="submit"
          disabled={isSubmitting}
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
