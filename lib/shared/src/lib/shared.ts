import { TIMEZONE } from "./constant";
import {
  startOfMonth,
  subMonths,
  format,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  subWeeks,
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
