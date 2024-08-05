export type IResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
