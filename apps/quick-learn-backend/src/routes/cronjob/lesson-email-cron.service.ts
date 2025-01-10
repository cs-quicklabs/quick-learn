import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonTokenEntity, UserEntity } from '@src/entities';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { nanoid } from 'nanoid';
import { EmailService } from '@src/common/modules/email/email.service';
import { Cron } from '@nestjs/schedule';
import {
  CRON_TIMEZONE,
  DailyLessonGreetings,
} from '@src/common/enum/daily_lesson.enum';
import { EnvironmentEnum } from '@src/common/constants/constants';
import { ConfigService } from '@nestjs/config';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';

@Injectable()
export class LessonEmailService {
  private frontendURL: string;
  private readonly logger = new Logger(LessonEmailService.name);
  private readonly BATCH_SIZE = 50;
  private readonly TOKEN_EXPIRY = 3;

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly lessonProgresssService: LessonProgressService,
    @InjectRepository(LessonTokenEntity)
    private readonly LessonTokenRepository: Repository<LessonTokenEntity>,
  ) {
    this.frontendURL = this.configService.getOrThrow('app.frontendDomain', {
      infer: true,
    });
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
      const greeting =
        new Date().getHours() < 12
          ? DailyLessonGreetings.GOOD_MORNING
          : DailyLessonGreetings.GOOD_EVENING;

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

      const lessonURL = this.generateURL(
        randomLesson.lesson_id,
        randomLesson.course_id,
        userMailTokenRecord.token,
      );

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
      this.emailService.readAllLessonSucess(user.email);
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
      await this.lessonProgresssService.delete({
        user_id: userID,
      });
    } catch (error) {
      this.logger.error(`Error resetting history for user ${userID}`, error);
      throw error;
    }
  }

  private async generateLessonToken() {
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + this.TOKEN_EXPIRY);
    const token = nanoid(64);
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
      return await this.LessonTokenRepository.save({
        user_id,
        lesson_id,
        course_id,
        expiresAt: token.expiryTime,
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

  private readonly generateURL = (
    lesson_id: number,
    course_id: number,
    token: string,
  ) => {
    return `${this.frontendURL}/daily-lesson/${lesson_id}?course_id=${course_id}&token=${token}`;
  };
}
