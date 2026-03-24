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
      className={`background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default function ClientPageSkeleton() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      {/* Client name */}
      <div className="flex justify-center">
        <Bone className="h-8 w-48" />
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center items-center gap-2 md:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-9 w-28 md:w-36 rounded-lg" />
        ))}
      </div>

      {/* Status line */}
      <div className="flex justify-center">
        <Bone className="h-4 w-32" />
      </div>

      {/* Content area — mirrors Overview layout */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
        {/* Total Revenue + Net Take-Home row */}
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-32" />
          <Bone className="h-9 w-24" />
          <Bone className="h-3 w-full" />
        </CardSkeleton>
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-44" />
          <Bone className="h-9 w-24" />
          <Bone className="h-3 w-full" />
        </CardSkeleton>

        {/* Revenue Trend graph */}
        <CardSkeleton className="col-span-1 md:col-span-2 w-full">
          <div className="flex justify-between items-center">
            <Bone className="h-5 w-36" />
            <Bone className="h-8 w-40 rounded-full" />
          </div>
          <Bone className="h-40 w-full" />
          <Bone className="h-4 w-48 mx-auto" />
        </CardSkeleton>

        {/* Outstanding Invoices + Payment Reliability */}
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-40" />
          <Bone className="h-9 w-28" />
          <Bone className="h-3 w-full" />
          <div className="border-t background-border pt-3 mt-1 flex flex-col gap-2">
            <Bone className="h-4 w-36" />
            <Bone className="h-7 w-44" />
            <Bone className="h-3 w-full" />
          </div>
        </CardSkeleton>
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-44" />
          <Bone className="h-9 w-16" />
          <Bone className="h-3 w-full rounded-full" />
          <Bone className="h-3 w-48" />
          <Bone className="h-3 w-full" />
        </CardSkeleton>

        {/* Profit Margin + Tax Reserved */}
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-28" />
          <Bone className="h-9 w-24" />
          <Bone className="h-3 w-full" />
        </CardSkeleton>
        <CardSkeleton className="w-full">
          <Bone className="h-4 w-48" />
          <Bone className="h-9 w-16" />
          <Bone className="h-3 w-full" />
        </CardSkeleton>

        {/* Project Breakdown table */}
        <CardSkeleton className="col-span-1 md:col-span-2 w-full">
          <Bone className="h-5 w-40" />
          <div className="flex gap-4 border-b background-border pb-2">
            {["w-24", "w-20", "w-20", "w-20", "w-16"].map((w, i) => (
              <Bone key={i} className={`h-4 ${w} flex-1`} />
            ))}
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              {["w-24", "w-20", "w-20", "w-20", "w-16"].map((w, j) => (
                <Bone key={j} className={`h-4 ${w} flex-1`} />
              ))}
            </div>
          ))}
          <Bone className="h-3 w-64" />
        </CardSkeleton>
      </main>
    </div>
  );
}
