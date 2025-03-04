import { TIMEZONE } from './constant';
import {
  startOfMonth,
  subMonths,
  format,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  subWeeks,
  getQuarter,
  getYear,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const getLastMonthRange = () => {
  const timeZone = TIMEZONE;
  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
  const start = startOfMonth(subMonths(zonedNow, 1));
  const end = endOfMonth(subMonths(zonedNow, 1));

  const utcStart = toZonedTime(start, timeZone);
  const utcEnd = toZonedTime(end, timeZone);

  return {
    start: format(utcStart, 'yyyy-MM-dd HH:mm:ss'),
    end: format(utcEnd, 'yyyy-MM-dd HH:mm:ss'),
  };
};

export const getLastWeekRange = () => {
  const timeZone = TIMEZONE;
  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
  const start = startOfWeek(subWeeks(zonedNow, 1), { weekStartsOn: 1 }); // Assuming week starts on Monday
  const end = endOfWeek(subWeeks(zonedNow, 1), { weekStartsOn: 1 });

  const utcStart = toZonedTime(start, timeZone);
  const utcEnd = toZonedTime(end, timeZone);

  return {
    start: format(utcStart, 'yyyy-MM-dd HH:mm:ss'),
    end: format(utcEnd, 'yyyy-MM-dd HH:mm:ss'),
  };
};

export const getLastQuarterRange = () => {
  const timeZone = TIMEZONE;
  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);

  // Get the current quarter and subtract 1 to get the last quarter
  const currentYear = getYear(zonedNow);
  const currentQuarter = getQuarter(zonedNow);
  let lastQuarter, lastQuarterYear;

  if (currentQuarter === 1) {
    // If we're in Q1 (Jan-Mar), last quarter was Q4 of the previous year
    lastQuarter = 4;
    lastQuarterYear = currentYear - 1;
  } else {
    lastQuarter = currentQuarter - 1;
    lastQuarterYear = currentYear;
  }

  // Get the first and last month of the last quarter
  const lastQuarterStartMonth = (lastQuarter - 1) * 3; // 0-based index for month
  const lastQuarterEndMonth = lastQuarterStartMonth + 2; // Last month of that quarter

  // Get the start and end of the last quarter
  const lastQuarterStart = startOfMonth(
    new Date(lastQuarterYear, lastQuarterStartMonth, 1),
  );
  const lastQuarterEnd = endOfMonth(
    new Date(lastQuarterYear, lastQuarterEndMonth, 1),
  );

  // Convert to timezone
  const utcStart = toZonedTime(lastQuarterStart, timeZone);
  const utcEnd = toZonedTime(lastQuarterEnd, timeZone);

  return {
    start: format(utcStart, 'yyyy-MM-dd HH:mm:ss'),
    end: format(utcEnd, 'yyyy-MM-dd HH:mm:ss'),
  };
};
