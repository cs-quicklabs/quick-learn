import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessonTokenEntity,
  UserEntity,
  UserLessonProgressEntity,
} from '@src/entities';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { nanoid } from 'nanoid';
import { EmailService } from '@src/common/modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { emailSubjects } from '@src/common/constants/email-subject';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyLessonGreetings } from '@src/common/enum/daily_lesson.enum';
import { EMAIL_BODY } from '@src/common/constants/emailBody';

@Injectable()
export class LessonEmailService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    @InjectRepository(UserLessonProgressEntity)
    private userProgresssRepository: Repository<UserLessonProgressEntity>,
    @InjectRepository(LessonTokenEntity)
    private LessonTokenRepository: Repository<LessonTokenEntity>,
    private emailService: EmailService,
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(LessonEmailService.name);
  }
  // Runs every minute
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  handleMorningCron() {
    this.sendLessonEmails(DailyLessonGreetings.GOOD_MORNING);
    this.logger.log(`Cron job executed at ${new Date().toISOString()}`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  handleEveningCron() {
    this.sendLessonEmails(DailyLessonGreetings.GOOD_EVENING);
    this.logger.log(`Cron job executed at ${new Date().toISOString()}`);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleTestCron() {
    this.sendLessonEmails(DailyLessonGreetings.GOOD_EVENING);
    this.logger.log(`Cron job executed at ${new Date().toISOString()}`);
  }

  private async sendLessonEmails(greeting: string) {
    // FIND ALL ACTIVE USERS
    const allActiveUsers = await this.userRepository.find({
      where: { active: true },
    });
    allActiveUsers.forEach(async (users: UserEntity) => {
      const currentUserID = users.id;
      // GET USER READ LESSONS
      const userUnReadLessions = await this.getUserUnReadLessions(
        currentUserID,
      );
      if (userUnReadLessions.userUnReadLessions.length > 0) {
        const randomLessionToSend =
          userUnReadLessions.userUnReadLessions[
            Math.floor(
              Math.random() * userUnReadLessions.userUnReadLessions.length,
            )
          ];

        //   CREATE RECORD IN LESSON TOKEN TABLE
        const userMailTokenRecord = await this.createLessionMailRecord(
          currentUserID,
          randomLessionToSend.lesson_id,
          randomLessionToSend.course_id,
        );
        const LessonURL = this.generateURL(
          randomLessionToSend.lesson_id,
          randomLessionToSend.course_id,
          userMailTokenRecord.token,
        );
        const MAIL_BODY = EMAIL_BODY.DAILY_LESSON_EMAIL(
          greeting,
          users.first_name,
          users.last_name,
          randomLessionToSend.name,
          LessonURL,
        );

        this.emailService.email({
          body: MAIL_BODY,
          recipients: [users.email],
          subject: emailSubjects.LESSON_FOR_THE_DAY,
        });
      } else {
        if (userUnReadLessions.assignedRoadmapCount > 0) {
          // RESET USER READ HISTORY AND SEND EMAIL TO USER
          this.resetUserReadingHistory(currentUserID);
          // TODO: IMPLEMENT EMAIL SERVICE
          const MAIL_BODY = EMAIL_BODY.RESET_READING_HISTORY();

          this.emailService.email({
            body: MAIL_BODY,
            recipients: [users.email],
            subject: emailSubjects.RESET_READING_HISTORY,
          });
        }
      }
    });
  }

  async getUserUnReadLessions(userID: number) {
    // FIND ASSIGNED ROADMAPS AND COURSES WITH LESSIONS
    const dataRelations = [
      'assigned_roadmaps',
      'assigned_roadmaps.courses',
      'assigned_roadmaps.courses.lessons',
    ];

    const userAssignedRoadmaps =
      await this.usersService.findOneWithSelectedRelationData(
        { id: userID },
        dataRelations,
      );

    // EXTARCT ALL LESSIONS WITH RESPECTIVE COURSES AND ROADMAPS
    const lessonsArray = [];
    userAssignedRoadmaps.assigned_roadmaps.forEach((roadmap) => {
      const roadmapId = roadmap.id;
      roadmap.courses.forEach((course) => {
        const courseId = course.id;
        course.lessons.forEach((lesson) => {
          lessonsArray.push({
            ...lesson,
            course_id: courseId,
            roadmap_id: roadmapId,
            lesson_id: lesson.id,
          });
        });
      });
    });

    // FIND ALL LESSIONS THAT HAVE NOT BEEN COMPLETED
    const userReadLessions = await this.userProgresssRepository.find({
      where: {
        user_id: userID,
      },
    });

    // FIND ALL LESSIONS THAT HAVE NOT BEEN COMPLETED
    const userUnReadLessions = lessonsArray.filter(
      (obj1) =>
        !userReadLessions.some(
          (obj2) =>
            obj1.lesson_id === obj2.lesson_id &&
            obj1.course_id === obj2.course_id,
        ),
    );

    return {
      userUnReadLessions: userUnReadLessions,
      assignedRoadmapCount: userAssignedRoadmaps.assigned_roadmaps.length,
    };
  }

  private async resetUserReadingHistory(userID: number) {
    await this.userProgresssRepository.delete({
      user_id: userID,
    });
  }

  private async generateLessonToken() {
    // IMPLEMENTED TOKEN GENERATION
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 3);
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
    const token = await this.generateLessonToken();
    const tokenEntityResponse = await this.LessonTokenRepository.save({
      user_id: user_id,
      lesson_id: lesson_id,
      course_id: course_id,
      expiresAt: token.expiryTime,
      token: token.token,
    });

    return tokenEntityResponse;
  }

  private generateURL = (
    lesson_id: number,
    course_id: number,
    token: string,
  ) => {
    // SEND EMAIL TO USER
    const frontendURL = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';
    return `${frontendURL}/dashboard/daily-lesson/${lesson_id}?course_id=${course_id}&token=${token}`;
  };
}
