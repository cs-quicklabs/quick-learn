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

export function onlyAlphabeticValidation(value: string) {
  return /^[A-Za-z]+$/.test(value);
}

export function onlyAlphabeticAndSpaceValidation(value: string) {
  return /^[A-Za-z\s]+$/.test(value);
}
