function Bone({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-zinc-800 animate-pulse ${className}`} />
  );
}

function MetricCard() {
  return (
    <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full gap-2">
      <Bone className="h-12 w-32" />
      <Bone className="h-4 w-40" />
    </div>
  );
}

function ClientCard() {
  return (
    <div className="p-px bg-linear-to-b from-[#21262d] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1 border-b-2 background-border pb-2">
          <Bone className="h-5 w-36" />
          <Bone className="h-4 w-44" />
        </div>
        <Bone className="h-4 w-28" />
        <Bone className="h-4 w-32" />
        <Bone className="h-4 w-32" />
        <Bone className="h-4 w-28" />
        <Bone className="h-4 w-36" />
      </div>
    </div>
  );
}

export default function ClientsLoading() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full min-h-screen h-full">
      <header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} />
          ))}
        </div>
      </header>
      <main className="w-full">
        <div className="w-full h-full flex flex-col gap-2 md:gap-4 p-4">
          <div className="w-full h-full flex gap-2 md:gap-4">
            <div className="flex items-start gap-2 relative max-w-2xl w-full">
              <Bone className="h-10 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <ClientCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
