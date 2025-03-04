import { Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import crypto from 'crypto';
import {
  EnvironmentEnum,
  LeaderboardQuarterEnum,
} from '../constants/constants';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
export default class Helpers {
  static generateRandomhash(): string {
    return crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
  }

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

  static HTMLSanitizer(value: string, isDefaultTagsAllowed = false): string {
    return sanitizeHtml(
      value,
      isDefaultTagsAllowed
        ? {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
            allowedAttributes: { a: ['href'] },
            allowedIframeHostnames: ['www.youtube.com'],
          }
        : {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'br'],
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

  static getPreviousQuarter(): LeaderboardQuarterEnum {
    const currentMonth = new Date().getMonth(); // 0-11 (Jan=0, Dec=11)

    // Map month to quarter using integer division
    // Jan-Mar (0-2) → Q4, Apr-Jun (3-5) → Q1, Jul-Sep (6-8) → Q2, Oct-Dec (9-11) → Q3
    const quarterMap = [
      LeaderboardQuarterEnum.Q4, // Jan-Mar (0-2)
      LeaderboardQuarterEnum.Q1, // Apr-Jun (3-5)
      LeaderboardQuarterEnum.Q2, // Jul-Sep (6-8)
      LeaderboardQuarterEnum.Q3, // Oct-Dec (9-11)
    ];

    const currentQuarter = quarterMap[Math.floor(currentMonth / 3)];

    // Simple mapping for previous quarter
    const previousQuarterMap: Record<
      LeaderboardQuarterEnum,
      LeaderboardQuarterEnum
    > = {
      [LeaderboardQuarterEnum.Q1]: LeaderboardQuarterEnum.Q4,
      [LeaderboardQuarterEnum.Q2]: LeaderboardQuarterEnum.Q1,
      [LeaderboardQuarterEnum.Q3]: LeaderboardQuarterEnum.Q2,
      [LeaderboardQuarterEnum.Q4]: LeaderboardQuarterEnum.Q3,
    };

    return previousQuarterMap[currentQuarter];
  }
}
