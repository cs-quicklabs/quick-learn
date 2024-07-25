export interface ResponseInterface {
  success: boolean;
  message: string;
  data: unknown | unknown[];
  error: unknown;
  errorCode: number;
}
