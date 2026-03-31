export default function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-2.5 border-b border-(--background-border) last:border-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="mt-0.5 text-(--accent-cyan) opacity-70 shrink-0">
          {icon}
        </span>
        <span className="text-lg uppercase tracking-widest text-primary opacity-40 font-semibold">
          {label}
        </span>
      </div>
      <span className="text-primary text-base font-medium break-words">
        {value}
      </span>
    </div>
  );
}
