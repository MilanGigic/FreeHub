type QuarterlyPayment = {
  rata: number;
  label: string;
  deadline: Date;
  daysUntil: number;
};

const QUARTERLY_DEADLINES = [
  { rata: 1, label: "I rata", month: 1, day: 14 }, // February  (month is 0-indexed)
  { rata: 2, label: "II rata", month: 4, day: 15 }, // May
  { rata: 3, label: "III rata", month: 7, day: 14 }, // August
  { rata: 4, label: "IV rata", month: 10, day: 14 }, // November
];

export function getNextQuarterlyPayment(
  from: Date = new Date(),
): QuarterlyPayment {
  const year = from.getFullYear();

  // Build all 4 deadlines for the current year, then the first of next year as overflow
  const candidates = [
    ...QUARTERLY_DEADLINES.map((d) => ({
      ...d,
      deadline: new Date(year, d.month, d.day),
    })),
    {
      ...QUARTERLY_DEADLINES[0],
      deadline: new Date(
        year + 1,
        QUARTERLY_DEADLINES[0].month,
        QUARTERLY_DEADLINES[0].day,
      ),
    },
  ];

  const next = candidates.find((d) => d.deadline >= from);

  // This can never be undefined given the overflow entry, but TypeScript needs the guard
  if (!next) throw new Error("Could not determine next quarterly payment.");

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.ceil(
    (next.deadline.getTime() - from.getTime()) / msPerDay,
  );

  return {
    rata: next.rata,
    label: next.label,
    deadline: next.deadline,
    daysUntil,
  };
}
