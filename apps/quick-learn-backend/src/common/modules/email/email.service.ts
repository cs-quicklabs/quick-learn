import { Injectable, Logger } from '@nestjs/common';
import { EmailNotification, Message } from '@quick-learn/email';
import mjml2html from 'mjml';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { SuccessResponse } from '@src/common/dto';
import * as fs from 'fs/promises';
import { emailSubjects } from '@src/common/constants/email-subject';
import { EnvironmentEnum } from '@src/common/constants/constants';

// handlebar helper functions
Handlebars.registerHelper('currentYear', function () {
  return new Date().getFullYear();
});
interface IMailBody {
  greetings: string;
  fullName: string;
  lessonName: string;
  lessonURL: string;
  userEmail: string;
}
interface ILeaderboardData {
  type: string;
  fullName: string;
  rank: number;
  totalMembers: number;
  leaderboardLink: string;
}
@Injectable()
export class EmailService {
  private emailService: EmailNotification;
  private readonly logger = new Logger('Email Service');
  private readonly frontendURL: string;
  constructor(private readonly configService: ConfigService) {
    // add a condition checking if the enviroment is dev or not.
    const email = this.configService.getOrThrow('app.smtpEmail', {
      infer: true,
    });
    const options = {
      host: this.configService.getOrThrow('app.smtpHost', { infer: true }),
      port: this.configService.getOrThrow('app.smtpPort', { infer: true }),
      auth: {
        user: this.configService.getOrThrow('app.smtpUser', { infer: true }),
        pass: this.configService.getOrThrow('app.smtpPass', { infer: true }),
      },
    };
    const isDevelopment =
      this.configService.get('ENV', { infer: true }) ===
      EnvironmentEnum.Developemnt;
    this.emailService = new EmailNotification(options, email, isDevelopment);
    this.frontendURL = this.configService.get('app.frontendDomain', {
      infer: true,
    });
  }

  /**
   * Send email for the communication with the user
   * @param data of type Message { body: string; recipients: string[]; cc?: string[]; bcc?: string[]; subject: string; }
   * @returns true or throws error
   */
  async notify(data: Message): Promise<void> {
    const emailBody = await this.compileMjmlTemplate(
      { body: data.body },
      'notification',
    );

    try {
      await this.emailService.send({
        ...data,
        body: emailBody,
        subject: data.subject,
      });
    } catch (err) {
      this.logger.error('Something went wrong./n', JSON.stringify(err));
    }
  }

  private async compileMjmlTemplate(
    body: Record<string, string>,
    templateName: string,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      `./email-templates/${templateName}.mjml`,
    );
    const mjmlContent = await fs.readFile(templatePath, 'utf8');
    const { html } = mjml2html(mjmlContent);
    const compiledTemplate = Handlebars.compile(html);
    return compiledTemplate(body);
  }

  // This function is used to send the email to the user when the user forgets the password
  async forgetPasswordEmail(resetURL: string, email: string) {
    const emailBody = await this.compileMjmlTemplate(
      { resetURL },
      'forget-password',
    );
    await this.emailService.send({
      body: emailBody,
      recipients: [email],
      subject: emailSubjects.resetPassword,
    });
    return new SuccessResponse('Reset password link has been shared.');
  }

  // The below function is used to send the lesson for the day to the user
  async dailyLessonTemplate(mailBody: IMailBody) {
    const emailBody = await this.compileMjmlTemplate(
      mailBody as unknown as Record<string, string>,
      'daily-lesson',
    );
    try {
      await this.emailService.send({
        recipients: [mailBody.userEmail],
        body: emailBody,
        subject: emailSubjects.LESSON_FOR_THE_DAY,
      });
    } catch (err) {
      this.logger.error('Something went wrong:', JSON.stringify(err));
      throw new Error('Failed to send email.');
    }
  }

  async leaderboardEmail(leaderboardData: ILeaderboardData, email: string) {
    const emailBody = await this.compileMjmlTemplate(
      leaderboardData as unknown as Record<string, string>,
      'leaderboard-template',
    );
    try {
      await this.emailService.send({
        recipients: [email],
        body: emailBody,
        subject: `${leaderboardData.type} Leaderboard`,
      });
    } catch (err) {
      this.logger.error('Something went wrong:', JSON.stringify(err));
      throw new Error('Failed to send email.');
    }
  }

  // The below function is used to send the email to the user when the user has read all the lessons
  async readAllLessonSucessEmail(email: string): Promise<void> {
    const emailBody = await this.compileMjmlTemplate(
      {},
      'readAllLesson-success',
    );
    try {
      await this.emailService.send({
        recipients: [email],
        body: emailBody,
        subject: emailSubjects.RESET_READING_HISTORY,
      });
    } catch (err) {
      this.logger.error('Something went wrong./n', JSON.stringify(err));
    }
  }

  // The below function is used to send the welcome email to the user

  async welcomeEmail(email: string) {
    const loginUrl = `${this.frontendURL}/`;
    const emailBody = await this.compileMjmlTemplate(
      { loginUrl },
      'welcome-Email',
    );
    try {
      await this.emailService.send({
        recipients: [email],
        body: emailBody,
        subject: emailSubjects.welcome,
      });
    } catch (err) {
      this.logger.error('Something went wrong:', JSON.stringify(err));
      throw new Error('Failed to send email.');
    }
  }
}
