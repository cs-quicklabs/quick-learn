import { Response } from 'express';

export default class Helpers {
  static clearCookies(res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
  }
}
