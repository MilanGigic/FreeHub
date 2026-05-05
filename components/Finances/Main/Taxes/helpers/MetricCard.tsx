export default function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl border background-elevated flex flex-col gap-1">
      <span className="text-xs text-secondary">{label}</span>
      <span className="text-lg font-semibold text-primary">{value}</span>
    </div>
  );
}
