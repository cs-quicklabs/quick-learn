import { AxiosError } from 'axios';
import { showApiErrorInToast } from './toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { toast } from 'react-toastify';
import { DebounceFunction } from '@src/shared/types/utilTypes';
import sanitizeHtml from 'sanitize-html';

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
        allowedTags: [],
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
export function mapQueryParams(params: Record<string, string | number | boolean>) {
  return Object.keys(params).length > 0 && '?' + Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&') || '';
}
