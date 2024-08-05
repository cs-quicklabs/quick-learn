import { AxiosError } from 'axios';
import { showApiErrorInToast } from './toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { toast } from 'react-toastify';

export function showErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    showApiErrorInToast(error as AxiosErrorObject);
  } else {
    const errMsg = typeof error === 'string' ? error : 'Something went wrong!';
    // update this toast to use helper toast which will
    toast.error(errMsg);
  }
}
