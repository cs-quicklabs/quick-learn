import { Response } from 'express';
import { EnvironmentEnum } from '../constants/constants';

export default class Helpers {
  static clearCookies(res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
  }

  static setCookies(
    res: Response,
    name: string,
    value: string,
    expires?: number,
  ) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: expires,
      path: '/',
    });
  }
}
