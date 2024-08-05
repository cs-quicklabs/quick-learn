import { AxiosErrorObject } from '@src/apiServices/axios';
import { toast } from 'react-toastify';

export const showApiErrorInToast = (error: AxiosErrorObject) => {
  toast.error(error.response.data.message);
};
