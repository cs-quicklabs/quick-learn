import { FileApiEnum } from '@src/constants/api.enum';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { FilePathType } from 'lib/shared/src';

type FileUploadResponse = {
  file: string;
  type: string;
};

export const fileUploadApiCall = async (
  data: FormData,
  path: FilePathType,
): Promise<AxiosSuccessResponse<FileUploadResponse>> => {
  const response = await axiosInstance.post<
    AxiosSuccessResponse<FileUploadResponse>
  >(FileApiEnum.UPLOAD + `?path=${path}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
