// __tests__/lib.utils.test.ts

import { isEventCurrentlyHappening } from '@/lib/utils';

describe('isEventCurrentlyHappening()', () => {
  // Build a string for today's date in "YYYY-MM-DD" format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  it('returns true when current time is within the start and end times', () => {
    // Set start at midnight and end at 23:59 to cover the entire day
    expect(isEventCurrentlyHappening(dateStr, '00:00', '23:59')).toBe(true);
  });

  it('returns false when current time is before the start time', () => {
    // Use a start time two hours in the future
    const futureHour = `${String((today.getHours() + 2) % 24).padStart(2, '0')}:00`;
    expect(isEventCurrentlyHappening(dateStr, futureHour, '23:59')).toBe(false);
  });

  it('returns false when current time is after the end time', () => {
    // Use an end time two hours in the past
    const pastHour = `${String(Math.max(today.getHours() - 2, 0)).padStart(2, '0')}:00`;
    expect(isEventCurrentlyHappening(dateStr, '00:00', pastHour)).toBe(false);
  });

  it('returns false when the date is not today', () => {
    // Create a date string for yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yyyyy = yesterday.getFullYear();
    const ymmm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yddd = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yyyyy}-${ymmm}-${yddd}`;

    expect(isEventCurrentlyHappening(yesterdayStr, '00:00', '23:59')).toBe(false);
  });
});
