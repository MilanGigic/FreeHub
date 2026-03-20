import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export default function TaxReservedFromThisClient() {
  const { monthlyTaxReserve } = useTaxProfileStore();
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        Tax Reserved from This Client
      </h1>
      <p className="text-2xl font-bold primary-amber">
        $
        {Number(monthlyTaxReserve).toLocaleString("en-US", {
          minimumFractionDigits: 0,
        })}
      </p>
      <p className="text-sm primary-slate">
        Tax reserved from this client is the amount of tax that is reserved for
        this client.
      </p>
    </div>
  );
}
