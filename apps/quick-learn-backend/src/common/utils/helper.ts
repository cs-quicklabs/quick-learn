import { Response } from 'express';
import sanitizeHtml from 'sanitize-html';
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

function HTMLSanitizer(value: string, isDefaultTagsAllowed = false) {
  return sanitizeHtml(
    value,
    isDefaultTagsAllowed
      ? {
          allowedTags: ['b', 'i', 'em', 'strong', 'a'],
          allowedAttributes: {
            a: ['href'],
          },
          allowedIframeHostnames: ['www.youtube.com'],
        }
      : {
          allowedTags: [],
          allowedAttributes: {},
          allowedIframeHostnames: [],
        },
  );
}
export function limitSanitizedContent(content: string): string {
  const sanitizedContent = HTMLSanitizer(content);
  return sanitizedContent.length > 250
    ? sanitizedContent.substring(0, 250) + '...'
    : sanitizedContent;
}
