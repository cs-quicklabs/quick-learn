import { Injectable, Logger } from '@nestjs/common';
import { EmailNotification, Message } from '@quick-learn/email';
import mjml2html from 'mjml';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { SuccessResponse } from '@src/common/dto';
import * as fs from 'fs/promises';
import handlebars from 'handlebars';
import { emailSubjects } from '@src/common/constants/email-subject';
import { EnvironmentEnum } from '@src/common/constants/constants';

// handlebar helper functions
Handlebars.registerHelper('currentYear', function () {
  return new Date().getFullYear();
});
interface mailBody {
  greetings: string;
  fullName: string;
  lessonName: string;
  lessonURL: string;
  userEmail: string;
}
@Injectable()
export class EmailService {
  private emailService: EmailNotification;
  private readonly logger = new Logger('Email Service');
  private readonly frontendURL: string;
  private readonly isDevelopment: boolean;
  constructor(private configService: ConfigService) {
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
    this.isDevelopment =
      this.configService.get('ENV', { infer: true }) ===
      EnvironmentEnum.Developemnt;
    this.emailService = new EmailNotification(
      options,
      email,
      this.isDevelopment,
    );
    this.frontendURL = this.configService.get('app.frontendDomain', {
      infer: true,
    });
  }

  /**
   * Send email for the communication with the user
   * @param data of type Message { body: string; recipients: string[]; cc?: string[]; bcc?: string[]; subject: string; }
   * @returns true or throws error
   */
  async email(data: Message): Promise<void> {
    const emailText = data.body;
    const emailBody = await this.compileMjmlTemplate(emailText);

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

  /**
   * Generate the html for the email
   * @param body string
   * @returns html as a string for the email body
   */
  private async compileMjmlTemplate(body: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      './email-templates/notification.mjml',
    );
    const mjmlContent = await fs.readFile(templatePath, 'utf8');
    const { html } = mjml2html(mjmlContent);
    const compiledTemplate = Handlebars.compile(html);
    const mjmlCompliedContent = compiledTemplate({ body });
    return mjmlCompliedContent;
  }

  // This function is used to send the email to the user when the user forgets the password
  private async forgetPasswordEmail(emailBodies: string, email: string) {
    await this.emailService.send({
      body: emailBodies,
      recipients: [email],
      subject: emailSubjects.resetPassword,
    });

    return new SuccessResponse('Reset password link has been shared.');
  }

  async sendForgetPasswordEmail(resetURL: string, email: string) {
    const templatePath = path.join(
      __dirname,
      'email-templates/forget-password.mjml',
    );

    const mjmlTemplate = await fs.readFile(templatePath, 'utf8');

    const compiledTemplate = handlebars.compile(mjmlTemplate);

    const emailBodies = compiledTemplate({ resetURL });
    return this.forgetPasswordEmail(emailBodies, email);
  }

  // The below function is used to sen dthe lesson for the day to the user
  async dailyEmail(emailBodies: { userEmail: string; body: string }) {
    try {
      await this.emailService.send({
        recipients: [emailBodies.userEmail],
        body: emailBodies.body,
        subject: emailSubjects.LESSON_FOR_THE_DAY,
      });
      console.log('Email sent successfully to:', emailBodies.userEmail);
    } catch (err) {
      this.logger.error('Something went wrong:', JSON.stringify(err));
      throw new Error('Failed to send email.');
    }
  }

  async dailyLessonTemplate(mailBody: mailBody) {
    try {
      const templatePath = path.join(
        __dirname,
        'email-templates/daily-lesson.mjml',
      );

      const mjmlTemplate = await fs.readFile(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(mjmlTemplate);
      const mjmlContent = compiledTemplate(mailBody);
      const { html } = mjml2html(mjmlContent);
      return await this.dailyEmail({
        userEmail: mailBody.userEmail,
        body: html,
      });
    } catch (err) {
      this.logger.error('Error in dailyLessonTemplate:', err);
      throw new Error('Failed to compile and send daily lesson email.');
    }
  }

  // The below function is used to send the email to the user when the user has read all the lessons
  private async readAllLessonSucessEmail(
    email: string,
    mjmlCompliedContent: string,
  ): Promise<void> {
    try {
      await this.emailService.send({
        recipients: [email],
        body: mjmlCompliedContent,
        subject: emailSubjects.RESET_READING_HISTORY,
      });
    } catch (err) {
      this.logger.error('Something went wrong./n', JSON.stringify(err));
    }
  }

  async readAllLessonSucess(email: string) {
    const templatePath = path.join(
      __dirname,
      './email-templates/readAllLesson-success.mjml',
    );
    const mjmlContent = await fs.readFile(templatePath, 'utf8');
    const compiledTemplate = Handlebars.compile(mjmlContent);
    const mjmlCompliedContent = compiledTemplate({});
    return this.readAllLessonSucessEmail(email, mjmlCompliedContent);
  }

  // The below function is used to send the welcome email to the user
  private async welcomeEmailTemplate(
    email: string,
    mjmlCompliedContent: string,
  ) {
    try {
      await this.emailService.send({
        recipients: [email],
        body: mjmlCompliedContent,
        subject: emailSubjects.welcome,
      });
    } catch (err) {
      this.logger.error('Something went wrong:', JSON.stringify(err));
      throw new Error('Failed to send email.');
    }
  }

  async welcomeEmail(email: string) {
    const templatePath = path.join(
      __dirname,
      './email-templates/welcome-Email.mjml',
    );
    const mjmlContent = await fs.readFile(templatePath, 'utf8');
    const compiledTemplate = Handlebars.compile(mjmlContent);
    const loginUrl = `${this.frontendURL}/`;
    const mjmlCompliedContent = compiledTemplate({ loginUrl });
    return this.welcomeEmailTemplate(email, mjmlCompliedContent);
  }
}
