"use client";

import { updateInvoiceStatus } from "@/actions/invoices/updateInvoiceStatus";
import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { Invoice, InvoiceStatus } from "@/types/types";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import NewInvoiceForm from "./NewInvoiceForm";

const invoiceListHeaders = [
  "Invoice #",
  "Client",
  "Note",
  "Amount",
  "Status",
  "Issued",
  "Due",
  "Days to Pay",
];

type StatusFilter = "all" | "paid" | "sent" | "overdue" | "draft";

function filterInvoices(invoices: Invoice[], show: StatusFilter): Invoice[] {
  if (show === "all") return invoices;
  if (show === "sent") return invoices.filter((inv) => inv.status === "sent");
  return invoices.filter((inv) => inv.status === show);
}

export default function InvoicesTable() {
  const {
    invoices,
    setInvoices,
    setOutstandingInvoices,
    setOverdueInvoices,
    setPaidInvoices,
  } = useInvoiceStore();
  const { projects, setProjects } = useDataStore();
  const { setProfit } = useProjectStore();
  const { selectedClient } = useClientStore();
  const [show, setShow] = useState<StatusFilter>("all");
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] =
    useState<boolean>(false);

  const { user } = useAuth();

  const filteredInvoices = useMemo(
    () => filterInvoices(invoices, show),
    [invoices, show],
  );

  const handleStatusChange = async (
    id: string,
    projectId: string,
    status: InvoiceStatus,
  ) => {
    if (!selectedClient || !user) return;
    const res = await updateInvoiceStatus(
      id,
      status,
      selectedClient.id,
      user.id,
      projectId,
    );
    if (res.success) {
      if (res.data) {
        setInvoices(res.data);

        const outstandingTotal = res.data
          .filter((inv) => inv.status === "sent" || inv.status === "overdue")
          .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);
        setOutstandingInvoices(outstandingTotal.toFixed(2));

        const overdueList = res.data.filter((inv) => inv.status === "overdue");
        const overdueTotal = overdueList.reduce(
          (acc, inv) => acc + Number(inv.totalAmount || 0),
          0,
        );
        setOverdueInvoices({
          data: overdueTotal.toFixed(2),
          count: overdueList.length,
        });

        const paidTotal = res.data
          .filter((inv) => inv.status === "paid")
          .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);
        setPaidInvoices(paidTotal.toFixed(2));
      }

      if (res.projectData) {
        if (res.projectData.totalProfit) {
          setProfit(res.projectData.totalProfit);
        } else {
          console.log("Error setting profit");
        }
        setProjects(
          projects.map((project) =>
            project.id === res.projectData?.id
              ? {
                  ...project,
                  ...res.projectData,
                  clientName: project.clientName,
                }
              : project,
          ),
        );
      }
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      {/* Filters */}
      <div className="flex items-center gap-2 justify-between background-elevated border background-border rounded-lg px-4 md:px-0">
        <select
          name="sort"
          id="sort"
          className="text-lg font-semibold uppercase tracking-wider rounded-lg px-4 py-2 cursor-pointer text-primary focus:outline focus:outline-(--accent-cyan) block md:hidden"
          value={show}
          onChange={(e) => setShow(e.target.value as StatusFilter)}
        >
          <option value="all">All ({invoices.length})</option>
          <option value="paid">
            Paid ({invoices.filter((inv) => inv.status === "paid").length})
          </option>
          <option value="sent">
            Sent ({invoices.filter((inv) => inv.status === "sent").length})
          </option>
          <option value="overdue">
            Overdue ({invoices.filter((inv) => inv.status === "overdue").length}
            )
          </option>
          <option value="draft">
            Draft ({invoices.filter((inv) => inv.status === "draft").length})
          </option>
        </select>
        <div className="items-center gap-2 hidden md:flex">
          <button
            className={`${show === "all" ? "bg-(--accent-cyan)/20 primary-cyan" : "primary-cyan"} text-lg font-semibold uppercase tracking-wider border background-border rounded-lg px-4 py-2 cursor-pointer hover:bg-(--accent-cyan)/20 hover:primary-cyan`}
            onClick={() => setShow("all")}
          >
            All ({invoices.length})
          </button>
          <button
            className={`${show === "paid" ? "bg-(--accent-green)/20 primary-green" : "primary-green"} text-lg font-semibold uppercase tracking-wider border background-border rounded-lg px-4 py-2 cursor-pointer hover:bg-(--accent-green)/20 hover:primary-green`}
            onClick={() => setShow("paid")}
          >
            Paid ({invoices.filter((inv) => inv.status === "paid").length})
          </button>
          <button
            className={`${show === "sent" ? "bg-(--accent-amber)/20 primary-amber" : "primary-amber"} text-lg font-semibold uppercase tracking-wider border background-border rounded-lg px-4 py-2 cursor-pointer hover:bg-(--accent-amber)/20 hover:primary-amber`}
            onClick={() => setShow("sent")}
          >
            Sent ({invoices.filter((inv) => inv.status === "sent").length})
          </button>
          <button
            className={`${show === "overdue" ? "bg-(--accent-red)/20 primary-red" : "primary-red"} text-lg font-semibold uppercase tracking-wider border background-border rounded-lg px-4 py-2 cursor-pointer hover:bg-(--accent-red)/20 hover:primary-red`}
            onClick={() => setShow("overdue")}
          >
            Overdue ({invoices.filter((inv) => inv.status === "overdue").length}
            )
          </button>
          <button
            className={`${show === "draft" ? "bg-(--accent-slate)/20 primary-slate" : "primary-slate"} text-lg font-semibold uppercase tracking-wider border background-border rounded-lg px-4 py-2 cursor-pointer hover:bg-(--accent-slate)/20 hover:primary-slate`}
            onClick={() => setShow("draft")}
          >
            Draft ({invoices.filter((inv) => inv.status === "draft").length})
          </button>
        </div>
        <div>
          <button
            className={`primary-cyan text-lg font-semibold uppercase tracking-wider rounded-lg hover:bg-(--accent-cyan)/30 transition-all duration-300 ease-out flex items-center gap-0.5 h-full px-4 cursor-pointer md:w-xs justify-center py-2 ${isNewInvoiceModalOpen ? "bg-(--accent-cyan)/20 primary-cyan" : "primary-cyan"}`}
            onClick={() => setIsNewInvoiceModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4 primary-cyan" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-2 md:hidden">
        {filteredInvoices.map((invoice) => {
          const daysToPay = Math.floor(
            (invoice.dueDate.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const daysToPayColor = invoice.paymentDate
            ? "primary-green"
            : daysToPay < 0
              ? "primary-red"
              : daysToPay === 0
                ? "primary-amber"
                : "primary-slate";

          return (
            <div
              key={invoice.id}
              className="background-elevated border background-border rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-tertiary uppercase">
                    Invoice #
                  </span>
                  <span className="text-sm text-primary font-semibold">
                    {invoice.id}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-tertiary uppercase">
                    Amount
                  </span>
                  <span className="text-sm primary-cyan font-semibold">
                    ${invoice.totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-tertiary uppercase">Client</span>
                <span className="text-sm text-primary">
                  {selectedClient?.firstName} {selectedClient?.lastName}
                </span>
              </div>

              {invoice.note && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-tertiary uppercase">Note</span>
                  <span className="text-xs text-primary wrap-break-word">
                    {invoice.note}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-tertiary uppercase">
                    Issued
                  </span>
                  <span className="text-xs text-primary">
                    {invoice.issueDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-tertiary uppercase">Due</span>
                  <span className="text-xs text-primary">
                    {invoice.dueDate.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-tertiary uppercase">
                    Status
                  </span>
                  <select
                    className={`text-xs ${
                      invoice.status === "paid"
                        ? "primary-green"
                        : invoice.status === "sent"
                          ? "primary-amber"
                          : invoice.status === "overdue"
                            ? "primary-red"
                            : "primary-slate"
                    }`}
                    value={invoice.status}
                    onChange={(e) =>
                      handleStatusChange(
                        invoice.id,
                        invoice.projectId,
                        e.target.value as InvoiceStatus,
                      )
                    }
                  >
                    <option value="draft" className="primary-slate">
                      Draft
                    </option>
                    <option value="sent" className="primary-amber">
                      Sent
                    </option>
                    <option value="overdue" className="primary-red">
                      Overdue
                    </option>
                    <option value="paid" className="primary-green">
                      Paid
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs text-tertiary uppercase">
                    Days to pay
                  </span>
                  <span className={`text-xs ${daysToPayColor}`}>
                    {invoice.status === "paid" ? "Paid" : daysToPay}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / tablet table */}
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead className="border-b background-border background-elevated w-full">
            <tr>
              {invoiceListHeaders.map((header) => (
                <th
                  key={header}
                  className="text-sm text-primary text-center whitespace-nowrap px-2 py-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="max-h-[500px] overflow-y-auto border-b background-border background-elevated w-full">
            {filteredInvoices.map((invoice, index) => (
              <tr
                key={index}
                className="border-b background-border text-center"
              >
                <td className="text-sm text-primary py-2">{invoice.id}</td>
                <td className="text-sm text-primary py-2">
                  {selectedClient?.firstName} {selectedClient?.lastName}
                </td>
                <td className="text-sm text-primary py-2">{invoice.note}</td>
                <td className="text-sm text-primary py-2">
                  <span className="primary-cyan">${invoice.totalAmount}</span>
                </td>
                <td
                  className={`text-sm text-primary py-2 ${invoice.status === "paid" ? "primary-green" : invoice.status === "sent" ? "primary-amber" : invoice.status === "overdue" ? "primary-red" : "primary-slate"}`}
                >
                  <select
                    className={`${invoice.status === "paid" ? "primary-green" : invoice.status === "sent" ? "primary-amber" : invoice.status === "overdue" ? "primary-red" : "primary-slate"}`}
                    value={invoice.status}
                    onChange={(e) =>
                      handleStatusChange(
                        invoice.id,
                        invoice.projectId,
                        e.target.value as InvoiceStatus,
                      )
                    }
                  >
                    <option value="draft" className="primary-slate">
                      Draft
                    </option>
                    <option value="sent" className="primary-amber">
                      Sent
                    </option>
                    <option value="overdue" className="primary-red">
                      Overdue
                    </option>
                    <option value="paid" className="primary-green">
                      Paid
                    </option>
                  </select>
                </td>
                <td className="text-sm text-primary py-2">
                  {invoice.issueDate.toLocaleDateString()}
                </td>
                <td className="text-sm text-primary py-2">
                  {invoice.dueDate.toLocaleDateString()}
                </td>
                <td className="text-sm text-primary py-2">
                  <span
                    className={`${
                      invoice.paymentDate
                        ? "primary-green"
                        : Math.floor(
                              (invoice.dueDate.getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            ) < 0
                          ? "primary-red"
                          : Math.floor(
                                (invoice.dueDate.getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24),
                              ) === 0
                            ? "primary-amber"
                            : "primary-slate"
                    }`}
                  >
                    {invoice.status === "paid" ? (
                      <span className="primary-green uppercase font-semibold text-sm">
                        Paid
                      </span>
                    ) : (
                      Math.floor(
                        (invoice.dueDate.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isNewInvoiceModalOpen ? (
        <NewInvoiceForm onClose={() => setIsNewInvoiceModalOpen(false)} />
      ) : null}
    </div>
  );
}
