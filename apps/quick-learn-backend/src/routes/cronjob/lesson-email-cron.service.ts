import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@src/entities';
import { UsersService } from '../users/users.service';
import { EmailService } from '@src/common/modules/email/email.service';
import { Cron } from '@nestjs/schedule';
import {
  CRON_TIMEZONE,
  DailyLessonGreetings,
} from '@src/common/enum/daily_lesson.enum';
import { EnvironmentEnum } from '@src/common/constants/constants';
import { ConfigService } from '@nestjs/config';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import Helpers from '@src/common/utils/helper';
import { LessonTokenService } from '@src/common/modules/lesson-token/lesson-token.service';
import { IDailyLessonTokenData } from '@src/common/interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LessonEmailService {
  private frontendURL: string;
  private readonly logger = new Logger(LessonEmailService.name);
  // TODO: change this with the queuing techniques
  private readonly BATCH_SIZE = 10;
  private readonly TOKEN_EXPIRY = 3;

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly lessonProgressService: LessonProgressService,
    private readonly lessonTokenService: LessonTokenService,
    private readonly authService: AuthService,
  ) {
    this.frontendURL = this.configService.getOrThrow<string>(
      'app.frontendDomain',
      {
        infer: true,
      },
    );
  }

  private getGreeting(): string {
    const currentDate = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: CRON_TIMEZONE,
      hour: 'numeric',
      hour12: false,
    });

    const currentHour = parseInt(formatter.format(currentDate), 10);
    return currentHour < 12
      ? DailyLessonGreetings.GOOD_MORNING
      : DailyLessonGreetings.GOOD_EVENING;
  }

  @Cron('0 9,17 * * *', {
    name: 'sendEveningLessonEmails',
    timeZone: CRON_TIMEZONE,
    disabled: process.env.ENV !== EnvironmentEnum.Production,
  })
  async handleLessonNotification() {
    const startTime = Date.now();
    this.logger.log('Starting lesson notification cron job');

    try {
      const greeting = this.getGreeting();

      await this.sendLessonEmails(greeting);

      const duration = Date.now() - startTime;
      this.logger.log(`Cron job completed successfully in ${duration}ms`);
    } catch (error) {
      this.logger.error(
        'Failed to complete lesson notification cron job',
        error,
      );
    }
  }

  async sendLessonEmails(greeting: string) {
    let skip = 0;
    let processedCount = 0;

    try {
      let userBatch: UserEntity[];
      do {
        userBatch = await this.usersService.getMany(
          {
            active: true,
            email_alert_preference: true,
          },
          {},
          [],
          this.BATCH_SIZE,
          skip,
        );

        if (userBatch.length > 0) {
          await Promise.all(
            userBatch.map((user) => this.processUserLessons(user, greeting)),
          );

          processedCount += userBatch.length;
          this.logger.log(`Processed ${processedCount} users`);
          skip += this.BATCH_SIZE;
        }
      } while (userBatch.length > 0);
    } catch (error) {
      this.logger.error(`Error in batch processing at offset ${skip}`, error);
      throw error;
    }
  }

  private async processUserLessons(user: UserEntity, greeting: string) {
    try {
      const userUnReadLessions = await this.getUserUnReadLessions(user.id);

      if (userUnReadLessions.userUnReadLessions.length > 0) {
        await this.sendRandomLessonEmail(
          user,
          userUnReadLessions.userUnReadLessions,
          greeting,
        );
      } else if (userUnReadLessions.assignedRoadmapCount > 0) {
        await this.handleResetReadingHistory(user);
      }
    } catch (error) {
      this.logger.error(`Error processing user ${user.id}`, error);
    }
  }

  private async sendRandomLessonEmail(
    user: UserEntity,
    unreadLessons: Array<{
      lesson_id: number;
      name: string;
      course_id: number;
      roadmap_id: number;
    }>,
    greeting: string,
  ) {
    const randomLesson =
      unreadLessons[Math.floor(Math.random() * unreadLessons.length)];

    try {
      const userMailTokenRecord = await this.createLessionMailRecord(
        user.id,
        randomLesson.lesson_id,
        randomLesson.course_id,
      );

      const lessonURL = await this.generateURL({
        token: userMailTokenRecord.token,
        lesson_id: randomLesson.lesson_id,
        course_id: randomLesson.course_id,
        user_id: user.id,
      });

      const mailBody = {
        greetings: greeting,
        fullName: `${user.display_name}`,
        lessonName: randomLesson.name,
        lessonURL: lessonURL,
        userEmail: user.email,
      };

      this.emailService.dailyLessonTemplate(mailBody);
    } catch (error) {
      this.logger.error(`Error sending lesson email to user ${user.id}`, error);
    }
  }

  private async handleResetReadingHistory(user: UserEntity) {
    try {
      await this.resetUserReadingHistory(user.id);
      this.emailService.readAllLessonSucessEmail(user.email);
    } catch (error) {
      this.logger.error(
        `Error resetting reading history for user ${user.id}`,
        error,
      );
    }
  }

  async getUserUnReadLessions(userID: number): Promise<{
    userUnReadLessions: {
      lesson_id: number;
      name: string;
      roadmap_id: number;
      course_id: number;
    }[];
    assignedRoadmapCount: number;
  }> {
    try {
      const [unreadLessons, assignedRoadmaps] = await Promise.all([
        this.usersService.getUnreadUserLessons(userID),
        this.usersService.getUserAssignedRoadmaps(userID, true),
      ]);

      return {
        userUnReadLessions: unreadLessons,
        assignedRoadmapCount: assignedRoadmaps,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching unread lessons for user ${userID}`,
        error,
      );
      throw error;
    }
  }

  private async resetUserReadingHistory(userID: number) {
    try {
      await this.lessonProgressService.resetUserReadingHistory(userID);
    } catch (error) {
      this.logger.error(`Error resetting history for user ${userID}`, error);
      throw error;
    }
  }

  private async generateLessonToken() {
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + this.TOKEN_EXPIRY);
    const token = Helpers.generateRandomhash();
    return {
      expiryTime,
      token,
    };
  }

  private async createLessionMailRecord(
    user_id: number,
    lesson_id: number,
    course_id: number,
  ) {
    try {
      const token = await this.generateLessonToken();
      // TODO: Update this table rather than storing token for each lesson
      // TODO: Need a better way to handle this
      return await this.lessonTokenService.save({
        user_id,
        lesson_id,
        course_id,
        expires_at: token.expiryTime,
        token: token.token,
      });
    } catch (error) {
      this.logger.error(
        `Error creating lesson mail record for user ${user_id}`,
        error,
      );
      throw error;
    }
  }

  private async generateURL(data: IDailyLessonTokenData) {
    const token = await this.authService.generateDailyLessonToken(data);
    return `${this.frontendURL}/daily-lesson/${token}`;
  }
}
