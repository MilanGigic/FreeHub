function Bone({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-zinc-800 animate-pulse ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full gap-2">
      <Bone className="h-12 w-20 mb-4" />
      <Bone className="h-4 w-32 mb-4" />
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="w-full background-elevated border background-border rounded-lg p-4 flex flex-col gap-4">
      {/* Header: name + status badge */}
      <div className="flex w-full justify-between items-center border-b-2 background-border pb-2">
        <div className="flex flex-col gap-1.5">
          <Bone className="h-5 w-36" />
          <Bone className="h-4 w-24" />
        </div>
        <Bone className="h-10 w-32 rounded-lg" />
      </div>

      {/* Revenue | Expenses | Profit */}
      <div className="flex w-full items-center justify-between gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <Bone className="h-3 w-16" />
            <Bone className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Margin bar */}
      <div className="flex flex-col gap-2">
        <Bone className="h-4 w-full rounded-md" />
        <Bone className="h-3 w-24" />
      </div>

      {/* Footer: dates + hours */}
      <div className="flex justify-between items-center pt-2.5 border-t background-border">
        <div className="flex gap-3">
          <Bone className="h-5 w-36" />
          <Bone className="h-5 w-40" />
        </div>
        <Bone className="h-5 w-24" />
      </div>
    </div>
  );
}

export default function ProjectsPageSkeleton() {
  return (
    <div className="background min-h-screen p-6 font-sans flex flex-col gap-8">
      {/* Header: 4 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Toolbar */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex w-full border background-border rounded-lg justify-between items-center gap-2 p-1">
          {/* Status tabs */}
          <div className="flex w-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <Bone key={i} className="h-9 w-full mx-0.5 rounded-md" />
            ))}
          </div>
          {/* Search + controls */}
          <div className="flex items-center w-full gap-4 px-2">
            <Bone className="h-9 w-full rounded-lg" />
            <Bone className="h-9 w-10 shrink-0" />
            <Bone className="h-9 w-28 shrink-0" />
            <Bone className="h-9 w-32 shrink-0 rounded-lg" />
          </div>
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 md:gap-4">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </div>
  );
}
