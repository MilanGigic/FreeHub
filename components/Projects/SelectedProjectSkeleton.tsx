function Bone({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-zinc-800 animate-pulse ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
      <Bone className="h-10 w-20" />
      <Bone className="h-4 w-28" />
    </div>
  );
}

export default function SelectedProjectSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-2 md:gap-4 w-full h-full">
      {/* Breadcrumb bar */}
      <div className="flex w-full p-2 background-elevated gap-2 items-center">
        <Bone className="h-5 w-16" />
        <div className="h-5 border background-border w-px" />
        <Bone className="h-5 w-20" />
        <div className="h-5 border background-border w-px" />
        <Bone className="h-5 w-48" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-2 justify-center p-2">
        <Bone className="h-10 w-28 rounded-lg" />
        <Bone className="h-10 w-28 rounded-lg" />
      </div>

      {/* Calendar tab content */}
      <div className="flex flex-col w-full justify-center items-center gap-2 md:gap-4 h-full">
        <div className="grid grid-cols-3 w-full h-full gap-2 md:gap-4">
          {/* Header: 5 stat cards */}
          <div className="col-span-3">
            <header className="w-full text-center flex gap-2">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </header>
          </div>

          {/* Calendar */}
          <div className="col-span-2 h-full">
            <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
              {/* Month header */}
              <div className="flex justify-between items-center">
                <Bone className="h-6 w-8" />
                <Bone className="h-6 w-36" />
                <Bone className="h-6 w-8" />
              </div>
              {/* Day names row */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Bone key={i} className="h-5 w-full" />
                ))}
              </div>
              {/* Calendar grid: 5 weeks */}
              {Array.from({ length: 5 }).map((_, week) => (
                <div key={week} className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, day) => (
                    <Bone key={day} className="h-10 w-full rounded-md" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar entries sidebar */}
          <div className="col-span-1 h-full">
            <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
              <Bone className="h-5 w-32" />
              <Bone className="h-4 w-full" />
              <div className="flex flex-col gap-2 mt-2">
                <Bone className="h-4 w-24" />
                <Bone className="h-20 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Bone className="h-4 w-28" />
                <Bone className="h-9 w-full rounded-lg" />
              </div>
              <Bone className="h-9 w-full rounded-lg mt-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
