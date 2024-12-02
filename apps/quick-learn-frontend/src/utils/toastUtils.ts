import { AxiosErrorObject, AxiosSuccessResponse } from '@src/apiServices/axios';
import { en } from '@src/constants/lang/en';
import { toast } from 'react-toastify';

export const showApiErrorInToast = (error: AxiosErrorObject) => {
  toast.error(error?.response?.data?.message || en.common.somethingWentWrong);
};
export const showApiMessageInToast = (res: AxiosSuccessResponse<unknown>) => {
  toast.success(res.message);
};
