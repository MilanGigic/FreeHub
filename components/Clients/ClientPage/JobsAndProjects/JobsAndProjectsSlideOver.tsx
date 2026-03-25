"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

export default function JobsAndProjectsSlideOver() {
  const t = useTranslations("jobsAndProjects");
  const { isJobsAndProjectsSlideOverOpen, jobsAndProjectsSlideOverClose } =
    useUIStore();

  const { selectedProject, setSelectedProject } = useProjectStore();

  const totalProfitPerHour = useMemo(() => {
    if (!selectedProject) return 0;
    return selectedProject.totalProfit &&
      Number(selectedProject.totalProfit) &&
      selectedProject.totalHoursWorked &&
      Number(selectedProject.totalHoursWorked)
      ? Number(selectedProject.totalProfit) /
          Number(selectedProject.totalHoursWorked)
      : 0;
  }, [selectedProject]);

  const totalRevenue = selectedProject?.totalRevenue
    ? Number(selectedProject.totalRevenue)
    : 0;

  const profit = selectedProject?.totalProfit
    ? Number(selectedProject.totalProfit)
    : 0;

  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  if (!selectedProject) return null;

  return (
    <div
      className={`fixed top-14 right-0 h-full w-full max-w-sm background-elevated z-100 border-l-2 animate-fade-left animate-duration-500 animate-ease-out ${selectedProject.status === "completed" ? "border-(--accent-green)" : selectedProject.status === "in_progress" ? "border-(--accent-amber)" : selectedProject.status === "cancelled" ? "border-(--accent-red)" : selectedProject.status === "on_hold" ? "border-(--accent-slate)" : selectedProject.status === "not_started" ? "border-(--accent-slate)" : selectedProject.status === "active" ? "border-(--accent-purple)" : "border-(--accent-red)"} p-4`}
    >
      {isJobsAndProjectsSlideOverOpen ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-primary uppercase font-bold">
              {selectedProject.name}
            </h1>
            <button
              onClick={() => {
                jobsAndProjectsSlideOverClose();
                setSelectedProject(null);
              }}
              className="p-4 flex justify-end"
            >
              <X
                size={40}
                className="text-primary transition-all border background-border rounded-full p-1 hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red)"
              />
            </button>
          </div>
          <Link
            className="primary-cyan text-sm uppercase font-semibold p-2 border background-border rounded-lg hover:border-(--accent-cyan) text-center transition-all duration-300 ease-out"
            href={`/projects/${selectedProject.id}?tab=calendar`}
          >
            {t("goToProject")}
          </Link>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border pb-2">
              {t("revenueSection")}
            </h1>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("revenueLabel")}{" "}
              <span className="primary-green">
                ${selectedProject.totalRevenue}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("expensesLabel")}{" "}
              <span className="primary-red">
                ${selectedProject.totalExpenses}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("profitLabel")}{" "}
              <span className="primary-green">
                ${selectedProject.totalProfit}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("marginLabel")}{" "}
              <span
                className={`${profitMargin >= 40 ? "primary-green" : profitMargin >= 25 ? "primary-slate" : "primary-red"}`}
              >
                {profitMargin.toFixed(2)}%
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
              {t("workedHours")}
            </h1>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("hoursWorked")}{" "}
              <span className="primary-cyan">
                {selectedProject.totalHoursWorked}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              {t("hourlyRateLabel")}{" "}
              <span className="primary-cyan">
                <span className="primary-green">
                  ${totalProfitPerHour.toFixed(2)}
                  {t("perHour")}
                </span>
              </span>
            </p>
          </div>
          {selectedProject.status === "completed" ? (
            <div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  {t("clientFeedback")}
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("paidOnTime")} <span className="primary-red">2 days late</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("messageFromClient")}{" "}
                  <span className="primary-cyan">Great work!</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  {t("invoiceDetails")}
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoiceNumber")}{" "}
                  <span className="primary-cyan">1234567890</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoiceDate")} <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoiceAmount")} <span className="primary-cyan">$1000</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoiceStatus")} <span className="primary-cyan">Paid</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoiceDueDate")}{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoicePaymentDate")}{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {t("invoicePaymentMethod")}{" "}
                  <span className="primary-cyan">{t("bankTransfer")}</span>
                </p>
              </div>
              <h1 className="text-lg primary-green text-center uppercase font-semibold border-b-2 background-border py-2">
                {selectedProject.status}
              </h1>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  {t("projectDescription")}
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {selectedProject.description}
                </p>
              </div>
              <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                {selectedProject.status}
              </h1>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
