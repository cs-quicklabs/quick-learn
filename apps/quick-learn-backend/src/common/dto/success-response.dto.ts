import { ResponseInterface } from '../interfaces';

export class SuccessResponse implements ResponseInterface {
  constructor(message: string, data: unknown | unknown[] = {}) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
  success: boolean;
  message: string;
  data: unknown | unknown[];
  error: unknown;
  errorCode: number;
}
