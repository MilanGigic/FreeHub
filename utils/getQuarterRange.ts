export function getQuarterRange(year: number, quarter: 1 | 2 | 3 | 4) {
  const ranges = {
    1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31, 23, 59, 59) },
    2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30, 23, 59, 59) },
    3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30, 23, 59, 59) },
    4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31, 23, 59, 59) },
  };
  return ranges[quarter];
}

/** Which quarter is "now"? */
export function getCurrentQuarter(date = new Date()): {
  year: number;
  quarter: 1 | 2 | 3 | 4;
} {
  const month = date.getMonth(); // 0–11
  const quarter = (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4;
  return { year: date.getFullYear(), quarter };
}
