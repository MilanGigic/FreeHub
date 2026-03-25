"use client";

import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function DraftedInvoices() {
  const {
    invoices,
    setAmount,
    setIssueDate,
    setDueDate,
    setNote,
    amount,
    issueDate,
    dueDate,
    note,
  } = useInvoiceStore();

  const t = useTranslations("invoices");
  const [draftActive, setDraftActive] = useState<boolean>(false);

  const draftedInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "draft"),
    [invoices],
  );

  return (
    <div className="w-full flex flex-col justify-between gap-2 md:gap-4 max-w-2xl background-elevated border background-border rounded-lg p-4">
      <div>
        <h1 className="text-primary font-semibold uppercase">
          {draftedInvoices.length > 0
            ? `${draftedInvoices.length} ${t("drafts")}`
            : t("noDrafts")}
        </h1>
        <p className="text-sm primary-slate">
          {t("draftDescription")}
        </p>
      </div>

      <div className="w-full overflow-x-auto h-full flex flex-col justify-center">
        <div className="flex gap-2 md:gap-4 flex-nowrap min-h-0 pb-2">
          {draftedInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`flex flex-col gap-2 border background-border rounded-lg p-2 background-elevated shrink-0 min-w-[240px] w-[240px] cursor-pointer transition-all duration-300 ease-out  ${draftActive ? "border-(--accent-cyan) shadow-xl shadow-[#2dd4bf]/20" : "hover:shadow-xl hover:shadow-[#2dd4bf]/20"}`}
              onClick={() => {
                if (draftActive) {
                  setDraftActive(false);
                } else {
                  setDraftActive(true);
                }
                if (
                  amount === invoice.totalAmount &&
                  issueDate === invoice.issueDate &&
                  dueDate === invoice.dueDate &&
                  note === invoice.note
                ) {
                  setAmount("");
                  setIssueDate(new Date());
                  setDueDate(new Date());
                  setNote("");
                } else {
                  setAmount(invoice.totalAmount);
                  setIssueDate(invoice.issueDate);
                  setDueDate(invoice.dueDate);
                  setNote(invoice.note || "");
                }
              }}
            >
              <p className="text-sm primary-slate text-center uppercase font-semibold flex flex-col items-center">
                {t("amountLabel")}{" "}
                <span className="primary-cyan">${invoice.totalAmount}</span>
              </p>
              <div className="flex items-center justify-start w-full gap-2 primary-slate">
                <p className="text-end">
                  {t("issueDate")}{" "}
                  <span className="text-primary">
                    {invoice.issueDate.toLocaleDateString()}
                  </span>
                </p>
                <p>•</p>
                <p>
                  {t("dueDate")}{" "}
                  <span className="text-primary">
                    {invoice.dueDate.toLocaleDateString()}
                  </span>
                </p>
              </div>
              <p className="text-sm primary-slate text-center uppercase font-semibold flex flex-col items-center">
                {t("noteLabel")} <span className="text-primary">{invoice.note}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
