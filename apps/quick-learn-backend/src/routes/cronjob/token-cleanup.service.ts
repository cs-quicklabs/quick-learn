import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { subMonths } from 'date-fns';
import { SessionService } from '@src/common/modules/session/session.service';
import { ResetTokenService } from '../auth/reset-token.service';
import { LessonTokenService } from '@src/common/modules/lesson-token/lesson-token.service';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { TIMEZONE } from '@quick-learn/shared';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);
  private readonly DELETE_LAST_X_MONTH_LESSON_PROGRESS = 6;
  constructor(
    private readonly sessionService: SessionService,
    private readonly resetTokenService: ResetTokenService,
    private readonly lessonTokenService: LessonTokenService,
    private readonly userLessonProgress: LessonProgressService,
  ) {}

  // This will clean up user-lesson-progress and it's token of prior to last 6 month.
  // This will run at 12:00 AM, on day 1 of the month, only in June and December
  @Cron('0 0 1 6,12 *', {
    timeZone: TIMEZONE,
  })
  async cleanUserLessonProgress() {
    const beforeXMonth = subMonths(
      new Date(),
      this.DELETE_LAST_X_MONTH_LESSON_PROGRESS,
    );
    this.logger.log(
      `------------- Deleting all the data which is before: ${beforeXMonth} -------------`,
    );

    this.logger.log(`------------- Deleting all lesson tokens -------------`);
    const { affected: deletedLessonToken } =
      await this.lessonTokenService.delete({
        expires_at: LessThan(beforeXMonth),
      });
    this.logger.log(
      `------------- Deleted ${deletedLessonToken} lesson tokens -------------`,
    );

    this.logger.log(`------------- Deleting all user progress -------------`);
    const { affected: deletedUserProgress } =
      await this.userLessonProgress.delete({
        completed_date: LessThan(beforeXMonth),
      });
    this.logger.log(
      `------------- Deleted ${deletedUserProgress}  user progress -------------`,
    );

    this.logger.log(
      `------------- Deleting all the data which is before ${beforeXMonth} completed -------------`,
    );
  }

  // This will delete all the expired reset tokens
  // This will run every week At 12:00 AM, only on Sunday
  @Cron('0 0 * * SUN', {
    timeZone: TIMEZONE,
  })
  async cleanResetToken() {
    // We're here delete all the expire token
    this.logger.log(
      `------------- Deleting all the data which has expired. -------------`,
    );
    const { affected } = await this.resetTokenService.delete({
      expiry_date: LessThan(new Date()),
    });
    this.logger.log(`------------- Deleted ${affected} rows. -------------`);
  }

  // This will delete all the expired session tokens
  // This will run every week At 1:00 AM, only on Sunday
  @Cron('0 1 * * SUN', {
    timeZone: TIMEZONE,
  })
  async cleanSessionToken() {
    this.sessionService.deleteAllExpiredSessions();
  }
}
