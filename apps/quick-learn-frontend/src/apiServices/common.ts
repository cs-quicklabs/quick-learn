import axiosInstance from './axios';

export const postAPICall = async (
  url: string,
  body: unknown,
): Promise<unknown> => {
  const response = await axiosInstance.post<unknown>(url, body);
  return response.data;
};

export const getAPICall = async (url: string): Promise<unknown> => {
  const response = await axiosInstance.get<unknown>(url);
  return response.data;
};

export const patchAPICall = async (
  url: string,
  body: unknown,
): Promise<unknown> => {
  const response = await axiosInstance.patch<unknown>(url, body);
  return response.data;
};
