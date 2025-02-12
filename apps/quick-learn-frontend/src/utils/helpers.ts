import { AxiosError } from 'axios';
import { showApiErrorInToast } from './toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { toast } from 'react-toastify';
import { DebounceFunction } from '@src/shared/types/utilTypes';
import sanitizeHtml from 'sanitize-html';
import { UserLessonProgress } from '@src/shared/types/LessonProgressTypes';
import {
  TRoadmap,
  TCourse,
  TUserRoadmap,
  TUserCourse,
} from '@src/shared/types/contentRepository';
import { subDays, startOfMonth, subMonths, format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';

export function showErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    showApiErrorInToast(error as AxiosErrorObject);
  } else {
    const errMsg = typeof error === 'string' ? error : 'Something went wrong!';
    // update this toast to use helper toast which will
    toast.error(errMsg);
  }
}

/**
 * Debounces a function to be executed after a specified wait time.
 * @param fn - The function to be debounced.
 * @param wait - The wait time in milliseconds.
 * @returns A debounced function.
 */
export function debounce<T>(fn: DebounceFunction<T>, wait: number) {
  let token: ReturnType<typeof setTimeout> | undefined;
  return (...args: T[]) => {
    if (token) clearTimeout(token);
    token = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

/**
 * a function to check if the value is a valid alphabet
 * @param value string
 * @returns boolean
 */
export function onlyAlphabeticValidation(value: string): boolean {
  return /^[A-Za-z]+$/.test(value);
}

/**
 * a function to check if the value has no special characters or not
 * @param value a string value
 * @returns
 */
export function noSpecialCharValidation(value: string): boolean {
  return /^[a-zA-Z0-9 ]+$/.test(value);
}

/**
 * a function to remove empty values from an object
 * @param obj an object
 * @returns an object with no empty values
 */
export function removeEmptyValues(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => !!value));
}

/**
 * Sanitizes the given HTML string to remove malicious tags and attributes.
 * By default, this only allows `p` tags. If `isDefaultTagsAllowed` is true,
 * it will also allow `b`, `i`, `em`, `strong`, and `a` tags, as well as
 * `href` attribute on `a` tags and `iframe` tags from `www.youtube.com`.
 * @param value The HTML string to sanitize
 * @param isDefaultTagsAllowed Whether to allow the default set of tags
 * @returns The sanitized HTML string
 */
export function HTMLSanitizer(value: string, isDefaultTagsAllowed = false) {
  return sanitizeHtml(
    value,
    isDefaultTagsAllowed
      ? {
          allowedTags: ['b', 'i', 'em', 'strong', 'a'],
          allowedAttributes: {
            a: ['href'],
          },
          allowedIframeHostnames: ['www.youtube.com'],
        }
      : {
          allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'br'],
          allowedAttributes: {},
          allowedIframeHostnames: [],
        },
  );
}

/**
 * Maps a record of query parameters to a query string.
 * @param params A record with string or number values
 * @returns A query string
 * @example
 * mapQueryParams({ foo: 'bar', baz: 1 }) // 'foo=bar&baz=1'
 */
export function mapQueryParams(
  params: Record<string, string | number | boolean>,
) {
  return (
    (Object.keys(params).length > 0 &&
      `?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`) ||
    ''
  );
}

export const getInitials = (
  firstName?: string,
  lastName?: string,
  fallback = 'U',
): string => {
  if (!firstName && !lastName) return fallback;
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const calculateRoadmapProgress = (
  roadmapData: TRoadmap | TUserRoadmap | undefined,
  userProgress: UserLessonProgress[],
) => {
  if (!roadmapData?.courses?.length) return 0;

  const totalLessonsInRoadmap = roadmapData.courses.reduce((total, course) => {
    return total + (course.lesson_ids?.length || course?.lessons?.length || 0);
  }, 0);

  if (totalLessonsInRoadmap === 0) return 0;

  const completedLessonsInRoadmap = roadmapData.courses.reduce(
    (total, course) => {
      const courseProgress = userProgress?.find(
        (progress) => progress?.course_id === Number(course?.id),
      );

      const completedLessonIds =
        courseProgress?.lessons?.map((lesson) => lesson.lesson_id) || [];
      const completedCount = course.lesson_ids
        ? course.lesson_ids?.filter((lesson) =>
            completedLessonIds.includes(lesson.id),
          ).length || 0
        : course.lessons?.filter(({ id }) => completedLessonIds.includes(id))
            .length || 0;

      return total + completedCount;
    },
    0,
  );

  return Math.round((completedLessonsInRoadmap / totalLessonsInRoadmap) * 100);
};

export const calculateCourseProgress = (
  course: TUserCourse | TCourse,
  userProgress: UserLessonProgress[],
) => {
  if (!course || !Array.isArray(course.lesson_ids || course.lessons)) return 0;

  const courseProgress = userProgress?.find(
    (progress) => progress.course_id === course.id,
  );

  const completedLessonIds =
    courseProgress?.lessons?.map((lesson) => lesson.lesson_id) || [];

  const totalLessons =
    course?.lesson_ids?.length || course?.lessons?.length || 0;
  const completedCount = course.lesson_ids
    ? course.lesson_ids?.filter((lesson) =>
        completedLessonIds.includes(lesson.id),
      ).length || 0
    : course.lessons?.filter(({ id }) => completedLessonIds.includes(id))
        .length || 0;

  return totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;
};

export const getRecords = (type: string, lastRecord: string) => {
  const lastRecordDate = new Date(lastRecord);
  const recordDate =
    type === 'weekly'
      ? subDays(lastRecordDate, 7)
      : startOfMonth(subMonths(lastRecordDate, 1));
  const recordDateFormatted = format(recordDate, DateFormats.shortDate);

  return (
    recordDateFormatted + ' to ' + format(lastRecordDate, DateFormats.shortDate)
  );
};

export const firstLetterCapital = (text: string | undefined) => {
  if (typeof text !== 'string' || text.length === 0) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
