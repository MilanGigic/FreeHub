"use client";

import { addNewClient } from "@/actions/clients/addNewClient";
import { useClientStore } from "@/lib/store/useClientStore";
import { useAuth } from "@/lib/useAuth";
import { ClientForm } from "@/types/types";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function NewClientModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { setClients } = useClientStore();
  const t = useTranslations("clients");
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (!user) redirect("/login");

    const res = await addNewClient(clientForm, user.id);

    if (res.data) {
      if (res.success) {
        setClients(res.data);
        toast.success(t("clientAddedSuccess"));
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
      toast.error(t("clientAddedError"));
      setIsLoading(false);
      setError(t("clientAddedError"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--accent-green)" />
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
    <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 absolute top-12 right-0 primary-slate animate-flip-down animate-duration-1500 animate-ease-out z-50 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <button onClick={onClose}>
        <X size={20} className="text-primary hover:cursor-pointer" />
      </button>
      <div className="w-full flex flex-col gap-2 md:gap-4">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-2xl font-bold uppercase text-primary">
            {t("addNewClient")}
          </h1>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-2 md:gap-4 w-full"
        >
          <div className="flex flex-col sm:flex-row w-full justify-center gap-2 md:gap-4">
            <div className="flex flex-col gap-2 md:gap-4 w-full border-r-2 background-border px-4">
              <div className="flex flex-col gap-2 md:gap-4 w-full items-center">
                <label
                  htmlFor="firstName"
                  className="text-primary uppercase font-semibold"
                >
                  {t("firstName")}
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder={t("firstName")}
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
                  className="text-primary uppercase font-semibold"
                >
                  {t("lastName")}
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder={t("lastName")}
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
                  className="text-primary uppercase font-semibold"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t("emailLabel")}
                  className="rounded-md background-elevated border background-border w-full text-center p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.email ? clientForm.email : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:gap-4 w-full">
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <h1 className="text-primary uppercase font-semibold">
                  {t("currency")}
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
                  <option value="">{t("selectCurrency")}</option>
                  <option value="USD">{t("usd")}</option>
                  <option value="EUR">{t("eur")}</option>
                  <option value="GBP">{t("gbp")}</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <h1 className="text-primary uppercase font-semibold">{t("statusLabel")}</h1>
                <select
                  name="status"
                  id="status"
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
                  value={clientForm.status ? clientForm.status : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, status: e.target.value })
                  }
                >
                  <option value="">{t("selectStatus")}</option>
                  <option value="active">{t("active")}</option>
                  <option value="paused">{t("paused")}</option>
                  <option value="archived">{t("archived")}</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <label
                  htmlFor="startDate"
                  className="text-primary uppercase font-semibold"
                >
                  {t("startDate")}
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  placeholder={t("startDate")}
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all min-h-[44px] touch-manipulation"
                  value={clientForm.startDate ? clientForm.startDate : ""}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, startDate: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full items-center justify-between border-b-2 background-border pb-4">
                <label
                  htmlFor="endDate"
                  className="text-primary uppercase font-semibold"
                >
                  {t("endDate")}
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  placeholder={t("endDate")}
                  className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all min-h-[44px] touch-manipulation"
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
            className="rounded-lg background-elevated border px-4 py-2 outline-none border-(--accent-green) transition-all cursor-pointer text-primary font-semibold hover:bg-(--accent-green)/20"
          >
            {t("addClient")}
          </button>
        </form>
      </div>
    </div>
  );
}
