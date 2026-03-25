import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useTranslations } from "next-intl";

export default function OutstandingInvoices() {
  const { outstandingInvoices, overdueInvoices } = useInvoiceStore();
  const t = useTranslations("clients");
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <div className="">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("outstandingInvoicesTitle")}
        </h1>
        <p className="text-2xl font-bold primary-amber">
          ${outstandingInvoices}
        </p>
        <p className="text-sm primary-slate">
          {t("outstandingInvoicesDescription")}
        </p>
      </div>
      <div className="border-b-2 background-border w-full"></div>
      <div>
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("overdueInvoices")}
        </h1>
        <p className="text-2xl font-bold primary-red flex items-center gap-2">
          ${overdueInvoices.data} -{" "}
          <span className="text-sm primary-slate">
            ({overdueInvoices.count} {t("invoicesOverdue")})
          </span>
        </p>
        <p className="text-sm primary-slate">
          {t("overdueInvoicesDescription")}
        </p>
      </div>
    </div>
  );
}
