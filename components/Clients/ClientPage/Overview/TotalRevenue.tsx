export default function TotalRevenue() {
  return (
    <div className="w-full p-px bg-linear-to-b from-[#34d399] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base text-secondary uppercase font-semibold">
          Total Revenue
        </h1>
        <p className="text-2xl font-bold primary-green">$2,400</p>
        <p className="text-sm text-secondary">
          Total revenue is the sum of all revenue from this client.
        </p>
      </div>
    </div>
  );
}
