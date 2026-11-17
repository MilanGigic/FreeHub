// components/dashboard/dashboard-skeleton.tsx
// Mirrors the refined dashboard layout so nothing shifts when real data arrives.
// Needs the .sk / .sk-rule styles from globals.css (see the reply).

function Sk({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`sk ${className}`} />;
}

function Stat({
  label = "w-24",
  value = "w-28",
}: {
  label?: string;
  value?: string;
}) {
  return (
    <div className="space-y-3">
      <Sk className={`h-3 ${label}`} />
      <Sk className={`h-5 ${value}`} />
    </div>
  );
}

function SectionHead({
  title = "w-36",
  link = "w-28",
}: {
  title?: string;
  link?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Sk className={`h-3 ${title}`} />
      <Sk className={`h-3 ${link}`} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="space-y-[72px]"
    >
      <span className="sr-only">Učitavanje kontrolne table…</span>

      {/* Finances */}
      <section>
        <SectionHead title="w-40" link="w-32" />
        <div className="mt-9 space-y-3">
          <Sk className="h-3 w-24" />
          <Sk className="h-[68px] w-full max-w-[460px] rounded-xl" />
        </div>
        <div className="sk-rule mt-12 grid grid-cols-2 gap-x-6 gap-y-8 pt-5 md:grid-cols-5">
          <Stat label="w-32" value="w-24" />
          <Stat label="w-16" value="w-20" />
          <Stat label="w-24" value="w-16" />
          <Stat label="w-28" value="w-28" />
          <Stat label="w-28" value="w-20" />
        </div>
      </section>

      {/* Clients */}
      <section className="sk-rule pt-10">
        <SectionHead title="w-36" link="w-28" />
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Stat label="w-16" value="w-8" />
          <Stat label="w-32" value="w-36" />
          <Stat label="w-32" value="w-36" />
        </div>
      </section>

      {/* Projects */}
      <section className="sk-rule pt-10">
        <SectionHead title="w-36" link="w-28" />
        <div className="mt-8 flex gap-12">
          <Stat label="w-28" value="w-6" />
          <Stat label="w-24" value="w-6" />
        </div>
        <div className="mt-8 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 border-b border-current/10 pb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Sk key={i} className="h-3 w-3/4" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-6 items-center gap-4 border-b border-current/5 py-4"
            >
              <Sk className="h-4 w-4/5" />
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-3/5 justify-self-end" />
              <Sk className="h-4 w-3/5 justify-self-end" />
              <Sk className="h-4 w-3/5 justify-self-end" />
              <Sk className="h-4 w-6 justify-self-end" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardSkeleton;
