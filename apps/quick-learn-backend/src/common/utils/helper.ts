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

  static HTMLSanitizer(value: string, isDefaultTagsAllowed = false) {
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
  static limitSanitizedContent(content: string): string {
    const sanitizedContent = this.HTMLSanitizer(content);
    return sanitizedContent.length > 250
      ? sanitizedContent.substring(0, 250) + '...'
      : sanitizedContent;
  }

  /**
   *
   * @param input {string | { [key: string]: unknown }[]}
   * @param label {string}
   * @param isHtmlString {boolean}
   * @returns {string[]}
   */

  static extractImageUrlsFromHtml(
    input: string | { [key: string]: unknown }[],
    label?: string,
    isHtmlString = true,
  ): string[] {
    // Regular expression to match <img> tags and extract the src attribute
    const regex = /<img[^>]+src="([^"]+)"/g;
    const urls: string[] = [];

    if (isHtmlString) {
      // Input is a single HTML string
      let match: RegExpExecArray | null;

      // Execute regex to find all matches
      while ((match = regex.exec(input as string)) !== null) {
        // Add the URL found to the array
        if (match[1]) {
          urls.push(match[1]);
        }
      }
    } else {
      // Input is an array of objects with the label property
      (input as { [key: string]: unknown }[]).forEach((item) => {
        if (label && item[label] && typeof item[label] === 'string') {
          let match: RegExpExecArray | null;
          const htmlString = item[label];

          // Execute regex to find all matches
          while ((match = regex.exec(htmlString as string)) !== null) {
            if (match[1]) {
              urls.push(match[1]);
            }
          }
        }
      });
    }

    return urls;
  }
}
