import { AxiosErrorObject, AxiosSuccessResponse } from '@src/apiServices/axios';
import { toast } from 'react-toastify';

export const showApiErrorInToast = (error: AxiosErrorObject) => {
  toast.error(error.response.data.message);
};
export const showApiMessageInToast = (res: AxiosSuccessResponse<unknown>) => {
  toast.success(res.message);
};
