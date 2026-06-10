import { describe, expect, it } from 'vitest';
import { addDays, createClampedDateKey, formatDateKey, getWeekDates, getWeekStartDate } from './dateUtils.js';

describe('dateUtils', () => {
  it('formats a Date object as YYYY-MM-DD', () => {
    expect(formatDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('moves dates by day amount', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
  });

  it('clamps missing target month days to the last day', () => {
    expect(createClampedDateKey(2026, 1, 31)).toBe('2026-02-28');
    expect(createClampedDateKey(2024, 1, 31)).toBe('2024-02-29');
  });

  it('uses Monday as the start of the week', () => {
    expect(getWeekStartDate('2026-06-10')).toBe('2026-06-08');
    expect(getWeekDates('2026-06-08')).toEqual([
      '2026-06-08',
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
    ]);
  });
});
