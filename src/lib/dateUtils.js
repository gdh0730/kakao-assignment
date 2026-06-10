export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateKey, dayAmount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + dayAmount);
  return formatDateKey(date);
}

export function createClampedDateKey(year, monthIndex, day) {
  const firstDayOfTargetMonth = new Date(year, monthIndex, 1);
  const targetYear = firstDayOfTargetMonth.getFullYear();
  const targetMonthIndex = firstDayOfTargetMonth.getMonth();
  const lastDayOfTargetMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);

  return formatDateKey(new Date(targetYear, targetMonthIndex, clampedDay));
}

export function getWeekStartDate(dateKey) {
  const date = parseDateKey(dateKey);
  const dayIndex = date.getDay();
  const daysFromMonday = dayIndex === 0 ? 6 : dayIndex - 1;
  date.setDate(date.getDate() - daysFromMonday);
  return formatDateKey(date);
}

export function getWeekDates(weekStartDateKey) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDateKey, index));
}

export function formatReadableDate(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

export function formatMonthDay(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getWeekdayName(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date);
}
