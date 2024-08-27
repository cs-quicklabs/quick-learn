import { AxiosError } from 'axios';
import { showApiErrorInToast } from './toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { toast } from 'react-toastify';
import { DebounceFunction } from '@src/shared/types/utilTypes';

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
