"use client";

import { addNewClient } from "@/actions/clients/addNewClient";
import { ClientForm } from "@/types/types";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function NewClientModal() {
  const [clientForm, setClientForm] = useState<ClientForm>({
    firstName: "",
    lastName: "",
    email: "",
    currency: "",
    status: "",
    startDate: "",
    endDate: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Client form:", clientForm);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const res = await addNewClient(clientForm);

    if (res.data) {
      if (res.success) {
        toast.success("Client added successfully");
        setIsLoading(false);
        setClientForm({
          firstName: "",
          lastName: "",
          email: "",
          currency: "",
          status: "",
          startDate: "",
          endDate: null,
        });
      }
      if (!res.success) {
        toast.error(res.error);
        setIsLoading(false);
      }
    } else {
      toast.error("An error occurred while adding client");
      setIsLoading(false);
      setError("An error occurred while adding client");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-green)]" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <h1 className="primary-red">{error}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full h-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4">
      <div className="w-full h-full flex flex-col gap-2 md:gap-4">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-2xl font-bold uppercase text-primary">
            Add New Client
          </h1>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-2 md:gap-4 w-full"
        >
          <div className="flex w-full justify-center gap-2 md:gap-4">
            <div className="flex flex-col gap-2 md:gap-4 w-full border-r-2 background-border px-4">
              <div className="flex flex-col gap-2 md:gap-4 w-full items-center">
                <label
                  htmlFor="firstName"
                  className="text-secondary uppercase font-semibold"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={clientForm.firstName ? clientForm.firstName : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, firstName: e.target.value })
                  }
                  className="rounded-md background-elevated w-full border background-border text-center p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 md:gap-4 w-full items-center">
                <label
                  htmlFor="lastName"
                  className="text-secondary uppercase font-semibold"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={clientForm.lastName ? clientForm.lastName : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, lastName: e.target.value })
                  }
                  className="rounded-md background-elevated border background-border w-full text-center p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 md:gap-4 w-full items-center">
                <label
                  htmlFor="email"
                  className="text-secondary uppercase font-semibold"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-md background-elevated border background-border w-full text-center p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.email ? clientForm.email : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:gap-4 w-full">
              <div className="flex gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <h1 className="text-secondary uppercase font-semibold">
                  Currency
                </h1>
                <select
                  name="currency"
                  id="currency"
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.currency ? clientForm.currency : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, currency: e.target.value })
                  }
                >
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="flex gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <h1 className="text-secondary uppercase font-semibold">
                  Status
                </h1>
                <select
                  name="status"
                  id="status"
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.status ? clientForm.status : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <label
                  htmlFor="startDate"
                  className="text-secondary uppercase font-semibold"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.startDate ? clientForm.startDate : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, startDate: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <label
                  htmlFor="endDate"
                  className="text-secondary uppercase font-semibold"
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.endDate ? clientForm.endDate : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg background-elevated border px-4 py-2 outline-none border-[var(--accent-green)] transition-all cursor-pointer text-primary font-semibold hover:bg-[var(--accent-green)]/20"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}
