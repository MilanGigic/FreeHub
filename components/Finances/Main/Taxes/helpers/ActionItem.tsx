export default function ActionItem({ text }: { text: string }) {
  return (
    <div className="text-sm primary-slate flex items-start gap-2">
      <span className="text-(--accent-cyan)">•</span>
      <span>{text}</span>
    </div>
  );
}
