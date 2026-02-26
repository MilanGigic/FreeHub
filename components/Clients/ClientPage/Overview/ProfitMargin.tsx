const profitMargin = 40;
export default function ProfitMargin() {
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        Profit Margin
      </h1>
      <p
        className={`text-2xl font-bold ${profitMargin >= 40 ? "primary-green" : profitMargin >= 25 ? "primary-slate" : "primary-red"}`}
      >
        {profitMargin}%
      </p>
      <p className="text-sm primary-slate">
        Profit margin is the percentage of revenue that is profit.
      </p>
    </div>
  );
}
