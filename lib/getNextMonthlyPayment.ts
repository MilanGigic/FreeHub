export function getNextMonthlyPayment(today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();

  const startOfToday = new Date(year, month, today.getDate());
  let deadline = new Date(year, month, 15);

  // If the 15th already passed this month, use next month's 15th
  if (startOfToday > deadline) {
    deadline = new Date(year, month + 1, 15);
  }

  const daysUntil = Math.round(
    (deadline.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  return { deadline, daysUntil };
}
