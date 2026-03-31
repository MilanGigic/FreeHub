export default function SummaryCard({
  title,
  number,
  icon,
  children,
}: {
  title: string;
  number: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-(--background-elevated) border border-(--background-border) rounded-lg p-6 flex flex-col gap-1">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
          {number}
        </span>
        <span className="text-(--accent-cyan) opacity-70">{icon}</span>
        <h2 className="text-primary text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
