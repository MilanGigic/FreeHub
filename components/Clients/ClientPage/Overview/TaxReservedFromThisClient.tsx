export default function TaxReservedFromThisClient() {
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base text-secondary uppercase font-semibold">
        Tax Reserved from This Client
      </h1>
      <p className="text-2xl font-bold primary-amber">$1,340</p>
      <p className="text-sm text-secondary">
        Tax reserved from this client is the amount of tax that is reserved for
        this client.
      </p>
    </div>
  );
}
