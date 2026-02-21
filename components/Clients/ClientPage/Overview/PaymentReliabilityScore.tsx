const paymentReliabilityScore = 80;
export default function PaymentReliabilityScore() {
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base text-secondary uppercase font-semibold">
        Payment Reliability Score
      </h1>
      <div className="flex flex-col gap-2">
        <div className="w-full flex items-center gap-2">
          <p
            className={`text-2xl font-bold ${paymentReliabilityScore >= 80 ? "primary-green" : paymentReliabilityScore >= 60 ? "primary-amber" : "primary-red"}`}
          >
            {paymentReliabilityScore}%
          </p>
          <div className="w-full h-4 border-2 background-border rounded-full">
            <div
              className={`h-full ${paymentReliabilityScore >= 80 ? "bg-[var(--accent-green)]" : paymentReliabilityScore >= 60 ? "bg-[var(--accent-amber)]" : "bg-[var(--accent-red)]"} rounded-full transition-all duration-300`}
              style={{
                width: `${paymentReliabilityScore.toString() + "%"}`,
                minWidth: "8px",
              }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm text-secondary">Avg 4 days late</p>
          <p className="text-sm font-semibold primary-purple">
            16 of 20 invoices paid on time
          </p>
        </div>
      </div>
      <p className="text-sm text-secondary">
        Payment reliability score is a measure of how reliable a client is at
        paying their invoices.
      </p>
    </div>
  );
}
