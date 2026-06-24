export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateKey: string, dayAmount: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + dayAmount);
  return formatDateKey(date);
}

export function createClampedDateKey(year: number, monthIndex: number, day: number): string {
  const firstDayOfTargetMonth = new Date(year, monthIndex, 1);
  const targetYear = firstDayOfTargetMonth.getFullYear();
  const targetMonthIndex = firstDayOfTargetMonth.getMonth();
  const lastDayOfTargetMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);

  return formatDateKey(new Date(targetYear, targetMonthIndex, clampedDay));
}

export function getWeekStartDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const dayIndex = date.getDay();
  const daysFromMonday = dayIndex === 0 ? 6 : dayIndex - 1;
  date.setDate(date.getDate() - daysFromMonday);
  return formatDateKey(date);
}

export function getWeekDates(weekStartDateKey: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDateKey, index));
}

export function formatReadableDate(dateKey: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parseDateKey(dateKey));
}

export function formatMonthDay(dateKey: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(parseDateKey(dateKey));
}

export function getWeekdayName(dateKey: string): string {
  return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(parseDateKey(dateKey));
}

export function isYearInRange(dateKey: string): boolean {
  const year = parseDateKey(dateKey).getFullYear();
  return year >= MIN_YEAR && year <= MAX_YEAR;
}

