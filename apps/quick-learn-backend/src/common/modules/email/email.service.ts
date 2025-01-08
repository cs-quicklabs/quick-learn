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
  constructor(private configService: ConfigService) {
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
    this.emailService = new EmailNotification(options, email);
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

  private async forgetPasswordEmail(emailBodies: string, email: string) {
    const emailBody = emailBodies;

    await this.emailService.send({
      body: emailBody,
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

  private async readAllLessonSucessEmail(
    email: string,
    mjmlCompliedContent: string,
  ): Promise<void> {
    const emailBody = mjmlCompliedContent;
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
}
