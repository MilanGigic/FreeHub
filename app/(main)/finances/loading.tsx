function Bone({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-zinc-800 animate-pulse ${className}`} />
  );
}

function CardSkeleton({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`background-elevated border background-border rounded-2xl p-4 flex flex-col gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default function FinancesLoading() {
  return (
    <div className="w-full min-h-screen background p-6 flex flex-col gap-6">
      {/* Hero: Safe to Spend + 2x2 stat cards */}
      <div className="w-full flex flex-col xl:flex-row gap-4 items-stretch">
        {/* Safe to Spend card */}
        <div className="shrink-0 xl:w-72 background-elevated border background-border rounded-2xl p-6 flex flex-col justify-between gap-4">
          <Bone className="h-5 w-28" />
          <Bone className="h-12 w-44" />
          <Bone className="h-3 w-36" />
          <div className="flex items-center gap-2 pt-2 border-t background-border">
            <Bone className="h-1.5 w-1.5 rounded-full" />
            <Bone className="h-3 w-20" />
          </div>
          <Bone className="h-3 w-full" />
        </div>

        {/* 2x2 stat cards */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i}>
              <div className="flex items-center justify-between">
                <Bone className="h-3 w-24" />
                <Bone className="h-7 w-7 rounded-lg" />
              </div>
              <Bone className="h-7 w-16" />
              <Bone className="h-3 w-full" />
            </CardSkeleton>
          ))}
        </div>
      </div>

      {/* Main grid: left content + right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Cash Flow Forecast */}
          <CardSkeleton>
            <div className="flex justify-between items-center">
              <Bone className="h-5 w-40" />
              <Bone className="h-8 w-36 rounded-full" />
            </div>
            <Bone className="h-52 w-full" />
          </CardSkeleton>

          {/* Project Profitability */}
          <CardSkeleton>
            <div className="flex justify-between items-center">
              <Bone className="h-5 w-44" />
              <Bone className="h-8 w-32 rounded-lg" />
            </div>
            {/* Table header */}
            <div className="flex gap-4 border-b background-border pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Bone key={i} className="h-4 flex-1" />
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Bone key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </CardSkeleton>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Recent Transactions */}
          <CardSkeleton className="rounded-lg">
            <Bone className="h-5 w-40" />
            {/* Filter tabs */}
            <div className="flex gap-2">
              <Bone className="h-7 w-12 rounded-full" />
              <Bone className="h-7 w-16 rounded-full" />
              <Bone className="h-7 w-18 rounded-full" />
            </div>
            {/* Transaction rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b background-border">
                <div className="flex flex-col gap-1.5">
                  <Bone className="h-4 w-32" />
                  <Bone className="h-3 w-16" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Bone className="h-4 w-20" />
                  <Bone className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardSkeleton>

          {/* Savings Goals */}
          <CardSkeleton className="rounded-lg">
            <div className="flex justify-between items-center">
              <Bone className="h-5 w-32" />
              <Bone className="h-7 w-20 rounded-lg" />
            </div>
            <Bone className="h-4 w-48" />
          </CardSkeleton>

          {/* Cash Flow Impact Simulator */}
          <CardSkeleton className="rounded-lg">
            <Bone className="h-5 w-52" />
            <Bone className="h-4 w-full" />
            <div className="flex gap-2">
              <Bone className="h-9 flex-1 rounded-lg" />
              <Bone className="h-9 flex-1 rounded-lg" />
            </div>
            <Bone className="h-9 w-full rounded-lg" />
            <Bone className="h-9 w-full rounded-lg" />
          </CardSkeleton>
        </div>
      </div>
    </div>
  );
}
