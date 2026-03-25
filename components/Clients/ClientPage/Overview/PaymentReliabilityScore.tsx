import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useTranslations } from "next-intl";

export default function PaymentReliabilityScore() {
  const { invoices } = useInvoiceStore();
  const t = useTranslations("clients");

  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const overdueInvoicesCount = invoices.filter(
    (invoice) => invoice.status === "overdue",
  ).length;
  const outstandingInvoicesCount = invoices.filter(
    (invoice) => invoice.status !== "overdue" && invoice.status === "sent",
  ).length;

  let onTimePaidCount = 0;
  let lateCount = 0;
  let totalLateDays = 0;

  paidInvoices.forEach((invoice) => {
    if (!invoice.paymentDate) return;

    const diffDays =
      (invoice.paymentDate.getTime() - invoice.dueDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays <= 0) {
      onTimePaidCount += 1;
    } else {
      lateCount += 1;
      totalLateDays += diffDays;
    }
  });

  const totalRelevantInvoices =
    outstandingInvoicesCount + overdueInvoicesCount + paidInvoices.length;

  const rawScore =
    totalRelevantInvoices === 0
      ? 100
      : (onTimePaidCount / totalRelevantInvoices) * 100;

  const paymentReliabilityScore = Math.max(
    0,
    Math.min(100, Math.round(rawScore)),
  );

  const averageDaysLate = lateCount > 0 ? totalLateDays / lateCount : 0;

  const scoreColorClass =
    paymentReliabilityScore >= 80
      ? "primary-green"
      : paymentReliabilityScore >= 60
        ? "primary-amber"
        : "primary-red";

  const barColorClass =
    paymentReliabilityScore >= 80
      ? "bg-(--accent-green)"
      : paymentReliabilityScore >= 60
        ? "bg-(--accent-amber)"
        : "bg-(--accent-red)";

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        {t("paymentReliabilityScore")}
      </h1>
      <div className="flex flex-col gap-2">
        <div className="w-full flex items-center gap-2">
          <p className={`text-2xl font-bold ${scoreColorClass}`}>
            {paymentReliabilityScore}%
          </p>
          <div className="w-full h-4 border-2 background-border rounded-full">
            <div
              className={`h-full ${barColorClass} rounded-full transition-all duration-300`}
              style={{
                width: `${paymentReliabilityScore}%`,
                minWidth: "8px",
              }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm primary-slate">
            {lateCount > 0
              ? t("avgDaysLate", { count: averageDaysLate.toFixed(1) })
              : t("paidOnTime")}
          </p>
          <p className="text-sm font-semibold primary-purple">
            {totalRelevantInvoices > 0
              ? t("invoicesPaidOnTime", { paid: onTimePaidCount, total: totalRelevantInvoices })
              : t("noPaidInvoicesYet")}
          </p>
        </div>
      </div>
      <p className="text-sm primary-slate">
        {t("paymentReliabilityDescription")}
      </p>
    </div>
  );
}
